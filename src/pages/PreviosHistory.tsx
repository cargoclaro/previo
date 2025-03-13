import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
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

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header title="Historial de Previos" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container max-w-md mx-auto space-y-4">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar por cliente, entrada..."
                className="w-full pl-10 rounded-md border-gray-200 focus:border-gray-300 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative w-full">
              <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-8 py-2.5 rounded-md border border-gray-200 bg-white appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="completed">Completados</option>
                <option value="in-progress">En Progreso</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredPrevios.length > 0 ? (
              <div className="space-y-4">
                {filteredPrevios.map((previo) => (
                  <Card 
                    key={previo.id} 
                    className="p-4 bg-white rounded-md shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <FileText size={20} className="text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{previo.client}</h3>
                        <div className="inline-flex items-center px-2 py-0.5 mt-1 bg-green-50 text-green-600 rounded-full text-xs">
                          <CheckCircle size={14} className="mr-1" />
                          {getStatusLabel(previo.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-1.5" />
                        <span>{formatDate(previo.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Package size={16} className="mr-1.5" />
                        <span>{previo.packages || 0} bultos</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="text-gray-500 align-middle">Entrada:</td>
                            <td className="text-gray-700 text-right align-middle">{previo.entry}</td>
                          </tr>
                          <tr>
                            <td className="text-gray-500 pt-2 align-middle">Proveedor:</td>
                            <td className="text-gray-700 text-right pt-2 align-middle">{previo.supplier}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        className="flex items-center text-orange-500 hover:text-orange-600 text-sm"
                        onClick={() => handleViewPrevio(previo.id)}
                      >
                        Ver <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-100">
                <CheckCircle size={36} className="mx-auto text-orange-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-800">No hay previos disponibles</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
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
