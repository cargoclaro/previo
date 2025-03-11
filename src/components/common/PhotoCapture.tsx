
import React, { useState } from 'react';
import { Camera, CheckCircle2, ImageIcon } from 'lucide-react';
import Button from './Button';

interface PhotoCaptureProps {
  label: string;
  onPhotoCapture: (photoData: string) => void;
  required?: boolean;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ label, onPhotoCapture, required = false }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhoto(result);
        onPhotoCapture(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
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
      
      <div className="photo-container">
        {photo ? (
          <img 
            src={photo} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Sin imagen</p>
          </div>
        )}
      </div>
      
      <Button 
        type="button"
        variant="outline"
        className="w-full"
        icon={<Camera size={18} />}
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
