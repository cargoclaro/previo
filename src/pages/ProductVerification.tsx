import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Button from '@/components/common/Button';
import { ChevronRight, ArrowLeft, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import ProductFormFields from '@/components/previo/ProductFormFields';
import { generatePrevioPDF, generatePrevioDataURL } from '@/utils/pdfGenerator';
import Card from '@/components/common/Card';

// Define the Product type
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

// Add header interface
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

const ProductVerification = () => {
  const navigate = useNavigate();
  
  // State for managing multiple products
  const [products, setProducts] = useState<Product[]>([{
    id: `product-${Date.now()}`,
    code: '',
    detailedDescription: '',
    quantity: 0,
    unitOfMeasure: '',
    weight: 0,
    origin: '',
    matchesInvoice: true,
    discrepancy: '',
    productPhoto: null,
    hasLabel: false,
    labelPhoto: null,
    hasSerialNumber: false,
    serialNumber: '',
    serialPhoto: null,
    hasModel: false,
    modelNumber: ''
  }]);
  
  // Current product being edited
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Load header data from localStorage
  const [headerData, setHeaderData] = useState<PrevioHeaderData>(() => {
    const savedHeader = localStorage.getItem('previoHeader');
    if (savedHeader) {
      return JSON.parse(savedHeader);
    }
    return {
      client: '',
      date: new Date().toISOString().split('T')[0],
      entry: '',
      supplier: '',
      packages: 0,
      packageType: '',
      carrier: '',
      totalWeight: 0,
      location: '',
      purchaseOrder: '',
      trackingNumber: ''
    };
  });

  // Add a new product
  const addProduct = () => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      code: '',
      detailedDescription: '',
      quantity: 0,
      unitOfMeasure: '',
      weight: 0,
      origin: '',
      matchesInvoice: true,
      discrepancy: '',
      productPhoto: null,
      hasLabel: false,
      labelPhoto: null,
      hasSerialNumber: false,
      serialNumber: '',
      serialPhoto: null,
      hasModel: false,
      modelNumber: ''
    };
    
    setProducts([...products, newProduct]);
    setCurrentProductIndex(products.length);
    toast.success('Producto añadido');
  };

  // Remove a product
  const removeProduct = (index: number) => {
    if (products.length <= 1) {
      toast.error('Debe haber al menos un producto');
      return;
    }
    
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
    
    // Adjust current index if necessary
    if (currentProductIndex >= newProducts.length) {
      setCurrentProductIndex(newProducts.length - 1);
    }
    
    toast.success('Producto eliminado');
  };

  // Update a specific product field
  const updateProductField = (field: keyof Product, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[currentProductIndex] = {
      ...updatedProducts[currentProductIndex],
      [field]: value
    };
    setProducts(updatedProducts);
  };

  // Validate all products before submission
  const validateProducts = () => {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      if (!product.code) {
        toast.error(`Producto ${i + 1}: Ingrese el código o lote`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.detailedDescription) {
        toast.error(`Producto ${i + 1}: Ingrese la descripción detallada`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.quantity) {
        toast.error(`Producto ${i + 1}: Ingrese la cantidad`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.unitOfMeasure) {
        toast.error(`Producto ${i + 1}: Seleccione la unidad de medida`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.weight) {
        toast.error(`Producto ${i + 1}: Ingrese el peso`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.origin) {
        toast.error(`Producto ${i + 1}: Seleccione el origen`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.productPhoto) {
        toast.error(`Producto ${i + 1}: Capture foto del producto`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (product.hasLabel && !product.labelPhoto) {
        toast.error(`Producto ${i + 1}: Capture foto del etiquetado`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (product.hasSerialNumber && (!product.serialNumber || !product.serialPhoto)) {
        toast.error(`Producto ${i + 1}: Ingrese y capture el número de serie`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (product.hasModel && !product.modelNumber) {
        toast.error(`Producto ${i + 1}: Ingrese el número de modelo`);
        setCurrentProductIndex(i);
        return false;
      }
    }
    
    return true;
  };

  // Handle saving the work for later
  const handleSaveForLater = () => {
    localStorage.setItem('savedProducts', JSON.stringify(products));
    toast.success('Verificación guardada para continuar más tarde');
    navigate('/');
  };

  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewPDF = () => {
    if (!validateProducts()) return;
    
    try {
      const dataUrl = generatePrevioDataURL(headerData, products);
      setPdfDataUrl(dataUrl);
      setShowPreview(true);
      toast.success('Vista previa del PDF generada');
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      toast.error('Error al generar la vista previa del PDF');
    }
  };

  const handleDownloadPDF = () => {
    if (!validateProducts()) return;
    
    try {
      generatePrevioPDF(headerData, products, `previo_${headerData.entry || 'nuevo'}.pdf`);
      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  const handleSubmit = () => {
    if (!validateProducts()) return;
    
    try {
      // Save products to localStorage
      localStorage.setItem('previoProducts', JSON.stringify(products));
      
      // Navigate to the completion page
      navigate('/previo-complete');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar los datos');
    }
  };

  // Add state for previoId
  const [previoId, setPrevioId] = useState<string>('');
  
  // Initialize previoId from localStorage
  useEffect(() => {
    const previoHeader = localStorage.getItem('previoHeader');
    if (previoHeader) {
      try {
        const data = JSON.parse(previoHeader);
        if (data.id) {
          setPrevioId(data.id);
        }
      } catch (error) {
        console.error('Error parsing previo header:', error);
      }
    }
  }, []);

  if (showPreview && pdfDataUrl) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-cargo-light/50">
          <Header title="Vista Previa de Previo" showBackButton />
          
          <main className="flex-1 container mx-auto py-4 pb-20 px-4">
            <div className="w-full max-w-md mx-auto space-y-4">
              <Card className="p-4">
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
                    <p className="font-medium">Productos:</p>
                    <p className="text-gray-600">{products.length}</p>
                  </div>
                  <div>
                    <p className="font-medium">Peso Total:</p>
                    <p className="text-gray-600">{headerData.totalWeight} lbs</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
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
          
          <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-cargo-gray/30 py-3 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="w-full max-w-md mx-auto flex gap-2">
              <Button
                onClick={() => setShowPreview(false)}
                className="h-10 text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="h-10 text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 flex-1"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Descargar PDF
              </Button>
              <Button
                onClick={handleSubmit}
                className="h-10 text-base font-medium bg-gradient-to-r from-cargo-orange to-orange-500 hover:from-cargo-orange/90 hover:to-orange-500/90 text-white shadow-sm flex-1"
              >
                <ChevronRight className="w-5 h-5 mr-2" />
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-cargo-light/50">
        <Header title="Verificación de Productos" showBackButton />
        
        <main className="flex-1 container mx-auto py-4 pb-20 px-4">
          <div className="w-full max-w-md mx-auto">
            <ProductFormFields
              products={products}
              currentProductIndex={currentProductIndex}
              setCurrentProductIndex={setCurrentProductIndex}
              addProduct={addProduct}
              removeProduct={removeProduct}
              updateProductField={updateProductField}
              previoId={previoId}
            />
          </div>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-cargo-gray/30 py-3 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-md mx-auto">
            <Button
              onClick={handleSubmit}
              className="w-full h-10 text-base font-medium bg-gradient-to-r from-cargo-orange to-orange-500 hover:from-cargo-orange/90 hover:to-orange-500/90 text-white shadow-sm"
            >
              <ChevronRight className="w-5 h-5 mr-2" />
              Finalizar y Ver Documento
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductVerification;
