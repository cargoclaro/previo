import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import PageTransition from '@/components/layout/PageTransition';
import { ChevronRight, FileText, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Previo {
  id: string;
  client: string;
  date: string;
  entry: string;
  supplier: string;
  status: string;
}

const PedimentoSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrevio, setSelectedPrevio] = useState<string | null>(null);
  const [previos, setPrevios] = useState<Previo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchPrevios = async () => {
      try {
        // Get previos that are in progress
        const { data, error } = await supabase
          .from('previos')
          .select('id, client, date, entry, supplier, status')
          .eq('status', 'in-progress')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPrevios(data || []);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching previos:', error);
        toast.error('Error al cargar los previos');
        setIsLoading(false);
      }
    };
    
    fetchPrevios();
  }, [user]);

  const filteredPrevios = previos.filter(p => 
    p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.entry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartPrevio = async () => {
    if (!selectedPrevio) return;
    
    try {
      // Get the selected previo details
      const { data: previoData, error: previoError } = await supabase
        .from('previos')
        .select('*')
        .eq('id', selectedPrevio)
        .single();
      
      if (previoError) throw previoError;
      
      // Get the products for this previo
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('previo_id', selectedPrevio);
      
      if (productsError) throw productsError;
      
      // Convert to localStorage format for compatibility
      localStorage.setItem('previoHeader', JSON.stringify({
        client: previoData.client,
        date: previoData.date,
        entry: previoData.entry,
        supplier: previoData.supplier,
        packages: previoData.packages,
        packageType: previoData.package_type,
        carrier: previoData.carrier,
        totalWeight: previoData.total_weight,
        location: previoData.location,
        purchaseOrder: previoData.purchase_order,
        trackingNumber: previoData.tracking_number
      }));
      
      // If there are products, convert them to the expected format
      if (productsData && productsData.length > 0) {
        const formattedProducts = productsData.map(product => ({
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
      } else {
        localStorage.setItem('previoProducts', JSON.stringify([]));
      }
      
      // Navigate to product verification
      navigate('/product-verification');
    } catch (error: any) {
      console.error('Error starting previo:', error);
      toast.error('Error al iniciar el previo');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'En Progreso';
      case 'completed':
        return 'Completado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border border-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-50 border border-green-100';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-100';
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Continuar Previo" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container max-w-md mx-auto space-y-6 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Buscar por cliente, entrada o proveedor..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredPrevios.length > 0 ? (
              <div className="space-y-4">
                {filteredPrevios.map((previo) => (
                  <Card 
                    key={previo.id}
                    className={`transition-all duration-200 ${selectedPrevio === previo.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedPrevio(previo.id)}
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Header section with title and status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <div className="doc-icon">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{previo.entry}</h3>
                            <p className="text-sm text-muted-foreground">{previo.client}</p>
                            <Badge className={`mt-1.5 history-item-badge ${getStatusColor(previo.status)}`}>
                              {getStatusText(previo.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Info section */}
                      <div className="space-y-2">
                        <div className="history-item-date">
                          <span className="font-medium">Proveedor:</span> {previo.supplier}
                        </div>
                        <div className="history-item-date">
                          <span className="font-medium">Fecha:</span> {previo.date}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'No se encontraron resultados para tu búsqueda' 
                    : 'No hay previos en progreso'}
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => navigate('/register-previo')}
                >
                  Crear nuevo previo
                </Button>
              </div>
            )}

            <div className="pt-4">
              <Button
                className="w-full"
                disabled={!selectedPrevio}
                onClick={handleStartPrevio}
                icon={<ChevronRight size={18} />}
              >
                Continuar Previo
              </Button>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PedimentoSelection;
