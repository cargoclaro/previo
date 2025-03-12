
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/common/Button';
import { FileDown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generatePrevioPDF, generatePrevioDataURL } from '@/utils/pdfGenerator';

interface PrevioHeaderData {
  client: string;
  date: string;
  entry: string;
  supplier: string;
  packages: number;
  packageType: string;
  carrier: string;
  totalWeight: number;
  location: string;
  purchaseOrder: string;
  trackingNumber: string;
}

const PrevioComplete = () => {
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState<PrevioHeaderData | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHeader = localStorage.getItem('previoHeader');
        const savedProducts = localStorage.getItem('previoProducts');
        
        if (!savedHeader || !savedProducts) {
          toast.error('No se encontraron datos del previo');
          navigate('/');
          return;
        }

        const headerData = JSON.parse(savedHeader);
        const productsData = JSON.parse(savedProducts);
        setHeaderData(headerData);
        setProducts(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos del previo');
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleDownload = () => {
    try {
      if (!headerData || !products) return;
      generatePrevioPDF(headerData, products, `previo_${headerData.entry || 'nuevo'}.pdf`);
      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error al descargar el PDF');
    }
  };

  const handleReturnHome = () => {
    localStorage.removeItem('previoHeader');
    localStorage.removeItem('previoProducts');
    navigate('/');
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Procesando Previo" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-lg">Generando documento...</div>
              <div className="text-sm text-gray-500">Por favor espere</div>
            </div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-orange-50">
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md mx-auto text-center space-y-6">
            <div className="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md">
              <CheckCircle className="w-16 h-16 text-orange-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800">¡Previo Completado!</h1>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="grid grid-cols-2 gap-4 text-sm mb-6 text-left">
                <div>
                  <p className="font-medium">Cliente:</p>
                  <p className="text-gray-600">{headerData?.client}</p>
                </div>
                <div>
                  <p className="font-medium">Entrada:</p>
                  <p className="text-gray-600">{headerData?.entry}</p>
                </div>
                <div>
                  <p className="font-medium">Productos:</p>
                  <p className="text-gray-600">{products.length}</p>
                </div>
                <div>
                  <p className="font-medium">Peso Total:</p>
                  <p className="text-gray-600">{headerData?.totalWeight} lbs</p>
                </div>
              </div>
              
              <Button
                onClick={handleDownload}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Descargar PDF
              </Button>
            </div>
            
            <Button
              onClick={handleReturnHome}
              variant="outline"
              className="text-orange-700 hover:text-orange-800 font-medium"
            >
              Volver al inicio
            </Button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PrevioComplete;
