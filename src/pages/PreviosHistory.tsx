import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { FileText, Calendar, Package, CheckCircle, Search, Filter, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

interface Previo {
  id: string;
  client: string;
  date: string;
  entry: string;
  supplier: string;
  packages: number;
  status: string;
  created_at: string;
}

const PreviosHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [previos, setPrevios] = useState<Previo[]>([]);
  const [filteredPrevios, setFilteredPrevios] = useState<Previo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('completed'); // Default filter: completed

  useEffect(() => {
    if (!user) return;
    
    const fetchPrevios = async () => {
      try {
        const { data, error } = await supabase
          .from('previos')
          .select('*')
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

  useEffect(() => {
    // Filter previos based on search term and status
    const filtered = previos.filter(previo => {
      const matchesSearch = 
        previo.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        previo.entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        previo.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || previo.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredPrevios(filtered);
  }, [previos, searchTerm, statusFilter]);

  const handleViewPrevio = (previoId: string) => {
    navigate(`/previo-details/${previoId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En Progreso';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border border-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border border-blue-100';
      case 'pending':
        return 'text-orange-600 bg-orange-50 border border-orange-100';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-100';
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Historial de Previos" showBackButton />
        
        <main className="flex-1 px-0 py-6">
          <div className="container max-w-full mx-auto space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center px-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Buscar por cliente, entrada..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-muted-foreground" />
                <select
                  className="py-2 px-3 border rounded-md bg-white w-full sm:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="completed">Completados</option>
                  <option value="in-progress">En Progreso</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredPrevios.length > 0 ? (
              <div className="space-y-5 px-2">
                {filteredPrevios.map((previo) => (
                  <Card 
                    key={previo.id} 
                    className="hover:shadow-md transition-shadow w-full"
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Header section with title and status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <div className="doc-icon">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{previo.client}</h3>
                            <span className={`history-item-badge inline-block mt-1.5 ${getStatusColor(previo.status)}`}>
                              {getStatusLabel(previo.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Info section */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="history-item-date">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-base">{formatDate(previo.date)}</span>
                        </div>
                        <div className="history-item-date justify-end">
                          <Package size={16} className="text-gray-500" />
                          <span className="text-base font-medium">{previo.packages || 0} bultos</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-base text-gray-600">
                          <span className="font-medium">Entrada:</span> {previo.entry}
                        </div>
                        <div className="text-base text-gray-600">
                          <span className="font-medium">Proveedor:</span> {previo.supplier}
                        </div>
                      </div>
                      
                      {/* Button section */}
                      <div className="flex justify-center pt-2">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-orange-600 border-orange-200 hover:bg-orange-50 px-8 py-2.5 text-base"
                          onClick={() => handleViewPrevio(previo.id)}
                        >
                          Ver <ArrowRight size={18} className="ml-1.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm mx-2">
                <CheckCircle size={48} className="mx-auto text-orange-300" />
                <h3 className="mt-4 text-lg font-medium">No hay previos disponibles</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm 
                    ? 'No se encontraron previos con los filtros aplicados' 
                    : statusFilter === 'all' 
                      ? 'No hay previos registrados todavía' 
                      : `No hay previos ${statusFilter === 'completed' ? 'completados' : 'en progreso'}`}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PreviosHistory;
