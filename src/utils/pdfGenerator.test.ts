import { generatePrevioPDF } from './pdfGenerator.js';

// Sample data for testing
const sampleHeaderData = {
  client: 'Cliente de Prueba',
  date: '2024-04-04',
  entry: 'ENT-001',
  supplier: 'Proveedor de Prueba',
  packages: 5,
  packageType: 'Cajas',
  carrier: 'Transportista de Prueba',
  totalWeight: 567,
  location: 'Ubicación de Prueba',
  purchaseOrder: 'PO-001',
  trackingNumber: 'TRK-001',
  revisor: 'Juan Pérez'
};

const sampleProducts = [
  {
    id: '1',
    code: 'PROD-001',
    detailedDescription: 'Producto de prueba 1 con una descripción más larga para probar el ajuste de texto',
    quantity: 10,
    unitOfMeasure: 'Piezas',
    weight: 100,
    origin: 'China',
    matchesInvoice: true,
    discrepancy: '',
    productPhoto: null,
    hasLabel: true,
    labelPhoto: null,
    hasSerialNumber: true,
    serialNumber: 'SN-001',
    serialPhoto: null,
    hasModel: true,
    modelNumber: 'MOD-001'
  },
  {
    id: '2',
    code: 'PROD-002',
    detailedDescription: 'Producto de prueba 2',
    quantity: 5,
    unitOfMeasure: 'Cajas',
    weight: 200,
    origin: 'USA',
    matchesInvoice: false,
    discrepancy: 'Cantidad no coincide con la factura',
    productPhoto: null,
    hasLabel: false,
    labelPhoto: null,
    hasSerialNumber: false,
    serialNumber: '',
    serialPhoto: null,
    hasModel: false,
    modelNumber: ''
  }
];

// Function to test the PDF generation
const testPDFGeneration = () => {
  try {
    generatePrevioPDF(sampleHeaderData, sampleProducts, 'test-previo.pdf');
    console.log('✅ PDF generated successfully');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  }
};

// Run the test
testPDFGeneration(); 