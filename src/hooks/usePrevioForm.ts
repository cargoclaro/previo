
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface ClientData {
  client: string;
  date: string;
  entry: string;
  supplier: string;
  purchaseOrder: string;
  trackingNumber: string;
}

export const usePrevioForm = (user: User | null) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    client: '',
    date: new Date().toISOString().split('T')[0],
    entry: '',
    supplier: '',
    purchaseOrder: '',
    trackingNumber: ''
  });

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
    
    const requiredFields = ['client', 'supplier', 'entry'] as const;
    const missingFields = requiredFields.filter(field => !clientData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Por favor complete los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simplify - directly fetch organization_id from profiles table
      // This is a simpler query that doesn't involve the problematic RPC function
      const { data: orgData, error: orgError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .limit(1);
      
      if (orgError) {
        console.error('Error fetching organization:', orgError);
        throw new Error('No se pudo obtener información de la organización. Por favor contacte al soporte.');
      }
      
      const organizationId = orgData && orgData.length > 0 ? orgData[0].organization_id : null;
      
      if (!organizationId) {
        throw new Error('No se encontró la organización para este usuario');
      }
      
      const { data: previoData, error: previoError } = await supabase
        .from('previos')
        .insert([{
          client: clientData.client,
          date: clientData.date,
          entry: clientData.entry,
          supplier: clientData.supplier,
          purchase_order: clientData.purchaseOrder,
          tracking_number: clientData.trackingNumber,
          status: 'in-progress',
          organization_id: organizationId,
          created_by: user.id
        }])
        .select()
        .single();
      
      if (previoError) {
        console.error('Error creating previo:', previoError);
        throw previoError;
      }
      
      localStorage.setItem('previoHeader', JSON.stringify({
        ...clientData,
        packages: 0,
        packageType: '',
        carrier: '',
        totalWeight: 0,
        location: '',
        id: previoData.id
      }));
      
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

  return {
    clientData,
    isSubmitting,
    updateField,
    handleSubmit
  };
};
