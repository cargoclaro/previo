import React, { useState } from 'react';
import { X, ZoomIn, Download, Camera } from 'lucide-react';
import { getOperationImages, OperationType } from '@/utils/imageUpload';

interface PhotoGalleryProps {
  operationId: string;
  operationType: OperationType;
  productId?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  operation_type: OperationType;
  description: string;
  product_id?: string;
  created_at: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  operationId,
  operationType,
  productId
}) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  // Load images on component mount
  React.useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getOperationImages(operationType, operationId, productId);
        setImages(data || []);
      } catch (error) {
        console.error('Error loading images:', error);
        setError('No se pudieron cargar las imágenes');
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [operationId, operationType, productId]);
  
  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full p-6 text-center text-gray-500">
        <p>{error}</p>
      </div>
    );
  }
  
  if (images.length === 0) {
    return (
      <div className="w-full p-6 text-center text-gray-500 flex flex-col items-center gap-2">
        <Camera className="w-8 h-8 text-gray-300" />
        <p>No hay imágenes disponibles</p>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const downloadImage = (url: string, description: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${description || 'imagen'}_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="aspect-square relative rounded-md overflow-hidden border border-gray-200 group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img 
              src={image.url} 
              alt={image.description || 'Imagen de operación'} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
            {image.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                {image.description}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Modal for viewing selected image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-medium">
                {selectedImage.description || 'Imagen de operación'}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadImage(selectedImage.url, selectedImage.description)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="relative aspect-video bg-gray-50">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.description || 'Imagen de operación'} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 text-sm">
              <p><b>Tipo de operación:</b> {selectedImage.operation_type}</p>
              {selectedImage.product_id && <p><b>ID de producto:</b> {selectedImage.product_id}</p>}
              <p><b>Fecha:</b> {formatDate(selectedImage.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery; 