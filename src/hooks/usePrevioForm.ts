
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
      // Use the get_profile_by_auth_id function instead of querying profiles table directly
      // This avoids the RLS recursion issue
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_profile_by_auth_id', { auth_id: user.id })
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('No se pudo obtener información del perfil. Por favor contacte al soporte.');
      }
      
      if (!profileData.organization_id) {
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
          organization_id: profileData.organization_id,
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
