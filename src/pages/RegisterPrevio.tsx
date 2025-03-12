
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Building2, Calendar, FileInput, Package2, FileText, ChevronRight } from 'lucide-react';
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
      // Get user profile to get organization_id using the direct query
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('No se pudo obtener información del perfil. Por favor contacte al soporte.');
      }
      
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
      
      if (previoError) {
        console.error('Error creating previo:', previoError);
        throw previoError;
      }
      
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
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-cargo-light/50">
        <Header title="Nuevo Previo - Datos del Cliente" showBackButton />
        
        <main className="flex-1 w-full px-4 py-6 pb-24">
          <div className="w-full max-w-md mx-auto">
            <Card className="w-full p-5 shadow-md border-cargo-gray/40 animate-scale-in">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Building2 className="w-4 h-4 text-cargo-orange" />
                    Cliente
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={clientData.client}
                    onChange={(e) => updateField('client', e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-cargo-orange" />
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={clientData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <FileInput className="w-4 h-4 text-cargo-orange" />
                    Número de Entrada
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={clientData.entry}
                    onChange={(e) => updateField('entry', e.target.value)}
                    placeholder="Número de entrada"
                    className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Building2 className="w-4 h-4 text-cargo-orange" />
                    Proveedor
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={clientData.supplier}
                    onChange={(e) => updateField('supplier', e.target.value)}
                    placeholder="Nombre del proveedor"
                    className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Package2 className="w-4 h-4 text-cargo-orange" />
                    Orden de Compra
                  </label>
                  <Input
                    value={clientData.purchaseOrder}
                    onChange={(e) => updateField('purchaseOrder', e.target.value)}
                    placeholder="Número de orden de compra"
                    className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <FileText className="w-4 h-4 text-cargo-orange" />
                    Número de Guía
                  </label>
                  <Input
                    value={clientData.trackingNumber}
                    onChange={(e) => updateField('trackingNumber', e.target.value)}
                    placeholder="Número de guía"
                    className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                  />
                </div>
              </div>
            </Card>
          </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-cargo-gray/30 py-4 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-md mx-auto">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-cargo-orange to-orange-500 hover:from-cargo-orange/90 hover:to-orange-500/90 text-white shadow-sm"
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
