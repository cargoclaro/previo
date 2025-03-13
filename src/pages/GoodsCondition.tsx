import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import Button from '@/components/common/Button';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const GoodsCondition = () => {
  const navigate = useNavigate();
  
  const [goodPackagingCondition, setGoodPackagingCondition] = useState(false);
  const [hasSeals, setHasSeals] = useState(false);
  const [certifiedPallet, setCertifiedPallet] = useState(false);
  
  const [packagingPhoto, setPackagingPhoto] = useState<string | null>(null);
  const [sealsPhoto, setSealsPhoto] = useState<string | null>(null);
  const [palletPhoto, setPalletPhoto] = useState<string | null>(null);
  
  // Add state for previoId
  const [previoId, setPrevioId] = useState<string>('temp-inspection-id');
  
  // Initialize previoId from localStorage
  useEffect(() => {
    const previoHeader = localStorage.getItem('previoHeader');
    if (previoHeader) {
      try {
        const data = JSON.parse(previoHeader);
        if (data.id) {
          setPrevioId(data.id);
        }
      } catch (error) {
        console.error('Error parsing previo header:', error);
      }
    }
  }, []);

  const handleContinue = () => {
    // Check if required photos are captured based on toggle states
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

    // If validation passes, navigate to the next step
    navigate('/product-verification');
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Condición de Mercancía" showBackButton />
        
        <main className="flex-1 px-4 py-6 pb-20">
          <div className="container max-w-md mx-auto space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-xl font-medium">Verificación de Embalaje</h2>
              <p className="text-sm text-muted-foreground">
                Confirma el estado del embalaje de la mercancía
              </p>
            </div>
            
            <Card className="space-y-4">
              <ToggleSwitch
                label="¿Embalaje viene en buen estado?"
                checked={goodPackagingCondition}
                onChange={setGoodPackagingCondition}
              />
              
              {goodPackagingCondition && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <PhotoCapture
                    label="Captura Evidencia De Estado de Embalaje"
                    operationType="inspeccion"
                    operationId={previoId}
                    description="Estado del embalaje"
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
                    operationType="inspeccion"
                    operationId={previoId}
                    description="Sellos del embalaje"
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
                    operationType="inspeccion"
                    operationId={previoId}
                    description="Tarima certificada"
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
        
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="container max-w-md mx-auto">
            <Button
              className="w-full"
              onClick={handleContinue}
              icon={<ChevronRight size={18} />}
            >
              Continuar
            </Button>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default GoodsCondition;
