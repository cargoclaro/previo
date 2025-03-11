import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import PrevioHeader from '@/components/PrevioHeader';
import Card from '@/components/common/Card';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import Button from '@/components/common/Button';
import { ChevronRight, Plus, Trash, Check, Save, ArrowLeft, Camera, Package2, FileText, Scan, Tag, FileDown, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { generatePrevioPDF, generatePrevioDataURL } from '@/utils/pdfGenerator';

// Define the Product type
interface Product {
  id: string;
  code: string;                    // CODIGO/LOTE
  detailedDescription: string;     // DESCRIPCION DETALLADA
  quantity: number;                // CANTIDAD
  unitOfMeasure: string;          // U/M
  weight: number;                  // PESO
  origin: string;                  // ORIGEN
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

  // Mock product options
  const productOptions = [
    { value: 'electronica', label: 'Electrónicos' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'quimicos', label: 'Químicos' },
    { value: 'maquinaria', label: 'Maquinaria' },
  ];

  // Mock origin options
  const originOptions = [
    { value: 'USA', label: 'USA' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Mexico', label: 'México' },
    { value: 'China', label: 'China' },
    { value: 'Other', label: 'Otro' },
  ];

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

  // Update header field function
  const updateHeaderField = (field: string, value: string | number) => {
    setHeaderData(prev => ({
      ...prev,
      [field]: value
    }));
    // Update localStorage
    localStorage.setItem('previoHeader', JSON.stringify({
      ...headerData,
      [field]: value
    }));
  };

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

  // Get current product being edited
  const currentProduct = products[currentProductIndex];

  // Add these constants for unit of measure options
  const unitOptions = [
    { value: 'sacos', label: 'Sacos' },
    { value: 'cajas', label: 'Cajas' },
    { value: 'piezas', label: 'Piezas' },
    { value: 'pallets', label: 'Pallets' },
  ];

  if (showPreview && pdfDataUrl) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <Header title="Vista Previa de Previo" showBackButton />
          
          <main className="flex-1 px-4 py-6 pb-32">
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
                    <p className="font-medium">Productos:</p>
                    <p className="text-gray-600">{products.length}</p>
                  </div>
                  <div>
                    <p className="font-medium">Peso Total:</p>
                    <p className="text-gray-600">{headerData.totalWeight} lbs</p>
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
            <div className="container max-w-3xl mx-auto p-4 flex gap-2">
              <Button
                onClick={() => setShowPreview(false)}
                className="h-14 text-base font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="h-14 text-base font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 flex-1"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Descargar PDF
              </Button>
              <Button
                onClick={handleSubmit}
                className="h-14 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white flex-1"
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
      <div className="flex flex-col min-h-screen">
        <Header title="Verificación de Productos" showBackButton />
        
        <main className="flex-1 px-4 py-6 pb-32">
          <div className="container max-w-3xl mx-auto space-y-6 animate-slide-up">
            {/* Product Navigation */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Package2 className="w-5 h-5 text-orange-500" />
                  Productos ({products.length})
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {products.map((product, index) => (
                    <button
                      key={product.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors 
                        ${index === currentProductIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }
                        ${product.productPhoto ? 'ring-2 ring-green-500/20' : ''}`}
                      onClick={() => setCurrentProductIndex(index)}
                    >
                      Producto {index + 1}
                      {product.productPhoto && <span className="ml-1 text-xs">✓</span>}
                    </button>
                  ))}
                  
                  <button
                    className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1"
                    onClick={addProduct}
                  >
                    <Plus size={14} />
                    Añadir
                  </button>
                </div>
                
                {products.length > 1 && (
                  <button
                    className="text-destructive text-sm flex items-center gap-1 hover:underline"
                    onClick={() => removeProduct(currentProductIndex)}
                  >
                    <Trash size={14} />
                    Eliminar producto actual
                  </button>
                )}
              </div>
            </Card>
            
            {/* Current Product Form */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Detalles del Producto {currentProductIndex + 1}
                </h3>
                
                {/* Code/Lot Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código/Lote</label>
                  <Input
                    value={currentProduct.code}
                    onChange={(e) => updateProductField('code', e.target.value)}
                    placeholder="Ingrese el código o lote"
                  />
                </div>
                
                {/* Detailed Description Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción Detallada</label>
                  <Input
                    value={currentProduct.detailedDescription}
                    onChange={(e) => updateProductField('detailedDescription', e.target.value)}
                    placeholder="Ingrese la descripción del producto"
                  />
                </div>
                
                {/* Quantity Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cantidad</label>
                  <Input
                    type="number"
                    value={currentProduct.quantity}
                    onChange={(e) => updateProductField('quantity', parseInt(e.target.value) || 0)}
                    placeholder="Ingrese la cantidad"
                  />
                </div>
                
                {/* Unit of Measure Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unidad de Medida</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={currentProduct.unitOfMeasure}
                    onChange={(e) => updateProductField('unitOfMeasure', e.target.value)}
                  >
                    <option value="">Seleccione unidad</option>
                    {unitOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Weight Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peso (lbs)</label>
                  <Input
                    type="number"
                    value={currentProduct.weight}
                    onChange={(e) => updateProductField('weight', parseFloat(e.target.value) || 0)}
                    placeholder="Ingrese el peso en libras"
                  />
                </div>
                
                {/* Origin Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Origen</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={currentProduct.origin}
                    onChange={(e) => updateProductField('origin', e.target.value)}
                  >
                    <option value="">Seleccione origen</option>
                    {originOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <ToggleSwitch
                  label="¿El producto coincide con la información en factura?"
                  checked={currentProduct.matchesInvoice}
                  onChange={(value) => updateProductField('matchesInvoice', value)}
                />
                
                {!currentProduct.matchesInvoice && (
                  <div className="pl-4 border-l-2 border-destructive/20 space-y-2">
                    <label className="text-sm font-medium">
                      Registra la discrepancia
                      <span className="text-destructive ml-1">*</span>
                    </label>
                    <textarea
                      className="w-full h-24 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={currentProduct.discrepancy}
                      onChange={(e) => updateProductField('discrepancy', e.target.value)}
                      placeholder="Describe la diferencia encontrada respecto a la factura..."
                    ></textarea>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-500" />
                Documentación Fotográfica
              </h3>
              
              <PhotoCapture
                label="Capturar Foto de Producto"
                onPhotoCapture={(photo) => updateProductField('productPhoto', photo)}
                required
              />
              
              <ToggleSwitch
                label={
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-orange-500" />
                    ¿Producto Cuenta con Etiquetado?
                  </div>
                }
                checked={currentProduct.hasLabel}
                onChange={(value) => updateProductField('hasLabel', value)}
              />
              
              {currentProduct.hasLabel && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <PhotoCapture
                    label="Captura foto de Etiquetado"
                    onPhotoCapture={(photo) => updateProductField('labelPhoto', photo)}
                    required
                  />
                </div>
              )}
              
              <ToggleSwitch
                label={
                  <div className="flex items-center gap-2">
                    <Scan className="w-4 h-4 text-orange-500" />
                    ¿Producto Tiene Número de Serie?
                  </div>
                }
                checked={currentProduct.hasSerialNumber}
                onChange={(value) => updateProductField('hasSerialNumber', value)}
              />
              
              {currentProduct.hasSerialNumber && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Ingresar número de serie
                      <span className="text-destructive ml-1">*</span>
                    </label>
                    <Input
                      type="text"
                      value={currentProduct.serialNumber}
                      onChange={(e) => updateProductField('serialNumber', e.target.value)}
                      placeholder="Ej. SN12345678"
                    />
                  </div>
                  
                  <PhotoCapture
                    label="Capturar Número de Serie"
                    onPhotoCapture={(photo) => updateProductField('serialPhoto', photo)}
                    required
                  />
                </div>
              )}
              
              <ToggleSwitch
                label="¿Producto Tiene Modelo?"
                checked={currentProduct.hasModel}
                onChange={(value) => updateProductField('hasModel', value)}
              />
              
              {currentProduct.hasModel && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                  <label className="text-sm font-medium">
                    Ingresar modelo
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <Input
                    type="text"
                    value={currentProduct.modelNumber}
                    onChange={(e) => updateProductField('modelNumber', e.target.value)}
                    placeholder="Ej. MD-2023-X"
                  />
                </div>
              )}
            </Card>
          </div>
        </main>
        
        {/* Updated Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="container max-w-3xl mx-auto p-4">
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white"
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
