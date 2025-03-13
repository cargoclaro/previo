import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/common/Button';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import EmbalajeFormFields from '@/components/previo/EmbalajeFormFields';

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

  // Add these states to track previoId
  const [previoId, setPrevioId] = useState<string>('');
  
  // Get previoId from localStorage or URL params on component mount
  useEffect(() => {
    const previoHeader = localStorage.getItem('previoHeader');
    if (previoHeader) {
      const data = JSON.parse(previoHeader);
      if (data.id) {
        setPrevioId(data.id);
      }
    }
  }, []);

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
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-cargo-light/50">
        <Header title="Nuevo Previo - Datos de Embalaje" showBackButton />
        
        <main className="flex-1 pl-5 pr-0 py-4 pb-20">
          <div className="w-full max-w-3xl mx-auto">
            <EmbalajeFormFields
              headerData={headerData}
              updateField={updateField}
              goodPackagingCondition={goodPackagingCondition}
              setGoodPackagingCondition={setGoodPackagingCondition}
              hasSeals={hasSeals}
              setHasSeals={setHasSeals}
              certifiedPallet={certifiedPallet}
              setCertifiedPallet={setCertifiedPallet}
              setPackagingPhoto={setPackagingPhoto}
              setSealsPhoto={setSealsPhoto}
              setPalletPhoto={setPalletPhoto}
              previoId={previoId}
            />

            <div className="rounded-lg border border-border p-4 bg-amber-50/50 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                <p className="text-sm text-amber-700">
                  Recuerda verificar cuidadosamente y capturar evidencia clara de todas las condiciones del embalaje.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-cargo-gray/30 py-3 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-3xl mx-auto">
            <Button
              onClick={handleSubmit}
              className="w-full h-10 text-base font-medium bg-gradient-to-r from-cargo-orange to-orange-500 hover:from-cargo-orange/90 hover:to-orange-500/90 text-white shadow-sm"
            >
              Continuar a Productos
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EmbalajePrevio; 