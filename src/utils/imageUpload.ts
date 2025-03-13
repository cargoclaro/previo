import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export type OperationType = 'previo' | 'embalaje' | 'inspeccion' | 'despacho';

interface ImageMetadata {
  operationType: OperationType;
  operationId: string;
  productId?: string;
  description?: string;
}

// Namespace for generating deterministic UUIDs
const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

/**
 * Ensures a string is a valid UUID, generating one if it's not
 * @param id Any string ID
 * @returns A valid UUID
 */
const ensureUUID = (id: string): string => {
  // Check if already a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return id;
  }
  
  // Generate a deterministic UUID from the string
  return uuidv5(id, UUID_NAMESPACE);
};

/**
 * Uploads an image to Supabase Storage and saves its metadata
 * @param file The image file to upload
 * @param metadata Metadata about the operation and context
 * @returns The public URL of the uploaded image
 */
export const uploadOperationImage = async (
  file: File,
  metadata: ImageMetadata
): Promise<string> => {
  try {
    console.log('Starting image upload with metadata:', metadata);
    
    // Convert operationId to UUID if needed
    const operationId = ensureUUID(metadata.operationId);
    console.log('Using operationId:', operationId, '(original:', metadata.operationId, ')');
    
    // Convert productId to UUID if provided and not already a UUID
    let productId = metadata.productId;
    if (productId) {
      productId = ensureUUID(productId);
      console.log('Using productId:', productId, '(original:', metadata.productId, ')');
    }
    
    // Validate operationType is valid
    const validTypes = ['previo', 'embalaje', 'inspeccion', 'despacho'];
    if (!validTypes.includes(metadata.operationType)) {
      console.error('Invalid operationType:', metadata.operationType);
      throw new Error(`operationType must be one of: ${validTypes.join(', ')}`);
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create path based on operation type and IDs
    const basePath = `${metadata.operationType}/${operationId}`;
    const filePath = productId 
      ? `${basePath}/productos/${productId}/${fileName}`
      : `${basePath}/${fileName}`;
      
    console.log('File will be uploaded to path:', filePath);

    // Upload the file to Supabase Storage with metadata
    console.log('Starting Supabase upload...');
    const { data, error: uploadError } = await supabase.storage
      .from('fotos.mercancias')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Error uploading image to Supabase storage:', uploadError);
      throw uploadError;
    }
    
    console.log('File uploaded successfully:', data);

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('fotos.mercancias')
      .getPublicUrl(filePath);
      
    console.log('Got public URL:', urlData.publicUrl);

    // Save image metadata to the images table
    console.log('Saving metadata to database...');
    const { error: metadataError } = await supabase
      .from('operation_images')
      .insert([{
        url: urlData.publicUrl,
        operation_type: metadata.operationType,
        operation_id: operationId,
        product_id: productId,
        description: metadata.description,
        file_path: filePath
      }]);

    if (metadataError) {
      console.error('Error saving image metadata:', metadataError);
      // If metadata save fails, delete the uploaded file
      console.log('Attempting to delete the uploaded file due to metadata error');
      await supabase.storage
        .from('fotos.mercancias')
        .remove([filePath]);
      throw metadataError;
    }

    console.log('Image upload complete, returning URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadOperationImage:', error);
    throw error;
  }
};

/**
 * Deletes an image from Supabase Storage and its metadata
 * @param imageUrl The public URL of the image to delete
 */
export const deleteOperationImage = async (imageUrl: string): Promise<void> => {
  try {
    // Find the image metadata
    const { data: imageData, error: findError } = await supabase
      .from('operation_images')
      .select('file_path')
      .eq('url', imageUrl)
      .single();

    if (findError) {
      console.error('Error finding image metadata:', findError);
      throw findError;
    }

    // Delete the file from storage
    const { error: deleteError } = await supabase.storage
      .from('fotos.mercancias')
      .remove([imageData.file_path]);

    if (deleteError) {
      console.error('Error deleting image:', deleteError);
      throw deleteError;
    }

    // Delete the metadata
    const { error: metadataError } = await supabase
      .from('operation_images')
      .delete()
      .eq('url', imageUrl);

    if (metadataError) {
      console.error('Error deleting image metadata:', metadataError);
      throw metadataError;
    }
  } catch (error) {
    console.error('Error in deleteOperationImage:', error);
    throw error;
  }
};

/**
 * Retrieves all images for a specific operation
 * @param operationType The type of operation
 * @param operationId The ID of the operation
 * @param productId Optional product ID to filter by
 * @returns Array of image metadata
 */
export const getOperationImages = async (
  operationType: OperationType,
  operationId: string,
  productId?: string
) => {
  try {
    let query = supabase
      .from('operation_images')
      .select('*')
      .eq('operation_type', operationType)
      .eq('operation_id', operationId);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching operation images:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getOperationImages:', error);
    throw error;
  }
};

/**
 * Lists all images in a specific operation directory
 * @param operationType The type of operation
 * @param operationId The ID of the operation
 * @param productId Optional product ID to filter by
 * @returns Array of file listings with metadata
 */
export const listOperationImages = async (
  operationType: OperationType,
  operationId: string,
  productId?: string
) => {
  try {
    const path = productId 
      ? `${operationType}/${operationId}/productos/${productId}`
      : `${operationType}/${operationId}`;

    const { data, error } = await supabase.storage
      .from('fotos.mercancias')
      .list(path);

    if (error) {
      console.error('Error listing images:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in listOperationImages:', error);
    throw error;
  }
}; 