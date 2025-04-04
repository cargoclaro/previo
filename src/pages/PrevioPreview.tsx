import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/common/Button';
import { FileDown, Eye, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { generatePrevioPDF, generatePrevioDataURL } from '@/utils/pdfGenerator';
import PDFViewer from '@/components/PDFViewer';
import Card from '@/components/common/Card';

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

interface Product {
  id: string;
  code: string;
  detailedDescription: string;
  quantity: number;
  unitOfMeasure: string;
  weight: number;
  origin: string;
  matchesInvoice: boolean;
  discrepancy: string;
  productPhoto: string | null;
  hasLabel: boolean;
  labelPhoto: string | null;
  hasSerialNumber: boolean;
  serialNumber: string;
  serialPhoto: string | null;
  hasModel: boolean;
  modelNumber: string;
}

const PrevioPreview = () => {
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState<PrevioHeaderData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the saved form data
    const savedHeader = localStorage.getItem('previoHeader');
    const savedProducts = localStorage.getItem('previoProducts');
    
    if (!savedHeader || !savedProducts) {
      toast.error('No se encontraron datos del previo');
      navigate('/register-previo');
      return;
    }

    const parsedHeaderData = JSON.parse(savedHeader);
    const parsedProductsData = JSON.parse(savedProducts);
    setHeaderData(parsedHeaderData);
    setProducts(parsedProductsData);

    // Generate PDF preview automatically
    try {
      const dataUrl = generatePrevioDataURL(parsedHeaderData, parsedProductsData);
      setPdfDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      toast.error('Error al generar la vista previa del PDF');
    }
  }, [navigate]);

  const handleDownloadPDF = () => {
    if (!headerData || !products) return;
    
    try {
      generatePrevioPDF(headerData, products, `previo_${headerData.entry || 'nuevo'}.pdf`);
      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  if (!headerData || !pdfDataUrl) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Vista Previa de Previo" showBackButton />
          <main className="flex-1 pl-5 pr-0 py-6">
            <div className="container max-w-3xl mx-auto">
              <Card className="p-6 text-center">
                <p>Cargando datos...</p>
              </Card>
            </div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Vista Previa de Previo" showBackButton />
        
        <main className="flex-1 pl-5 pr-0 py-6 pb-32">
          <div className="container max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del Previo</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Cliente:</p>
                  <p className="text-gray-600">{headerData.client}</p>
                </div>
                <div>
                  <p className="font-medium">Entrada:</p>
                  <p className="text-gray-600">{headerData.entry}</p>
                </div>
                <div>
                  <p className="font-medium">Fecha:</p>
                  <p className="text-gray-600">{headerData.date}</p>
                </div>
                <div>
                  <p className="font-medium">Proveedor:</p>
                  <p className="text-gray-600">{headerData.supplier}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vista Previa del Documento</h2>
              <div className="aspect-[3/4] w-full bg-gray-50 border rounded-lg overflow-hidden">
                <iframe
                  src={pdfDataUrl}
                  className="w-full h-full border-0"
                  title="Vista previa del previo"
                />
              </div>
            </Card>
          </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="container max-w-3xl mx-auto p-4">
            <Button
              onClick={handleDownloadPDF}
              className="h-14 text-base font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 w-full"
            >
              <FileDown className="w-5 h-5 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrevioPreview;
