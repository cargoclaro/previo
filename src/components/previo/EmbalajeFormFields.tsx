import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Card from '@/components/common/Card';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PhotoCapture from '@/components/common/PhotoCapture';
import { Package2, Scale, Truck, MapPin } from 'lucide-react';

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

interface EmbalajeFormFieldsProps {
  headerData: PrevioHeaderData;
  updateField: (field: keyof PrevioHeaderData, value: string | number) => void;
  goodPackagingCondition: boolean;
  setGoodPackagingCondition: (value: boolean) => void;
  hasSeals: boolean;
  setHasSeals: (value: boolean) => void;
  certifiedPallet: boolean;
  setCertifiedPallet: (value: boolean) => void;
  setPackagingPhoto: (photo: string | null) => void;
  setSealsPhoto: (photo: string | null) => void;
  setPalletPhoto: (photo: string | null) => void;
  previoId: string;
}

const packageTypes = [
  { value: 'cajas', label: 'Cajas' },
  { value: 'pallets', label: 'Pallets' },
  { value: 'bultos', label: 'Bultos' },
  { value: 'contenedor', label: 'Contenedor' },
  { value: 'sacos', label: 'Sacos' },
  { value: 'rollos', label: 'Rollos' },
  { value: 'tambores', label: 'Tambores' },
  { value: 'bidones', label: 'Bidones' },
  { value: 'piezas_sueltas', label: 'Piezas Sueltas' },
  { value: 'atados', label: 'Atados' },
  { value: 'bobinas', label: 'Bobinas' },
  { value: 'otros', label: 'Otros' }
];

const EmbalajeFormFields: React.FC<EmbalajeFormFieldsProps> = ({
  headerData,
  updateField,
  goodPackagingCondition,
  setGoodPackagingCondition,
  hasSeals,
  setHasSeals,
  certifiedPallet,
  setCertifiedPallet,
  setPackagingPhoto,
  setSealsPhoto,
  setPalletPhoto,
  previoId
}) => {
  const [customPackageType, setCustomPackageType] = useState('');

  const handlePackageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'otros') {
      updateField('packageType', customPackageType || 'Otro tipo');
    } else {
      updateField('packageType', value);
    }
  };

  const handleCustomPackageTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPackageType(value);
    if (headerData.packageType === 'otros') {
      updateField('packageType', value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Client Summary */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Resumen del Cliente</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Cliente:</p>
            <p className="text-gray-600">{headerData.client}</p>
          </div>
          <div>
            <p className="font-medium">Entrada:</p>
            <p className="text-gray-600">{headerData.entry}</p>
          </div>
        </div>
      </Card>

      {/* Packaging Details */}
      <Card className="p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Package2 className="w-4 h-4 text-cargo-orange" />
            Cantidad de Bultos
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            value={headerData.packages || ''}
            onChange={(e) => updateField('packages', parseInt(e.target.value) || 0)}
            placeholder="Cantidad de bultos"
            className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Package2 className="w-4 h-4 text-cargo-orange" />
            Tipo de Bulto
            <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border rounded-md border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
            value={packageTypes.some(type => type.value === headerData.packageType) ? headerData.packageType : 'otros'}
            onChange={handlePackageTypeChange}
          >
            <option value="">Seleccione tipo de bulto</option>
            {packageTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          {(headerData.packageType === 'otros' || 
            (!packageTypes.some(type => type.value === headerData.packageType) && headerData.packageType)) && (
            <div className="mt-2">
              <Input
                value={customPackageType || headerData.packageType}
                onChange={handleCustomPackageTypeChange}
                placeholder="Especifique el tipo de bulto"
                className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Truck className="w-4 h-4 text-cargo-orange" />
            Línea Transportista
            <span className="text-destructive">*</span>
          </label>
          <Input
            value={headerData.carrier}
            onChange={(e) => updateField('carrier', e.target.value)}
            placeholder="Nombre de la línea transportista"
            className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Scale className="w-4 h-4 text-cargo-orange" />
            Peso Total (lbs)
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            value={headerData.totalWeight || ''}
            onChange={(e) => updateField('totalWeight', parseFloat(e.target.value) || 0)}
            placeholder="Peso total en libras"
            className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-cargo-orange" />
            Ubicación
          </label>
          <Input
            value={headerData.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Ubicación del embarque"
            className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
          />
        </div>
      </Card>

      {/* Package Condition */}
      <Card className="p-4 space-y-6">
        <h3 className="font-medium">Condición del Embalaje</h3>
        
        <ToggleSwitch
          label="¿Embalaje viene en buen estado?"
          checked={goodPackagingCondition}
          onChange={setGoodPackagingCondition}
        />
        
        {goodPackagingCondition && (
          <div className="pl-4 border-l-2 border-primary/20">
            <PhotoCapture
              label="Captura Evidencia De Estado de Embalaje"
              operationType="embalaje"
              operationId={previoId}
              description="Estado del embalaje"
              onPhotoCapture={(photo) => setPackagingPhoto(photo)}
              required
            />
          </div>
        )}
        
        <ToggleSwitch
          label="¿El embalaje cuenta con sellos?"
          checked={hasSeals}
          onChange={setHasSeals}
        />
        
        {hasSeals && (
          <div className="pl-4 border-l-2 border-primary/20">
            <PhotoCapture
              label="Captura Evidencia de Sellos de Embalaje"
              operationType="embalaje"
              operationId={previoId}
              description="Sellos del embalaje"
              onPhotoCapture={(photo) => setSealsPhoto(photo)}
              required
            />
          </div>
        )}
        
        <ToggleSwitch
          label="¿Tarima Certificada?"
          checked={certifiedPallet}
          onChange={setCertifiedPallet}
        />
        
        {certifiedPallet && (
          <div className="pl-4 border-l-2 border-primary/20">
            <PhotoCapture
              label="Tomar foto de Tarima"
              operationType="embalaje"
              operationId={previoId}
              description="Tarima certificada"
              onPhotoCapture={(photo) => setPalletPhoto(photo)}
              required
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmbalajeFormFields; 