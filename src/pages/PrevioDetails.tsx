import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { FileDown, ArrowRight, Package, ShoppingBag, Calendar, User, Truck, MapPin, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { generatePrevioPDF } from '@/utils/pdfGenerator';

interface PrevioData {
  id: string;
  client: string;
  date: string;
  entry: string;
  supplier: string;
  packages: number;
  package_type: string;
  carrier: string;
  total_weight: number;
  location: string;
  purchase_order: string;
  tracking_number: string;
  status: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number;
  serial_number: string;
  image_url: string;
}

const PrevioDetails = () => {
  const { previoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [previo, setPrevio] = useState<PrevioData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !previoId) return;
    
    const fetchPrevioData = async () => {
      try {
        // Fetch previo header
        const { data: previoData, error: previoError } = await supabase
          .from('previos')
          .select('*')
          .eq('id', previoId)
          .single();
        
        if (previoError) throw previoError;
        
        setPrevio(previoData);
        
        // Fetch previo products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('previo_id', previoId);
        
        if (productsError) throw productsError;
        
        setProducts(productsData || []);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching previo data:', error);
        toast.error('Error al cargar los datos del previo');
        setIsLoading(false);
      }
    };
    
    fetchPrevioData();
  }, [user, previoId]);

  const handleDownloadPDF = () => {
    if (!previo) return;
    
    try {
      // Convert Supabase data structure to the format expected by the PDF generator
      const headerData = {
        client: previo.client,
        date: previo.date,
        entry: previo.entry,
        supplier: previo.supplier,
        packages: previo.packages,
        packageType: previo.package_type,
        carrier: previo.carrier,
        totalWeight: previo.total_weight,
        location: previo.location,
        purchaseOrder: previo.purchase_order,
        trackingNumber: previo.tracking_number
      };
      
      // Convert products to format expected by PDF generator
      const formattedProducts = products.map(product => ({
        id: product.id,
        code: '',
        detailedDescription: product.description || '',
        quantity: product.quantity,
        unitOfMeasure: '',
        weight: product.weight,
        origin: '',
        matchesInvoice: true,
        discrepancy: '',
        productPhoto: product.image_url,
        hasLabel: false,
        labelPhoto: null,
        hasSerialNumber: !!product.serial_number,
        serialNumber: product.serial_number || '',
        serialPhoto: null,
        hasModel: false,
        modelNumber: ''
      }));
      
      generatePrevioPDF(headerData, formattedProducts, `previo_${previo.entry || previoId}.pdf`);
      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error al descargar el PDF');
    }
  };

  const handleContinuePrevio = () => {
    if (!previo) return;
    
    // Save the previo data to localStorage for the existing flow to work
    localStorage.setItem('previoHeader', JSON.stringify({
      client: previo.client,
      date: previo.date,
      entry: previo.entry,
      supplier: previo.supplier,
      packages: previo.packages,
      packageType: previo.package_type,
      carrier: previo.carrier,
      totalWeight: previo.total_weight,
      location: previo.location,
      purchaseOrder: previo.purchase_order,
      trackingNumber: previo.tracking_number
    }));
    
    // Convert products to format expected by the product verification page
    const formattedProducts = products.map(product => ({
      id: product.id,
      code: '',
      detailedDescription: product.description || '',
      quantity: product.quantity,
      unitOfMeasure: '',
      weight: product.weight,
      origin: '',
      matchesInvoice: true,
      discrepancy: '',
      productPhoto: product.image_url,
      hasLabel: false,
      labelPhoto: null,
      hasSerialNumber: !!product.serial_number,
      serialNumber: product.serial_number || '',
      serialPhoto: null,
      hasModel: false,
      modelNumber: ''
    }));
    
    localStorage.setItem('previoProducts', JSON.stringify(formattedProducts));
    
    // Navigate to the appropriate page based on the previo status
    if (previo.status === 'in-progress') {
      navigate('/product-verification');
    } else {
      navigate('/previo-preview');
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Detalles del Previo" showBackButton />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </main>
        </div>
      </PageTransition>
    );
  }

  if (!previo) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Detalles del Previo" showBackButton />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600">Previo no encontrado</p>
              <Button className="mt-4" onClick={() => navigate('/previos-history')}>
                Volver al Historial
              </Button>
            </div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Detalles del Previo" showBackButton />
        
        <main className="flex-1 pl-5 pr-0 py-6">
          <div className="container max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Previo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <User className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-medium">{previo.client}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{previo.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ClipboardList className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Entrada</p>
                    <p className="font-medium">{previo.entry}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Proveedor</p>
                    <p className="font-medium">{previo.supplier}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Bultos</p>
                    <p className="font-medium">{previo.packages} {previo.package_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Truck className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Transportista</p>
                    <p className="font-medium">{previo.carrier || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="font-medium">{previo.location || 'No especificada'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="text-orange-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Peso Total</p>
                    <p className="font-medium">{previo.total_weight} lbs</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleDownloadPDF}
                  className="flex-1"
                >
                  <FileDown className="mr-2" size={18} />
                  Descargar PDF
                </Button>
                
                <Button 
                  onClick={handleContinuePrevio}
                  className="flex-1"
                  variant="secondary"
                >
                  <ArrowRight className="mr-2" size={18} />
                  {previo.status === 'in-progress' ? 'Continuar Previo' : 'Ver Previo'}
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos ({products.length})</h2>
              
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Cantidad</p>
                          <p className="font-medium">{product.quantity}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Peso</p>
                          <p className="font-medium">{product.weight} lbs</p>
                        </div>
                        
                        {product.serial_number && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Número de Serie</p>
                            <p className="font-medium">{product.serial_number}</p>
                          </div>
                        )}
                      </div>
                      
                      {product.image_url && (
                        <div className="mt-3">
                          <p className="text-gray-500 text-sm mb-1">Imagen</p>
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay productos registrados en este previo</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PrevioDetails;
