import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { supabase } from '@/integrations/supabase/client';
import { Search, FilePlus, Image, Package2, ExternalLink, CheckCircle2, Clock, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface PrevioSummary {
  id: string;
  client: string;
  date: string;
  entry: string;
  supplier: string;
  status: string;
  created_at: string;
  packages: number;
  product_count?: number;
  image_count?: number;
}

const PrevioList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [previos, setPrevios] = useState<PrevioSummary[]>([]);
  const [filteredPrevios, setFilteredPrevios] = useState<PrevioSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load previos data
  useEffect(() => {
    const fetchPrevios = async () => {
      setLoading(true);
      
      try {
        // Get all previos
        const { data: previosData, error: previosError } = await supabase
          .from('previos')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (previosError) {
          throw previosError;
        }
        
        // Get product counts for each previo
        const previoIds = previosData.map(p => p.id);
        
        // Get basic product info and count them manually in JavaScript
        const { data: allProducts, error: productError } = await supabase
          .from('products')
          .select('previo_id')
          .in('previo_id', previoIds);

        if (productError) {
          console.error('Error fetching products:', productError);
        }

        // Create product counts map
        const productCounts = allProducts ? 
          previoIds.map(id => ({
            previo_id: id,
            count: allProducts.filter(p => p.previo_id === id).length
          })) : [];

        // Get basic image info and count them manually in JavaScript
        const { data: allImages, error: imageError } = await supabase
          .from('operation_images')
          .select('operation_id')
          .in('operation_id', previoIds);

        if (imageError) {
          console.error('Error fetching images:', imageError);
        }

        // Create image counts map
        const imageCounts = allImages ? 
          previoIds.map(id => ({
            operation_id: id,
            count: allImages.filter(i => i.operation_id === id).length
          })) : [];
        
        // Format previos data
        const formattedPrevios = previosData.map(previo => {
          const productCount = productCounts?.find((p: { previo_id: string; count: number }) => p.previo_id === previo.id)?.count || 0;
          const imageCount = imageCounts?.find((i: { operation_id: string; count: number }) => i.operation_id === previo.id)?.count || 0;
          
          return {
            id: previo.id,
            client: previo.client,
            date: previo.date,
            entry: previo.entry,
            supplier: previo.supplier,
            status: previo.status,
            created_at: previo.created_at,
            packages: previo.packages,
            product_count: productCount,
            image_count: imageCount
          };
        });
        
        setPrevios(formattedPrevios);
        setFilteredPrevios(formattedPrevios);
      } catch (error) {
        console.error('Error fetching previos:', error);
        toast.error('Error al cargar la lista de previos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrevios();
  }, []);
  
  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrevios(previos);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = previos.filter(previo => 
      previo.client.toLowerCase().includes(query) ||
      previo.entry.toLowerCase().includes(query) ||
      previo.supplier.toLowerCase().includes(query)
    );
    
    setFilteredPrevios(filtered);
  }, [searchQuery, previos]);
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
            <CheckCircle2 size={12} />
            Completado
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs">
            <Clock size={12} />
            En Progreso
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs">
            <AlertCircle size={12} />
            Pendiente
          </span>
        );
    }
  };
  
  // Add the handleContinuePrevio function
  const handleContinuePrevio = (previo: any) => {
    // Save previo data to localStorage
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
    
    // Navigate to the appropriate page based on the previo status
    if (previo.status === 'in-progress') {
      navigate('/product-verification');
    } else {
      navigate('/previo-preview');
    }
  };
  
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Lista de Previos" />
        
        <main className="flex-1 pl-5 pr-0 py-6">
          <div className="container max-w-4xl mx-auto space-y-6">
            {/* Search and Create Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <Input
                  placeholder="Buscar por cliente, entrada o proveedor"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button
                className="flex items-center gap-2"
                onClick={() => navigate('/register-previo')}
              >
                <FilePlus size={18} />
                Nuevo Previo
              </Button>
            </div>
            
            {/* Previos List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredPrevios.length === 0 ? (
              <Card className="p-12 text-center">
                <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No se encontraron previos</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'No hay resultados para tu búsqueda' : 'Aún no has creado ningún previo'}
                </p>
                <Button onClick={() => navigate('/register-previo')}>
                  Crear Nuevo Previo
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPrevios.map((previo) => (
                  <Card key={previo.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{previo.client}</h3>
                          {renderStatusBadge(previo.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Entrada:</span> {previo.entry}</p>
                          <p><span className="font-medium">Fecha:</span> {new Date(previo.date).toLocaleDateString('es-MX')}</p>
                          <p><span className="font-medium">Proveedor:</span> {previo.supplier}</p>
                          <p><span className="font-medium">Bultos:</span> {previo.packages}</p>
                        </div>
                        
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Package2 size={14} />
                            {previo.product_count} productos
                          </span>
                          <span className="flex items-center gap-1">
                            <Image size={14} />
                            {previo.image_count} fotos
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          className="flex items-center gap-1 text-xs"
                          onClick={() => {
                            // Navigate to previo details
                            navigate(`/previo/${previo.id}`);
                          }}
                        >
                          <Eye size={16} />
                          Ver
                        </Button>
                        
                        <Button
                          className="flex items-center gap-1 text-xs"
                          onClick={() => {
                            // Navigate to continue previo
                            handleContinuePrevio(previo);
                          }}
                        >
                          <ArrowRight size={16} />
                          Continuar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PrevioList; 