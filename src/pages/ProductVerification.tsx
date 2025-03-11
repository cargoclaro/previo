
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/common/Card';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import Button from '@/components/common/Button';
import { ChevronRight, Plus, Trash, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

// Define the Product type
interface Product {
  id: string;
  matchesInvoice: boolean;
  discrepancy: string;
  selectedProduct: string;
  selectedOrigin: string;
  productDescription: string;
  productPhoto: string | null;
  hasLabel: boolean;
  labelPhoto: string | null;
  hasSerialNumber: boolean;
  serialNumber: string;
  serialPhoto: string | null;
  hasModel: boolean;
  modelNumber: string;
}

const ProductVerification = () => {
  const navigate = useNavigate();
  
  // State for managing multiple products
  const [products, setProducts] = useState<Product[]>([{
    id: `product-${Date.now()}`,
    matchesInvoice: true,
    discrepancy: '',
    selectedProduct: '',
    selectedOrigin: '',
    productDescription: '',
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
    { value: 'china', label: 'China' },
    { value: 'usa', label: 'Estados Unidos' },
    { value: 'mexico', label: 'México' },
    { value: 'europa', label: 'Europa' },
    { value: 'japon', label: 'Japón' },
  ];

  // Add a new product
  const addProduct = () => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      matchesInvoice: true,
      discrepancy: '',
      selectedProduct: '',
      selectedOrigin: '',
      productDescription: '',
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
      
      if (!product.selectedProduct) {
        toast.error(`Producto ${i + 1}: Selecciona un tipo de producto`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.selectedOrigin) {
        toast.error(`Producto ${i + 1}: Selecciona un origen`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.productDescription) {
        toast.error(`Producto ${i + 1}: Ingresa descripción del producto`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (!product.productPhoto) {
        toast.error(`Producto ${i + 1}: Captura foto del producto`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (product.hasLabel && !product.labelPhoto) {
        toast.error(`Producto ${i + 1}: Captura foto del etiquetado`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (product.hasSerialNumber && (!product.serialNumber || !product.serialPhoto)) {
        toast.error(`Producto ${i + 1}: Ingresa y captura el número de serie`);
        setCurrentProductIndex(i);
        return false;
      }
      
      if (product.hasModel && !product.modelNumber) {
        toast.error(`Producto ${i + 1}: Ingresa el número de modelo`);
        setCurrentProductIndex(i);
        return false;
      }
    }
    
    return true;
  };

  // Handle final submission
  const handleSubmit = () => {
    if (validateProducts()) {
      toast.success('Verificación de productos completada correctamente');
      navigate('/');
    }
  };

  // Get current product being edited
  const currentProduct = products[currentProductIndex];

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Verificación de Productos" showBackButton />
        
        <main className="flex-1 px-4 py-6 pb-20">
          <div className="container max-w-md mx-auto space-y-6 animate-slide-up">
            {/* Product Navigation */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Productos ({products.length})</h3>
                
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
            <div className="space-y-4">
              <Card className="space-y-4">
                <h3 className="text-lg font-medium">Producto {currentProductIndex + 1}</h3>
                
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
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Producto<span className="text-destructive ml-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={currentProduct.selectedProduct}
                      onChange={(e) => updateProductField('selectedProduct', e.target.value)}
                    >
                      <option value="">Seleccionar producto</option>
                      {productOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Origen<span className="text-destructive ml-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={currentProduct.selectedOrigin}
                      onChange={(e) => updateProductField('selectedOrigin', e.target.value)}
                    >
                      <option value="">Seleccionar origen</option>
                      {originOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Descripción del producto<span className="text-destructive ml-1">*</span>
                    </label>
                    <textarea
                      className="w-full h-24 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={currentProduct.productDescription}
                      onChange={(e) => updateProductField('productDescription', e.target.value)}
                      placeholder="Describe el producto detalladamente..."
                    ></textarea>
                  </div>
                </div>
              </Card>
              
              <Card className="space-y-4">
                <h3 className="text-lg font-medium">Documentación Fotográfica</h3>
                
                <PhotoCapture
                  label="Capturar Foto de Producto"
                  onPhotoCapture={(photo) => updateProductField('productPhoto', photo)}
                  required
                />
                
                <ToggleSwitch
                  label="¿Producto Cuenta con Etiquetado?"
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
                  label="¿Producto Tiene Número de Serie?"
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
          </div>
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="container max-w-md mx-auto">
            <Button
              className="w-full"
              onClick={handleSubmit}
              icon={<Check size={18} />}
            >
              Finalizar Verificación
            </Button>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default ProductVerification;
