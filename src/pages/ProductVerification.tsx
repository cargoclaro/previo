
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import Button from '@/components/common/Button';
import { ChevronRight, Camera, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

const ProductVerification = () => {
  const navigate = useNavigate();
  
  const [matchesInvoice, setMatchesInvoice] = useState(true);
  const [discrepancy, setDiscrepancy] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [productDescription, setProductDescription] = useState('');
  
  const [productPhoto, setProductPhoto] = useState<string | null>(null);
  const [hasLabel, setHasLabel] = useState(false);
  const [labelPhoto, setLabelPhoto] = useState<string | null>(null);
  
  const [hasSerialNumber, setHasSerialNumber] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [serialPhoto, setSerialPhoto] = useState<string | null>(null);
  
  const [hasModel, setHasModel] = useState(false);
  const [modelNumber, setModelNumber] = useState('');

  // Mock product options
  const productOptions = [
    { value: 'electronica', label: 'Electrónicos' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'quimicos', label: 'Químicos' },
    { value: 'maquinaria', label: 'Maquinaria' },
  ];

  // Mock origin options
  const originOptions = [
    { value: 'china', label: 'China' },
    { value: 'usa', label: 'Estados Unidos' },
    { value: 'mexico', label: 'México' },
    { value: 'europa', label: 'Europa' },
    { value: 'japon', label: 'Japón' },
  ];

  const handleSubmit = () => {
    // Validate required fields
    if (!productPhoto) {
      toast.error('Debes capturar una foto del producto');
      return;
    }

    if (hasLabel && !labelPhoto) {
      toast.error('Debes capturar una foto del etiquetado');
      return;
    }

    if (hasSerialNumber && (!serialNumber || !serialPhoto)) {
      toast.error('Debes ingresar y capturar el número de serie');
      return;
    }

    if (hasModel && !modelNumber) {
      toast.error('Debes ingresar el número de modelo');
      return;
    }

    // If everything is valid, show success message and navigate
    toast.success('Verificación de producto completada correctamente');
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Verificación de Producto" showBackButton />
        
        <main className="flex-1 px-4 py-6 pb-20">
          <div className="container max-w-md mx-auto space-y-6 animate-slide-up">
            <div className="space-y-4">
              <Card className="space-y-4">
                <h3 className="text-lg font-medium">Información del Producto</h3>
                
                <ToggleSwitch
                  label="¿El producto coincide con la información en factura?"
                  checked={matchesInvoice}
                  onChange={setMatchesInvoice}
                />
                
                {!matchesInvoice && (
                  <div className="pl-4 border-l-2 border-destructive/20 space-y-2">
                    <label className="text-sm font-medium">
                      Registra la discrepancia
                      <span className="text-destructive ml-1">*</span>
                    </label>
                    <textarea
                      className="w-full h-24 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={discrepancy}
                      onChange={(e) => setDiscrepancy(e.target.value)}
                      placeholder="Describe la diferencia encontrada respecto a la factura..."
                    ></textarea>
                  </div>
                )}
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Producto<span className="text-destructive ml-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Seleccionar producto</option>
                      {productOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Origen<span className="text-destructive ml-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={selectedOrigin}
                      onChange={(e) => setSelectedOrigin(e.target.value)}
                    >
                      <option value="">Seleccionar origen</option>
                      {originOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Descripción del producto<span className="text-destructive ml-1">*</span>
                    </label>
                    <textarea
                      className="w-full h-24 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Describe el producto detalladamente..."
                    ></textarea>
                  </div>
                </div>
              </Card>
              
              <Card className="space-y-4">
                <h3 className="text-lg font-medium">Documentación Fotográfica</h3>
                
                <PhotoCapture
                  label="Capturar Foto de Producto"
                  onPhotoCapture={(photo) => setProductPhoto(photo)}
                  required
                />
                
                <ToggleSwitch
                  label="¿Producto Cuenta con Etiquetado?"
                  checked={hasLabel}
                  onChange={setHasLabel}
                />
                
                {hasLabel && (
                  <div className="pl-4 border-l-2 border-primary/20">
                    <PhotoCapture
                      label="Captura foto de Etiquetado"
                      onPhotoCapture={(photo) => setLabelPhoto(photo)}
                      required
                    />
                  </div>
                )}
                
                <ToggleSwitch
                  label="¿Producto Tiene Número de Serie?"
                  checked={hasSerialNumber}
                  onChange={setHasSerialNumber}
                />
                
                {hasSerialNumber && (
                  <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Ingresar número de serie
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        placeholder="Ej. SN12345678"
                      />
                    </div>
                    
                    <PhotoCapture
                      label="Capturar Número de Serie"
                      onPhotoCapture={(photo) => setSerialPhoto(photo)}
                      required
                    />
                  </div>
                )}
                
                <ToggleSwitch
                  label="¿Producto Tiene Modelo?"
                  checked={hasModel}
                  onChange={setHasModel}
                />
                
                {hasModel && (
                  <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                    <label className="text-sm font-medium">
                      Ingresar modelo
                      <span className="text-destructive ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={modelNumber}
                      onChange={(e) => setModelNumber(e.target.value)}
                      placeholder="Ej. MD-2023-X"
                    />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="container max-w-md mx-auto">
            <Button
              className="w-full"
              onClick={handleSubmit}
              icon={<Check size={18} />}
            >
              Finalizar Verificación
            </Button>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default ProductVerification;
