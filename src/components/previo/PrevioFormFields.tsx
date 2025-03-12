
import React from 'react';
import { Input } from '@/components/ui/input';
import { Building2, Calendar, FileInput, Package2, FileText } from 'lucide-react';

interface ClientData {
  client: string;
  date: string;
  entry: string;
  supplier: string;
  purchaseOrder: string;
  trackingNumber: string;
}

interface PrevioFormFieldsProps {
  clientData: ClientData;
  updateField: (field: keyof ClientData, value: string) => void;
}

const PrevioFormFields: React.FC<PrevioFormFieldsProps> = ({ clientData, updateField }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
          <Building2 className="w-4 h-4 text-cargo-orange" />
          Cliente
          <span className="text-destructive">*</span>
        </label>
        <Input
          value={clientData.client}
          onChange={(e) => updateField('client', e.target.value)}
          placeholder="Nombre del cliente"
          className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-cargo-orange" />
          Fecha
        </label>
        <Input
          type="date"
          value={clientData.date}
          onChange={(e) => updateField('date', e.target.value)}
          className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
          <FileInput className="w-4 h-4 text-cargo-orange" />
          Número de Entrada
          <span className="text-destructive">*</span>
        </label>
        <Input
          value={clientData.entry}
          onChange={(e) => updateField('entry', e.target.value)}
          placeholder="Número de entrada"
          className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
          <Building2 className="w-4 h-4 text-cargo-orange" />
          Proveedor
          <span className="text-destructive">*</span>
        </label>
        <Input
          value={clientData.supplier}
          onChange={(e) => updateField('supplier', e.target.value)}
          placeholder="Nombre del proveedor"
          className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
          <Package2 className="w-4 h-4 text-cargo-orange" />
          Orden de Compra
        </label>
        <Input
          value={clientData.purchaseOrder}
          onChange={(e) => updateField('purchaseOrder', e.target.value)}
          placeholder="Número de orden de compra"
          className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
          <FileText className="w-4 h-4 text-cargo-orange" />
          Número de Guía
        </label>
        <Input
          value={clientData.trackingNumber}
          onChange={(e) => updateField('trackingNumber', e.target.value)}
          placeholder="Número de guía"
          className="w-full border-cargo-gray/40 focus-visible:ring-cargo-orange/60"
        />
      </div>
    </div>
  );
};

export default PrevioFormFields;
