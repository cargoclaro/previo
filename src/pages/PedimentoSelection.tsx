
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import PageTransition from '@/components/layout/PageTransition';
import { ChevronRight, FileText, Search } from 'lucide-react';

interface Pedimento {
  id: string;
  number: string;
  date: string;
  client: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const PedimentoSelection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPedimento, setSelectedPedimento] = useState<string | null>(null);

  // Mock data for pedimentos
  const pedimentos: Pedimento[] = [
    { id: '1', number: '21 43 3821 1234567', date: '2023-09-15', client: 'Importadora ABC', status: 'pending' },
    { id: '2', number: '21 47 3821 7654321', date: '2023-09-10', client: 'Comercial XYZ', status: 'in-progress' },
    { id: '3', number: '21 51 3821 9876543', date: '2023-09-05', client: 'Distribuidora MNO', status: 'completed' },
    { id: '4', number: '21 43 3821 5647382', date: '2023-09-01', client: 'Importadora DEF', status: 'pending' },
  ];

  const filteredPedimentos = pedimentos.filter(p => 
    p.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartPrevio = () => {
    if (selectedPedimento) {
      navigate('/goods-condition');
    }
  };

  const getStatusColor = (status: Pedimento['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return '';
    }
  };

  const getStatusText = (status: Pedimento['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return '';
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Selección de Pedimento" showBackButton />
        
        <main className="flex-1 px-4 py-6">
          <div className="container max-w-md mx-auto space-y-6 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Buscar por número o cliente..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {filteredPedimentos.length > 0 ? (
                filteredPedimentos.map((pedimento) => (
                  <Card 
                    key={pedimento.id}
                    className={`transition-all duration-200 ${selectedPedimento === pedimento.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedPedimento(pedimento.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium">{pedimento.number}</h3>
                          <p className="text-sm text-muted-foreground">{pedimento.client}</p>
                          <p className="text-xs text-muted-foreground mt-1">Fecha: {pedimento.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pedimento.status)}`}>
                        {getStatusText(pedimento.status)}
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No se encontraron resultados</p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button
                className="w-full"
                disabled={!selectedPedimento}
                onClick={handleStartPrevio}
                icon={<ChevronRight size={18} />}
              >
                Iniciar Previo
              </Button>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PedimentoSelection;
