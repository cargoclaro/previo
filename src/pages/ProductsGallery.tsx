import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import { Package, Search } from 'lucide-react';
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
}

const ProductsGallery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [previos, setPrevios] = useState<Record<string, PrevioData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!user) return;
    
    const fetchProducts = async () => {
      try {
        // Fetch all products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
        
        if (productsError) throw productsError;
        
        setProducts(productsData || []);
        
        // Get unique previo IDs
        const previoIds = [...new Set(productsData?.map(p => p.previo_id) || [])];
        
        // Fetch previo information for each product
        if (previoIds.length > 0) {
          const { data: previosData, error: previosError } = await supabase
            .from('previos')
            .select('id, client, entry')
            .in('id', previoIds);
          
          if (previosError) throw previosError;
          
          // Create a map of previo ID to previo data
          const previosMap = (previosData || []).reduce((acc, previo) => {
            acc[previo.id] = previo;
            return acc;
          }, {} as Record<string, PrevioData>);
          
          setPrevios(previosMap);
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar los productos');
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [user]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (productId: string) => {
    navigate(`/product-details/${productId}`);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Galería de Productos" showBackButton />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Galería de Productos" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container mx-auto max-w-6xl">
            {/* Search bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Buscar productos por nombre, descripción o número de serie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Products grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="aspect-square relative">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-lg">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {product.description || 'Sin descripción'}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Cant: {product.quantity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {previos[product.previo_id]?.entry || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'No se encontraron productos con ese término de búsqueda.' : 'No hay productos disponibles.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default ProductsGallery; 