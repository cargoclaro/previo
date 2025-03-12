
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/common/Button';
import { FileDown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generatePrevioPDF, generatePrevioDataURL } from '@/utils/pdfGenerator';

interface PrevioHeaderData {
  id?: string;
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

const PrevioComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [headerData, setHeaderData] = useState<PrevioHeaderData | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHeader = localStorage.getItem('previoHeader');
        const savedProducts = localStorage.getItem('previoProducts');
        
        if (!savedHeader || !savedProducts) {
          toast.error('No se encontraron datos del previo');
          navigate('/');
          return;
        }

        const headerData = JSON.parse(savedHeader);
        const productsData = JSON.parse(savedProducts);
        setHeaderData(headerData);
        setProducts(productsData);
        
        // If coming from a new previo (not yet finalized), save it to Supabase
        if (headerData.id && user) {
          await savePrevioToSupabase(headerData, productsData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos del previo');
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, user]);

  const savePrevioToSupabase = async (header: PrevioHeaderData, products: any[]) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const existingPrevioId = header.id;
      
      // Check if previo exists in Supabase
      if (existingPrevioId) {
        // Update the existing previo
        const { error: updateError } = await supabase
          .from('previos')
          .update({
            client: header.client,
            date: header.date,
            entry: header.entry,
            supplier: header.supplier,
            packages: header.packages,
            package_type: header.packageType,
            carrier: header.carrier,
            total_weight: header.totalWeight,
            location: header.location,
            purchase_order: header.purchaseOrder,
            tracking_number: header.trackingNumber,
            status: 'completed'
          })
          .eq('id', existingPrevioId);
        
        if (updateError) throw updateError;
        
        // Delete existing products for this previo
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('previo_id', existingPrevioId);
        
        if (deleteError) throw deleteError;
        
        // Insert new products
        for (const product of products) {
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              previo_id: existingPrevioId,
              name: product.detailedDescription || 'Producto sin descripción',
              description: product.detailedDescription,
              quantity: product.quantity,
              weight: product.weight,
              serial_number: product.serialNumber,
              image_url: product.productPhoto
            });
          
          if (insertError) throw insertError;
        }
      } else {
        // Create new previo
        const { data: newPrevio, error: insertPrevioError } = await supabase
          .from('previos')
          .insert({
            client: header.client,
            date: header.date,
            entry: header.entry,
            supplier: header.supplier,
            packages: header.packages,
            package_type: header.packageType,
            carrier: header.carrier,
            total_weight: header.totalWeight,
            location: header.location,
            purchase_order: header.purchaseOrder,
            tracking_number: header.trackingNumber,
            status: 'completed',
            organization_id: user.id, // Use user ID as a fallback for organization ID
            created_by: user.id
          })
          .select()
          .single();
        
        if (insertPrevioError) throw insertPrevioError;
        
        // Insert products
        for (const product of products) {
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              previo_id: newPrevio.id,
              name: product.detailedDescription || 'Producto sin descripción',
              description: product.detailedDescription,
              quantity: product.quantity,
              weight: product.weight,
              serial_number: product.serialNumber,
              image_url: product.productPhoto
            });
          
          if (insertError) throw insertError;
        }
      }
      
      toast.success('Previo guardado correctamente');
    } catch (error: any) {
      console.error('Error saving previo to Supabase:', error);
      toast.error('Error al guardar el previo: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    try {
      if (!headerData || !products) return;
      generatePrevioPDF(headerData, products, `previo_${headerData.entry || 'nuevo'}.pdf`);
      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error al descargar el PDF');
    }
  };

  const handleReturnHome = () => {
    localStorage.removeItem('previoHeader');
    localStorage.removeItem('previoProducts');
    navigate('/');
  };

  if (isLoading || isSaving) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Procesando Previo" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
              <div className="text-lg">
                {isSaving ? 'Guardando previo...' : 'Generando documento...'}
              </div>
              <div className="text-sm text-gray-500">Por favor espere</div>
            </div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-orange-50">
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md mx-auto text-center space-y-6">
            <div className="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md">
              <CheckCircle className="w-16 h-16 text-orange-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800">¡Previo Completado!</h1>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="grid grid-cols-2 gap-4 text-sm mb-6 text-left">
                <div>
                  <p className="font-medium">Cliente:</p>
                  <p className="text-gray-600">{headerData?.client}</p>
                </div>
                <div>
                  <p className="font-medium">Entrada:</p>
                  <p className="text-gray-600">{headerData?.entry}</p>
                </div>
                <div>
                  <p className="font-medium">Productos:</p>
                  <p className="text-gray-600">{products.length}</p>
                </div>
                <div>
                  <p className="font-medium">Peso Total:</p>
                  <p className="text-gray-600">{headerData?.totalWeight} lbs</p>
                </div>
              </div>
              
              <Button
                onClick={handleDownload}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Descargar PDF
              </Button>
            </div>
            
            <Button
              onClick={handleReturnHome}
              variant="outline"
              className="text-orange-700 hover:text-orange-800 font-medium"
            >
              Volver al inicio
            </Button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PrevioComplete;
