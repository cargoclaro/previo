import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Card from '@/components/common/Card';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import { Package2, Plus, Trash, Camera, FileText, Scan, Tag } from 'lucide-react';

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

interface ProductFormFieldsProps {
  products: Product[];
  currentProductIndex: number;
  setCurrentProductIndex: (index: number) => void;
  addProduct: () => void;
  removeProduct: (index: number) => void;
  updateProductField: (field: keyof Product, value: any) => void;
  previoId: string;
}

const unitOptions = [
  { value: 'sacos', label: 'Sacos' },
  { value: 'cajas', label: 'Cajas' },
  { value: 'piezas', label: 'Piezas' },
  { value: 'pallets', label: 'Pallets' },
];

const originOptions = [
  { value: 'USA', label: 'USA' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Mexico', label: 'México' },
  { value: 'China', label: 'China' },
  { value: 'Other', label: 'Otro' },
];

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  products,
  currentProductIndex,
  setCurrentProductIndex,
  addProduct,
  removeProduct,
  updateProductField,
  previoId
}) => {
  const currentProduct = products[currentProductIndex];
  const [customUnit, setCustomUnit] = useState('');

  const handleUnitChange = (event) => {
    const value = event.target.value;
    if (value === 'Otro') {
      updateProductField('unitOfMeasure', customUnit);
    } else {
      updateProductField('unitOfMeasure', value);
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Product Navigation */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Package2 className="w-5 h-5 text-cargo-orange" />
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
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <FileText className="w-5 h-5 text-cargo-orange" />
            Detalles del Producto {currentProductIndex + 1}
          </h3>
          
          {/* Code/Lot Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Código/Lote
              <span className="text-destructive">*</span>
            </label>
            <Input
              value={currentProduct.code}
              onChange={(e) => updateProductField('code', e.target.value)}
              placeholder="Ingrese el código o lote"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Detailed Description Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <FileText className="w-4 h-4 text-cargo-orange" />
              Descripción Detallada
              <span className="text-destructive">*</span>
            </label>
            <Input
              value={currentProduct.detailedDescription}
              onChange={(e) => updateProductField('detailedDescription', e.target.value)}
              placeholder="Ingrese la descripción del producto"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Quantity Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Cantidad
              <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              value={currentProduct.quantity}
              onChange={(e) => updateProductField('quantity', parseInt(e.target.value) || 0)}
              placeholder="Ingrese la cantidad"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Unit of Measure Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Unidad de Medida
              <span className="text-destructive">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
              value={currentProduct.unitOfMeasure}
              onChange={handleUnitChange}
            >
              <option value="">Seleccione unidad</option>
              {unitOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {unitOptions.includes('Otro') && (
              <input
                type="text"
                placeholder="Especifique otra unidad"
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
              />
            )}
          </div>
          
          {/* Weight Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Peso (lbs)
              <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              value={currentProduct.weight}
              onChange={(e) => updateProductField('weight', parseFloat(e.target.value) || 0)}
              placeholder="Ingrese el peso en libras"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Origin Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Origen
              <span className="text-destructive">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
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
                className="w-full h-24 px-3 py-2 border border-cargo-gray/40 rounded-md focus:outline-none focus:ring-2 focus:ring-cargo-orange/60"
                value={currentProduct.discrepancy}
                onChange={(e) => updateProductField('discrepancy', e.target.value)}
                placeholder="Describe la diferencia encontrada respecto a la factura..."
              ></textarea>
            </div>
          )}
        </div>
      </Card>
      
      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Camera className="w-5 h-5 text-cargo-orange" />
          Documentación Fotográfica
        </h3>
        
        <PhotoCapture
          label="Capturar Foto de Producto"
          operationType="previo"
          operationId={previoId}
          productId={currentProduct.id}
          description="Foto general del producto"
          onPhotoCapture={(photo) => updateProductField('productPhoto', photo)}
          required
        />
        
        <ToggleSwitch
          label={
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-cargo-orange" />
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
              operationType="previo"
              operationId={previoId}
              productId={currentProduct.id}
              description="Etiquetado del producto"
              onPhotoCapture={(photo) => updateProductField('labelPhoto', photo)}
              required
            />
          </div>
        )}
        
        <ToggleSwitch
          label={
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-cargo-orange" />
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
                className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
              />
            </div>
            
            <PhotoCapture
              label="Capturar Número de Serie"
              operationType="previo"
              operationId={previoId}
              productId={currentProduct.id}
              description="Número de serie del producto"
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
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductFormFields; 