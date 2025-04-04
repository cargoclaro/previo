import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Card from '@/components/common/Card';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import { Package2, Plus, Trash, Camera, FileText, Scan, Tag, Bookmark } from 'lucide-react';

interface Product {
  id: string;
  numero_parte: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  pais_origen: string;
  peso_neto_unitario: number;
  peso_neto_total: number;
  peso_bruto: number;
  marca: string;
  modelo_lote: string;
  serie: string;
  accesorios: string;
  productPhoto: string | null;
  hasLabel: boolean;
  labelPhoto: string | null;
  matchesInvoice: boolean;
  discrepancy: string;
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
  { value: 'kilo', label: 'KILO' },
  { value: 'gramo', label: 'GRAMO' },
  { value: 'metro_lineal', label: 'METRO LINEAL' },
  { value: 'metro_cuadrado', label: 'METRO CUADRADO' },
  { value: 'metro_cubico', label: 'METRO CUBICO' },
  { value: 'pieza', label: 'PIEZA' },
  { value: 'cabeza', label: 'CABEZA' },
  { value: 'litro', label: 'LITRO' },
  { value: 'par', label: 'PAR' },
  { value: 'kilowatt', label: 'KILOWATT' },
  { value: 'millar', label: 'MILLAR' },
  { value: 'juego', label: 'JUEGO' },
  { value: 'kilowatt_hora', label: 'KILOWATT/HORA' },
  { value: 'tonelada', label: 'TONELADA' },
  { value: 'barril', label: 'BARRIL' },
  { value: 'gramo_neto', label: 'GRAMO NETO' },
  { value: 'decenas', label: 'DECENAS' },
  { value: 'cientos', label: 'CIENTOS' },
  { value: 'docenas', label: 'DOCENAS' },
  { value: 'caja', label: 'CAJA' },
  { value: 'botella', label: 'BOTELLA' },
  { value: 'otros', label: 'OTROS' }
];

const euCountries = [
  { value: 'alemania', label: 'Alemania' },
  { value: 'austria', label: 'Austria' },
  { value: 'belgica', label: 'Bélgica' },
  { value: 'bulgaria', label: 'Bulgaria' },
  { value: 'chipre', label: 'Chipre' },
  { value: 'croacia', label: 'Croacia' },
  { value: 'dinamarca', label: 'Dinamarca' },
  { value: 'eslovaquia', label: 'Eslovaquia' },
  { value: 'eslovenia', label: 'Eslovenia' },
  { value: 'espana', label: 'España' },
  { value: 'estonia', label: 'Estonia' },
  { value: 'finlandia', label: 'Finlandia' },
  { value: 'francia', label: 'Francia' },
  { value: 'grecia', label: 'Grecia' },
  { value: 'hungria', label: 'Hungría' },
  { value: 'irlanda', label: 'Irlanda' },
  { value: 'italia', label: 'Italia' },
  { value: 'letonia', label: 'Letonia' },
  { value: 'lituania', label: 'Lituania' },
  { value: 'luxemburgo', label: 'Luxemburgo' },
  { value: 'malta', label: 'Malta' },
  { value: 'paises_bajos', label: 'Países Bajos' },
  { value: 'polonia', label: 'Polonia' },
  { value: 'portugal', label: 'Portugal' },
  { value: 'republica_checa', label: 'República Checa' },
  { value: 'rumania', label: 'Rumanía' },
  { value: 'suecia', label: 'Suecia' }
];

