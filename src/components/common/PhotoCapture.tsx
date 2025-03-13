import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, ImageIcon, Loader2, X } from 'lucide-react';
import Button from './Button';
import { uploadOperationImage, deleteOperationImage, OperationType } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface PhotoCaptureProps {
  label: string;
  operationType: OperationType;
  operationId: string;
  productId?: string;
  description?: string;
  onPhotoCapture: (imageUrl: string) => void;
  onPhotoDelete?: () => void;
  initialImageUrl?: string;
  required?: boolean;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ 
  label, 
  operationType,
  operationId,
  productId,
  description,
  onPhotoCapture,
  onPhotoDelete,
  initialImageUrl,
  required = false 
}) => {
  const [photo, setPhoto] = useState<string | null>(initialImageUrl || null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setPhoto(initialImageUrl);
    }
  }, [initialImageUrl]);
  
  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Tipo de archivo no válido. Por favor, use JPG, PNG o WebP.');
        return;
      }
      
      // Max size: 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('La imagen es demasiado grande. Tamaño máximo: 5MB');
        return;
      }
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhoto(result);
      };
      reader.readAsDataURL(file);

      console.log('Uploading image with params:', {
        operationType,
        operationId,
        productId,
        description,
        fileType: file.type,
        fileSize: file.size
      });

      // Upload to Supabase
      try {
        const imageUrl = await uploadOperationImage(file, {
          operationType,
          operationId,
          productId,
          description
        });
        onPhotoCapture(imageUrl);
        toast.success('Imagen guardada correctamente');
      } catch (uploadError: any) {
        console.error('Upload operation failed:', uploadError);
        toast.error(`Error al guardar la imagen: ${uploadError.message || 'Error desconocido'}`);
        setPhoto(null);
      }
    } catch (error: any) {
      console.error('Error handling photo capture:', error);
      toast.error(`Error al guardar la imagen: ${error.message || 'Error desconocido'}`);
      setPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!photo || !onPhotoDelete) return;

    try {
      setLoading(true);
      await deleteOperationImage(photo);
      setPhoto(null);
      onPhotoDelete();
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Error al eliminar la imagen');
    } finally {
      setLoading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {photo && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 size={12} /> Capturado</span>}
      </div>
      
      <div className="photo-container relative group">
        {photo ? (
          <>
            <img 
              src={photo} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
            {onPhotoDelete && (
              <button
                onClick={handleDelete}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={loading}
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Sin imagen</p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>
      
      <Button 
        type="button"
        variant="outline"
        className="w-full"
        icon={loading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
        onClick={triggerFileInput}
        disabled={loading}
      >
        {photo ? 'Cambiar imagen' : 'Capturar imagen'}
      </Button>
      
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleCapture}
      />
    </div>
  );
};

export default PhotoCapture;
