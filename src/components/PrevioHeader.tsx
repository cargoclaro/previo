import React from 'react';
import { Input } from '@/components/ui/input';
import Card from '@/components/common/Card';
import { Building2, Calendar, FileInput, Truck, Package2, BoxesIcon, MapPin, FileText, FileSearch } from 'lucide-react';

interface PrevioHeaderProps {
  data: {
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
  };
  onChange: (field: string, value: string | number) => void;
}

const carrierOptions = ['FDX', 'UPS', 'SAIA', 'XPO', 'SMT', 'ODFL', 'AVERIT', 'ABF', 'OTROS'];

const PrevioHeader: React.FC<PrevioHeaderProps> = ({ data, onChange }) => {
  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileInput className="w-6 h-6 text-orange-500" />
          Información General
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" />
              Cliente
            </label>
            <Input
              value={data.client}
              onChange={(e) => onChange('client', e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>
          
          {/* Fecha */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Fecha
            </label>
            <Input
              type="date"
              value={data.date}
              onChange={(e) => onChange('date', e.target.value)}
            />
          </div>
          
          {/* Entrada */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              Entrada
            </label>
            <Input
              value={data.entry}
              onChange={(e) => onChange('entry', e.target.value)}
              placeholder="Número de entrada"
            />
          </div>
          
          {/* Proveedor */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" />
              Proveedor
            </label>
            <Input
              value={data.supplier}
              onChange={(e) => onChange('supplier', e.target.value)}
              placeholder="Nombre del proveedor"
            />
          </div>
          
          {/* Bultos */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Package2 className="w-4 h-4 text-orange-500" />
              Bultos
            </label>
            <Input
              type="number"
              value={data.packages}
              onChange={(e) => onChange('packages', parseInt(e.target.value) || 0)}
              placeholder="Cantidad de bultos"
            />
          </div>
          
          {/* Tipo de Bulto */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <BoxesIcon className="w-4 h-4 text-orange-500" />
              Tipo de Bulto
            </label>
            <Input
              value={data.packageType}
              onChange={(e) => onChange('packageType', e.target.value)}
              placeholder="Tipo de bulto"
            />
          </div>
          
          {/* Línea */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />
              Línea
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={data.carrier}
              onChange={(e) => onChange('carrier', e.target.value)}
            >
              <option value="">Seleccione línea</option>
              {carrierOptions.map((carrier) => (
                <option key={carrier} value={carrier}>
                  {carrier}
                </option>
              ))}
            </select>
          </div>
          
          {/* Peso Total */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Package2 className="w-4 h-4 text-orange-500" />
              Peso Total (lbs)
            </label>
            <Input
              type="number"
              value={data.totalWeight}
              onChange={(e) => onChange('totalWeight', parseFloat(e.target.value) || 0)}
              placeholder="Peso total en libras"
            />
          </div>
          
          {/* Locación */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Locación
            </label>
            <Input
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Locación"
            />
          </div>
          
          {/* P.O. */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-orange-500" />
              P.O.
            </label>
            <Input
              value={data.purchaseOrder}
              onChange={(e) => onChange('purchaseOrder', e.target.value)}
              placeholder="Número de orden de compra"
            />
          </div>
          
          {/* Guía */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              Guía
            </label>
            <Input
              value={data.trackingNumber}
              onChange={(e) => onChange('trackingNumber', e.target.value)}
              placeholder="Número de guía"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PrevioHeader; 