const originOptions = [
  { value: 'USA', label: 'Estados Unidos' },
  { value: 'China', label: 'China' },
  { value: 'EU', label: 'Unión Europea' },
  { value: 'otros', label: 'Otros' }
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
  const [customOrigin, setCustomOrigin] = useState('');

  // Update peso_neto_total when cantidad or peso_neto_unitario changes
  useEffect(() => {
    if (currentProduct.cantidad && currentProduct.peso_neto_unitario) {
      const totalWeight = currentProduct.cantidad * currentProduct.peso_neto_unitario;
      updateProductField('peso_neto_total', totalWeight);
    }
  }, [currentProduct.cantidad, currentProduct.peso_neto_unitario]);

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'otros') {
      updateProductField('unidad_medida', customUnit || '');
    } else {
      updateProductField('unidad_medida', value);
    }
  };

  const handleCustomUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomUnit(value);
    if (!unitOptions.some(opt => opt.value === currentProduct.unidad_medida)) {
      updateProductField('unidad_medida', value);
    }
  };

  const handleOriginChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'otros') {
      updateProductField('pais_origen', customOrigin || '');
    } else {
      updateProductField('pais_origen', value);
    }
  };

  const handleCustomOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomOrigin(value);
    if (!originOptions.some(opt => opt.value === currentProduct.pais_origen) && 
        !euCountries.some(country => country.value === currentProduct.pais_origen)) {
      updateProductField('pais_origen', value);
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
          
          {/* Numero de Parte Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Número de Parte
            </label>
            <Input
              value={currentProduct.numero_parte}
              onChange={(e) => updateProductField('numero_parte', e.target.value)}
              placeholder="Ingrese el número de parte"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Descripcion Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <FileText className="w-4 h-4 text-cargo-orange" />
              Descripción
              <span className="text-destructive">*</span>
            </label>
            <Input
              value={currentProduct.descripcion}
              onChange={(e) => updateProductField('descripcion', e.target.value)}
              placeholder="Ingrese la descripción del producto"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Cantidad Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Cantidad
              <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              value={currentProduct.cantidad || ''}
              onChange={(e) => updateProductField('cantidad', parseInt(e.target.value) || '')}
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
              value={unitOptions.some(opt => opt.value === currentProduct.unidad_medida) ? currentProduct.unidad_medida : 'otros'}
              onChange={handleUnitChange}
            >
              <option value="">Seleccione unidad</option>
              {unitOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {(!unitOptions.some(opt => opt.value === currentProduct.unidad_medida) || currentProduct.unidad_medida === 'otros') && (
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Especifique otra unidad"
                  value={customUnit || currentProduct.unidad_medida}
                  onChange={handleCustomUnitChange}
                  className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                />
              </div>
            )}
          </div>
          
          {/* Origin Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              País de Origen
              <span className="text-destructive">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
              value={originOptions.some(opt => opt.value === currentProduct.pais_origen) ? currentProduct.pais_origen : 
                     euCountries.some(country => country.value === currentProduct.pais_origen) ? 'EU' : 'otros'}
              onChange={handleOriginChange}
            >
              <option value="">Seleccione origen</option>
              {originOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {currentProduct.pais_origen === 'EU' && (
              <div className="mt-2">
                <select
                  className="w-full px-3 py-2 border rounded-md border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                  value={currentProduct.pais_origen}
                  onChange={(e) => updateProductField('pais_origen', e.target.value)}
                >
                  <option value="">Seleccione país de la UE</option>
                  {euCountries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(!originOptions.some(opt => opt.value === currentProduct.pais_origen) && 
              !euCountries.some(country => country.value === currentProduct.pais_origen) || 
              currentProduct.pais_origen === 'otros') && (
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Especifique otro origen"
                  value={customOrigin || currentProduct.pais_origen}
                  onChange={handleCustomOriginChange}
                  className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
                />
              </div>
            )}
          </div>
          
          {/* Peso Neto Unitario Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Peso Neto Unitario (lbs)
              <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              value={currentProduct.peso_neto_unitario || ''}
              onChange={(e) => updateProductField('peso_neto_unitario', parseFloat(e.target.value) || '')}
              placeholder="Ingrese el peso neto por unidad"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Peso Neto Total Field - Auto-calculated */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Peso Neto Total (lbs)
              <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              value={currentProduct.peso_neto_total || ''}
              readOnly
              className="w-full border-cargo-gray/40 bg-gray-50"
            />
            <p className="text-xs text-gray-500">Este valor se calcula automáticamente (Cantidad × Peso Neto Unitario)</p>
          </div>
          
          {/* Peso Bruto Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Peso Bruto (lbs)
            </label>
            <Input
              type="number"
              value={currentProduct.peso_bruto || ''}
              onChange={(e) => updateProductField('peso_bruto', parseFloat(e.target.value) || '')}
              placeholder="Ingrese el peso bruto"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Marca Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Bookmark className="w-4 h-4 text-cargo-orange" />
              Marca
            </label>
            <Input
              type="text"
              value={currentProduct.marca || ''}
              onChange={(e) => updateProductField('marca', e.target.value)}
              placeholder="Ingrese la marca del producto"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Modelo/Lote Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Tag className="w-4 h-4 text-cargo-orange" />
              Modelo/Lote
            </label>
            <Input
              type="text"
              value={currentProduct.modelo_lote || ''}
              onChange={(e) => updateProductField('modelo_lote', e.target.value)}
              placeholder="Ingrese el modelo o lote"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Serie Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Scan className="w-4 h-4 text-cargo-orange" />
              Número de Serie
            </label>
            <Input
              type="text"
              value={currentProduct.serie || ''}
              onChange={(e) => updateProductField('serie', e.target.value)}
              placeholder="Ingrese el número de serie"
              className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            />
          </div>
          
          {/* Accesorios Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Package2 className="w-4 h-4 text-cargo-orange" />
              Accesorios
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-cargo-gray/40 rounded-md focus:outline-none focus:ring-2 focus:ring-cargo-orange/60"
              value={currentProduct.accesorios || ''}
              onChange={(e) => updateProductField('accesorios', e.target.value)}
              placeholder="Describa los accesorios incluidos con el producto..."
            ></textarea>
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
      </Card>
    </div>
  );
};

export default ProductFormFields; 