
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface ClientData {
  client: string;
  date: string;
  entry: string;
  supplier: string;
  purchaseOrder: string;
  trackingNumber: string;
}

const RegisterPrevio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [clientData, setClientData] = useState<ClientData>({
    client: '',
    date: new Date().toISOString().split('T')[0],
    entry: '',
    supplier: '',
    purchaseOrder: '',
    trackingNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ClientData, value: string) => {
    setClientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para crear un previo');
      navigate('/auth');
      return;
    }
    
    // Basic validation
    const requiredFields = ['client', 'supplier', 'entry'] as const;
    const missingFields = requiredFields.filter(field => !clientData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Por favor complete los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user profile to get organization_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (!profileData.organization_id) {
        throw new Error('No se encontró la organización para este usuario');
      }
      
      // Create a new previo
      const { data: previoData, error: previoError } = await supabase
        .from('previos')
        .insert([
          {
            client: clientData.client,
            date: clientData.date,
            entry: clientData.entry,
            supplier: clientData.supplier,
            purchase_order: clientData.purchaseOrder,
            tracking_number: clientData.trackingNumber,
            status: 'in-progress',
            organization_id: profileData.organization_id,
            created_by: user.id
          }
        ])
        .select()
        .single();
      
      if (previoError) throw previoError;
      
      // Save to localStorage for compatibility with existing flow
      localStorage.setItem('previoHeader', JSON.stringify({
        ...clientData,
        packages: 0,
        packageType: '',
        carrier: '',
        totalWeight: 0,
        location: '',
        id: previoData.id // Add the ID for future reference
      }));
      
      // Initialize empty products array
      localStorage.setItem('previoProducts', JSON.stringify([]));
      
      toast.success('Previo creado correctamente');
      navigate('/embalaje-previo');
    } catch (error: any) {
      console.error('Error creating previo:', error);
      toast.error(error.message || 'Error al crear el previo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Nuevo Previo - Datos del Cliente" showBackButton />
        
        <main className="flex-1 px-4 py-6 pb-32">
          <div className="container max-w-3xl mx-auto space-y-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Cliente
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Input
                  value={clientData.client}
                  onChange={(e) => updateField('client', e.target.value)}
                  placeholder="Nombre del cliente"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Fecha
                </label>
                <Input
                  type="date"
                  value={clientData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Número de Entrada
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Input
                  value={clientData.entry}
                  onChange={(e) => updateField('entry', e.target.value)}
                  placeholder="Número de entrada"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Proveedor
                  <span className="text-destructive ml-1">*</span>
                </label>
                <Input
                  value={clientData.supplier}
                  onChange={(e) => updateField('supplier', e.target.value)}
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Orden de Compra
                </label>
                <Input
                  value={clientData.purchaseOrder}
                  onChange={(e) => updateField('purchaseOrder', e.target.value)}
                  placeholder="Número de orden de compra"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Número de Guía
                </label>
                <Input
                  value={clientData.trackingNumber}
                  onChange={(e) => updateField('trackingNumber', e.target.value)}
                  placeholder="Número de guía"
                />
              </div>
            </Card>
          </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="container max-w-3xl mx-auto p-4">
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : (
                <>
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Continuar a Embalaje
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
