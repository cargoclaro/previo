import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface PrevioHeaderData {
  client: string;
  date: string;
  entry: string;
  supplier: string;
  packages: number;
  packageType: string;
  carrier: string;
  totalWeight: number;
  location: string;
  purchaseOrder: string;
  trackingNumber: string;
}

const EmbalajePrevio = () => {
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState<PrevioHeaderData>({
    client: '',
    date: '',
    entry: '',
    supplier: '',
    packages: 0,
    packageType: '',
    carrier: '',
    totalWeight: 0,
    location: '',
    purchaseOrder: '',
    trackingNumber: ''
  });

  // State for package condition
  const [goodPackagingCondition, setGoodPackagingCondition] = useState(false);
  const [hasSeals, setHasSeals] = useState(false);
  const [certifiedPallet, setCertifiedPallet] = useState(false);
  
  // State for photos
  const [packagingPhoto, setPackagingPhoto] = useState<string | null>(null);
  const [sealsPhoto, setSealsPhoto] = useState<string | null>(null);
  const [palletPhoto, setPalletPhoto] = useState<string | null>(null);

  useEffect(() => {
    // Load existing header data
    const savedHeader = localStorage.getItem('previoHeader');
    if (savedHeader) {
      setHeaderData(JSON.parse(savedHeader));
    } else {
      toast.error('No se encontraron datos del cliente');
      navigate('/register-previo');
    }
  }, [navigate]);

  const updateField = (field: keyof PrevioHeaderData, value: string | number) => {
    setHeaderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const packageTypes = [
    { value: 'cajas', label: 'Cajas' },
    { value: 'pallets', label: 'Pallets' },
    { value: 'bultos', label: 'Bultos' },
    { value: 'contenedor', label: 'Contenedor' },
  ];

  const handleSubmit = () => {
    // Basic validation for package details
    if (!headerData.packages || headerData.packages <= 0) {
      toast.error('Por favor ingrese la cantidad de bultos');
      return;
    }
    if (!headerData.packageType) {
      toast.error('Por favor seleccione el tipo de bulto');
      return;
    }
    if (!headerData.carrier) {
      toast.error('Por favor ingrese la línea transportista');
      return;
    }
    if (!headerData.totalWeight || headerData.totalWeight <= 0) {
      toast.error('Por favor ingrese el peso total');
      return;
    }

    // Validate photos based on condition states
    if (goodPackagingCondition && !packagingPhoto) {
      toast.error('Captura la evidencia del embalaje antes de continuar');
      return;
    }

    if (hasSeals && !sealsPhoto) {
      toast.error('Captura la evidencia de los sellos antes de continuar');
      return;
    }

    if (certifiedPallet && !palletPhoto) {
      toast.error('Captura la foto de la tarima antes de continuar');
      return;
    }
    
    // Save all header data to localStorage
    localStorage.setItem('previoHeader', JSON.stringify({
      ...headerData,
      packagingCondition: {
        isGood: goodPackagingCondition,
        hasSeals,
        certifiedPallet,
        photos: {
          packaging: packagingPhoto,
          seals: sealsPhoto,
          pallet: palletPhoto
        }
      }
    }));
    
    // Navigate to product verification
    navigate('/product-verification');
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Nuevo Previo - Datos de Embalaje" showBackButton />
        
        <main className="flex-1 px-4 py-6 pb-32">
          <div className="container max-w-3xl mx-auto space-y-6">
            {/* Client Summary */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Resumen del Cliente</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Cliente:</p>
                  <p className="text-gray-600">{headerData.client}</p>
                </div>
                <div>
                  <p className="font-medium">Entrada:</p>
                  <p className="text-gray-600">{headerData.entry}</p>
                </div>
              </div>
            </Card>

            {/* Packaging Details */}
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Cantidad de Bultos
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Input
                  type="number"
                  value={headerData.packages || ''}
                  onChange={(e) => updateField('packages', parseInt(e.target.value) || 0)}
                  placeholder="Cantidad de bultos"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tipo de Bulto
                  <span className="text-destructive ml-1">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={headerData.packageType}
                  onChange={(e) => updateField('packageType', e.target.value)}
                >
                  <option value="">Seleccione tipo de bulto</option>
                  {packageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Línea Transportista
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Input
                  value={headerData.carrier}
                  onChange={(e) => updateField('carrier', e.target.value)}
                  placeholder="Nombre de la línea transportista"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Peso Total (lbs)
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Input
                  type="number"
                  value={headerData.totalWeight || ''}
                  onChange={(e) => updateField('totalWeight', parseFloat(e.target.value) || 0)}
                  placeholder="Peso total en libras"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Ubicación
                </label>
                <Input
                  value={headerData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Ubicación del embarque"
                />
              </div>
            </Card>

            {/* Package Condition */}
            <Card className="p-6 space-y-6">
              <h3 className="font-medium">Condición del Embalaje</h3>
              
              <ToggleSwitch
                label="¿Embalaje viene en buen estado?"
                checked={goodPackagingCondition}
                onChange={setGoodPackagingCondition}
              />
              
              {goodPackagingCondition && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <PhotoCapture
                    label="Captura Evidencia De Estado de Embalaje"
                    onPhotoCapture={(photo) => setPackagingPhoto(photo)}
                    required
                  />
                </div>
              )}
              
              <ToggleSwitch
                label="¿El embalaje cuenta con sellos?"
                checked={hasSeals}
                onChange={setHasSeals}
              />
              
              {hasSeals && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <PhotoCapture
                    label="Captura Evidencia de Sellos de Embalaje"
                    onPhotoCapture={(photo) => setSealsPhoto(photo)}
                    required
                  />
                </div>
              )}
              
              <ToggleSwitch
                label="¿Tarima Certificada?"
                checked={certifiedPallet}
                onChange={setCertifiedPallet}
              />
              
              {certifiedPallet && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <PhotoCapture
                    label="Tomar foto de Tarima"
                    onPhotoCapture={(photo) => setPalletPhoto(photo)}
                    required
                  />
                </div>
              )}
            </Card>

            <div className="rounded-lg border border-border p-4 bg-amber-50/50">
              <div className="flex gap-3">
                <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                <p className="text-sm text-amber-700">
                  Recuerda verificar cuidadosamente y capturar evidencia clara de todas las condiciones del embalaje.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="container max-w-3xl mx-auto p-4">
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ChevronRight className="w-5 h-5 mr-2" />
              Continuar a Productos
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EmbalajePrevio; 