
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
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Historial de Previos" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                  className="py-2 px-3 border rounded-md"
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
              <div className="space-y-4">
                {filteredPrevios.map((previo) => (
                  <Card 
                    key={previo.id} 
                    className="hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="p-3 bg-orange-100 rounded-full text-orange-500 self-start">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{previo.client}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(previo.status)}`}>
                              {getStatusLabel(previo.status)}
                            </span>
                          </div>
                          
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(previo.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package size={14} />
                              <span>{previo.packages || 0} bultos</span>
                            </div>
                            <div className="col-span-2 mt-1">
                              <span className="font-medium">Entrada:</span> {previo.entry}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Proveedor:</span> {previo.supplier}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        onClick={() => handleViewPrevio(previo.id)}
                      >
                        Ver <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
