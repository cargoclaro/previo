import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { supabase } from '@/integrations/supabase/client';
import { OperationType, getOperationImages } from '@/utils/imageUpload';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import { Box, Camera, Image, Package, ArrowLeft, ArrowRight, ImageIcon, Tag, Scan } from 'lucide-react';
import { toast } from 'sonner';

// Define tab type
type GalleryTab = 'all' | 'products' | 'packaging' | 'inspection';

interface PrevioDetail {
  id: string;
  client: string;
  date: string;
  entry: string;
  supplier: string;
  status: string;
  packages: number;
  packageType: string;
  carrier: string;
  totalWeight: number;
  productCount?: number;
}

// Define product interface
interface Product {
  id: string;
  code: string;
  detailedDescription: string;
  quantity: number;
  matchesInvoice: boolean;
}

const PrevioGallery = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [previo, setPrevio] = useState<PrevioDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<GalleryTab>('all');
  
  // Load previo data
  useEffect(() => {
    const fetchPrevioData = async () => {
      if (!id) {
        toast.error('ID de previo no encontrado');
        navigate('/');
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch basic previo info
        const { data: previoData, error: previoError } = await supabase
          .from('previos')
          .select('*')
          .eq('id', id)
          .single();
          
        if (previoError) {
          throw previoError;
        }
        
        // Fetch products related to this previo
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('previo_id', id);
          
        if (productsError) {
          console.error('Error fetching products:', productsError);
        }
        
        // Set previo data
        setPrevio({
          id: previoData.id,
          client: previoData.client,
          date: previoData.date,
          entry: previoData.entry,
          supplier: previoData.supplier,
          status: previoData.status,
          packages: previoData.packages,
          packageType: previoData.package_type || '',
          carrier: previoData.carrier || '',
          totalWeight: previoData.total_weight || 0,
          productCount: productsData?.length || 0
        });
        
        // Set products
        setProducts(productsData || []);
        
        // Select first product by default if available
        if (productsData && productsData.length > 0) {
          setSelectedProduct(productsData[0]);
        }
      } catch (error) {
        console.error('Error fetching previo data:', error);
        toast.error('Error al cargar datos del previo');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrevioData();
  }, [id, navigate]);
  
  // Define tabs
  const tabs = [
    { id: 'all', label: 'Todas', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'products', label: 'Productos', icon: <Package className="w-4 h-4" /> },
    { id: 'packaging', label: 'Embalaje', icon: <Box className="w-4 h-4" /> },
    { id: 'inspection', label: 'Inspección', icon: <Scan className="w-4 h-4" /> }
  ];
  
  // Handle tab change
  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
    // Reset selected product when switching to a non-product tab
    if (tab !== 'products') {
      setSelectedProduct(null);
    } else if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <PageTransition>
        <Header title="Galería de Fotos" showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </PageTransition>
    );
  }
  
  // Render not found state
  if (!previo) {
    return (
      <PageTransition>
        <Header title="Galería de Fotos" showBackButton />
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <Image className="w-16 h-16 text-gray-300 mb-4" />
          <h1 className="text-xl font-medium mb-2">Previo no encontrado</h1>
          <p className="text-gray-500 mb-6">No se encontró el previo solicitado</p>
          <Button onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Galería de Fotos" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container max-w-4xl mx-auto space-y-6">
            {/* Previo Summary */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-medium">Resumen del Previo</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{previo.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entrada</p>
                  <p className="font-medium">{previo.entry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{new Date(previo.date).toLocaleDateString('es-MX')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Proveedor</p>
                  <p className="font-medium">{previo.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bultos</p>
                  <p className="font-medium">{previo.packages} {previo.packageType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Peso Total</p>
                  <p className="font-medium">{previo.totalWeight} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transportista</p>
                  <p className="font-medium">{previo.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Productos</p>
                  <p className="font-medium">{previo.productCount || 0}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm mb-2 font-medium">Estado: 
                  <span className={`ml-2 py-1 px-2 rounded-full text-xs ${
                    previo.status === 'completed' ? 'bg-green-100 text-green-800' :
                    previo.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {previo.status === 'completed' ? 'Completado' : 
                     previo.status === 'in-progress' ? 'En Progreso' : 
                     'Pendiente'}
                  </span>
                </p>
              </div>
            </Card>
            
            {/* Gallery Tabs */}
            <Card className="overflow-hidden">
              <div className="flex overflow-x-auto border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap transition ${
                      activeTab === tab.id ? 
                      'text-primary border-b-2 border-primary' : 
                      'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => handleTabChange(tab.id as GalleryTab)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Products Tab View */}
              {activeTab === 'products' && (
                <div className="p-4">
                  {products.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p>No hay productos registrados para este previo</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Product Selector */}
                      <div className="flex overflow-x-auto gap-2 pb-2">
                        {products.map((product, index) => (
                          <button
                            key={product.id}
                            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                              selectedProduct?.id === product.id ?
                              'bg-primary text-white' :
                              'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                            onClick={() => setSelectedProduct(product)}
                          >
                            Producto {index + 1}
                          </button>
                        ))}
                      </div>
                      
                      {/* Selected Product Details */}
                      {selectedProduct && (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">{selectedProduct.detailedDescription}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div>
                                <span className="text-gray-500">Código/Lote:</span>{' '}
                                <span className="font-medium">{selectedProduct.code}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Cantidad:</span>{' '}
                                <span className="font-medium">{selectedProduct.quantity}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Coincide con factura:</span>{' '}
                                <span className={`font-medium ${selectedProduct.matchesInvoice ? 'text-green-600' : 'text-red-600'}`}>
                                  {selectedProduct.matchesInvoice ? 'Sí' : 'No'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Product Photos */}
                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <Camera className="w-4 h-4 text-primary" />
                              Fotos del Producto
                            </h3>
                            <PhotoGallery 
                              operationId={id || ''}
                              operationType="previo"
                              productId={selectedProduct.id}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Packaging Tab View */}
              {activeTab === 'packaging' && (
                <div className="p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Box className="w-4 h-4 text-primary" />
                    Fotos del Embalaje
                  </h3>
                  <PhotoGallery 
                    operationId={id || ''}
                    operationType="embalaje"
                  />
                </div>
              )}
              
              {/* Inspection Tab View */}
              {activeTab === 'inspection' && (
                <div className="p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Scan className="w-4 h-4 text-primary" />
                    Fotos de Inspección
                  </h3>
                  <PhotoGallery 
                    operationId={id || ''}
                    operationType="inspeccion"
                  />
                </div>
              )}
              
              {/* All Photos Tab View */}
              {activeTab === 'all' && (
                <div className="p-4 space-y-6">
                  {/* Previo Photos */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      Fotos de Productos
                    </h3>
                    <PhotoGallery 
                      operationId={id || ''}
                      operationType="previo"
                    />
                  </div>
                  
                  {/* Packaging Photos */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Box className="w-4 h-4 text-primary" />
                      Fotos de Embalaje
                    </h3>
                    <PhotoGallery 
                      operationId={id || ''}
                      operationType="embalaje"
                    />
                  </div>
                  
                  {/* Inspection Photos */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Scan className="w-4 h-4 text-primary" />
                      Fotos de Inspección
                    </h3>
                    <PhotoGallery 
                      operationId={id || ''}
                      operationType="inspeccion"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
        
        {/* Navigation Footer */}
        <div className="border-t bg-background">
          <div className="container max-w-4xl mx-auto p-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Volver
            </Button>
            
            <Button
              onClick={() => navigate(`/previo/${id}`)}
              className="flex items-center gap-2"
            >
              Ver Detalle Completo
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrevioGallery; 