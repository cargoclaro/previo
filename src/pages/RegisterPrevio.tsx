
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import PageTransition from '@/components/layout/PageTransition';
import { ChevronRight, Clipboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterPrevio = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/goods-condition');
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Registro de Nuevo Previo" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container max-w-md mx-auto space-y-6 animate-slide-up">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <Clipboard size={20} className="text-primary" />
                    Información del Previo
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ingresa la información necesaria para registrar un nuevo previo
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="pedimento">Número de Pedimento</Label>
                    <Input 
                      id="pedimento" 
                      placeholder="Ej. 21 43 3821 1234567" 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Input 
                      id="client" 
                      placeholder="Nombre del cliente" 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      required
                      defaultValue={new Date().toISOString().substr(0, 10)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <textarea 
                      id="notes" 
                      placeholder="Información adicional..."
                      className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  type="submit"
                  icon={<ChevronRight size={18} />}
                >
                  Continuar al Previo
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default RegisterPrevio;
