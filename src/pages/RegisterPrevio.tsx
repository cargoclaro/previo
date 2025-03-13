import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ChevronRight } from 'lucide-react';
import PrevioFormFields from '@/components/previo/PrevioFormFields';
import { usePrevioForm } from '@/hooks/usePrevioForm';

const RegisterPrevio = () => {
  const { user } = useAuth();
  const { clientData, isSubmitting, updateField, handleSubmit } = usePrevioForm(user);

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-cargo-light/50">
        <Header title="Nuevo Previo - Datos del Cliente" showBackButton />
        
        <main className="flex-1 w-full px-3 py-4 pb-20">
          <div className="w-full max-w-md mx-auto">
            <Card className="w-full p-4 shadow-md border-cargo-gray/40 animate-scale-in">
              <PrevioFormFields
                clientData={clientData}
                updateField={updateField}
              />
            </Card>
          </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-cargo-gray/30 py-3 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-md mx-auto">
            <Button
              onClick={handleSubmit}
              className="w-full h-10 text-base font-medium bg-gradient-to-r from-cargo-orange to-orange-500 hover:from-cargo-orange/90 hover:to-orange-500/90 text-white shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : (
                <>
                  Continuar a Embalaje
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPrevio;
