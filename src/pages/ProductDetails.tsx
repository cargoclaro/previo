import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Package, ArrowLeft, FileDown, Tag, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  weight: number | null;
  serial_number: string | null;
  image_url: string | null;
  previo_id: string;
  created_at: string;
}

interface PrevioData {
  id: string;
  client: string;
  entry: string;
  date: string;
}

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [previo, setPrevio] = useState<PrevioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [labelPhotoUrl, setLabelPhotoUrl] = useState<string | null>(null);
  const [serialPhotoUrl, setSerialPhotoUrl] = useState<string | null>(null);

  // Check localStorage for verification data that might have additional images
  useEffect(() => {
    const savedProducts = localStorage.getItem('previoProducts');
    if (savedProducts && productId) {
      try {
        const products = JSON.parse(savedProducts);
        const matchingProduct = products.find((p: any) => p.id === productId);
        
        if (matchingProduct) {
          if (matchingProduct.hasLabel && matchingProduct.labelPhoto) {
            setLabelPhotoUrl(matchingProduct.labelPhoto);
          }
          
          if (matchingProduct.hasSerialNumber && matchingProduct.serialPhoto) {
            setSerialPhotoUrl(matchingProduct.serialPhoto);
          }
        }
      } catch (e) {
        console.error('Error parsing saved products:', e);
      }
    }
  }, [productId]);

  useEffect(() => {
    if (!user || !productId) return;
    
    const fetchProductData = async () => {
      try {
        // Fetch product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (productError) throw productError;
        
        setProduct(productData);
        
        // Fetch previo data if product has a previo_id
        if (productData.previo_id) {
          const { data: previoData, error: previoError } = await supabase
            .from('previos')
            .select('id, client, entry, date')
            .eq('id', productData.previo_id)
            .single();
          
          if (previoError) throw previoError;
          
          setPrevio(previoData);
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching product data:', error);
        toast.error('Error al cargar los datos del producto');
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [user, productId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Detalles del Producto" showBackButton />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </main>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Detalles del Producto" showBackButton />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600">Producto no encontrado</p>
              <Button className="mt-4" onClick={() => navigate('/products-gallery')}>
                Volver a la Galería
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
        <Header title="Detalles del Producto" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container mx-auto max-w-3xl">
            <Card className="overflow-hidden">
              {/* Product image */}
              <div className="relative w-full h-64 md:h-80 bg-gray-100">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Product details */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                <div className="mt-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Descripción</h2>
                    <p className="text-gray-700">{product.description || 'Sin descripción'}</p>
                  </div>
                  
                  {/* Specifications */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-3">Especificaciones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
                        <p className="mt-1 text-lg font-medium">{product.quantity}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">Peso</h3>
                        <p className="mt-1 text-lg font-medium">{product.weight} lbs</p>
                      </div>
                      
                      {product.serial_number && (
                        <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                          <h3 className="text-sm font-medium text-gray-500">Número de Serie</h3>
                          <p className="mt-1 text-lg font-mono">{product.serial_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Previo information */}
                  {previo && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-3">Información del Previo</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                            <p className="mt-1">{previo.client}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Entrada</h3>
                            <p className="mt-1">{previo.entry}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
                            <p className="mt-1">{previo.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Image Gallery Section */}
                  {(product.image_url || labelPhotoUrl || serialPhotoUrl) && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-3">Imágenes del Producto</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 gap-6">
                          {product.image_url && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                <Package className="mr-2" size={16} />
                                Imagen del Producto
                              </h3>
                              <div className="overflow-hidden rounded-lg">
                                <img 
                                  src={product.image_url} 
                                  alt={product.name} 
                                  className="w-full object-contain border rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                  onClick={() => product.image_url && window.open(product.image_url, '_blank')}
                                />
                              </div>
                            </div>
                          )}
                          
                          {labelPhotoUrl && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                <Tag className="mr-2" size={16} />
                                Imagen del Etiquetado
                              </h3>
                              <div className="overflow-hidden rounded-lg">
                                <img 
                                  src={labelPhotoUrl} 
                                  alt={`Etiquetado de ${product?.name || 'producto'}`} 
                                  className="w-full object-contain border rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                  onClick={() => window.open(labelPhotoUrl, '_blank')}
                                />
                              </div>
                            </div>
                          )}
                          
                          {serialPhotoUrl && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                <Hash className="mr-2" size={16} />
                                Imagen del Número de Serie
                              </h3>
                              <div className="overflow-hidden rounded-lg">
                                <img 
                                  src={serialPhotoUrl} 
                                  alt={`Número de serie de ${product?.name || 'producto'}`} 
                                  className="w-full object-contain border rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                  onClick={() => window.open(serialPhotoUrl, '_blank')}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                          Haz clic en una imagen para verla en tamaño completo
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default ProductDetails; 