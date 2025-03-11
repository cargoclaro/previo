import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

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

/**
 * Creates a PDF document with the form data
 * @param headerData - The form data to include in the PDF
 * @param products - The list of products to include in the PDF
 * @returns The jsPDF document object
 */
const createPrevioPDF = (headerData: PrevioHeaderData, products: Product[]): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(33, 33, 33);
  doc.text('Reporte de Previo', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleString()}`, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });
  
  // Add header information
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);
  
  // Header box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 35, doc.internal.pageSize.getWidth() - 28, 80, 'FD');
  
  // Client and Supplier information
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Información General', 20, 45);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  // Left column
  const leftX = 20;
  let y = 55;
  
  doc.setFont(undefined, 'bold');
  doc.text('Cliente:', leftX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.client || 'N/A', leftX + 30, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Fecha:', leftX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.date || 'N/A', leftX + 30, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Entrada:', leftX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.entry || 'N/A', leftX + 30, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('P.O.:', leftX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.purchaseOrder || 'N/A', leftX + 30, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Guía:', leftX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.trackingNumber || 'N/A', leftX + 30, y);
  
  // Right column
  const rightX = doc.internal.pageSize.getWidth() / 2 + 10;
  y = 55;
  
  doc.setFont(undefined, 'bold');
  doc.text('Proveedor:', rightX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.supplier || 'N/A', rightX + 35, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Bultos:', rightX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.packages.toString() || '0', rightX + 35, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Tipo de Bulto:', rightX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.packageType || 'N/A', rightX + 35, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Línea:', rightX, y);
  doc.setFont(undefined, 'normal');
  doc.text(headerData.carrier || 'N/A', rightX + 35, y);
  y += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Peso Total:', rightX, y);
  doc.setFont(undefined, 'normal');
  doc.text(`${headerData.totalWeight} lbs` || '0 lbs', rightX + 35, y);
  
  // Add product details
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Detalles de Productos', 20, 130);
  
  // Convert products to table data
  const productTableData = products.map(product => [
    product.code,
    product.detailedDescription,
    `${product.quantity} ${product.unitOfMeasure}`,
    `${product.weight} lbs`,
    product.origin,
    product.matchesInvoice ? 'Sí' : 'No',
    product.discrepancy || 'N/A'
  ]);
  
  autoTable(doc, {
    startY: 140,
    head: [['Código', 'Descripción', 'Cantidad', 'Peso', 'Origen', 'Coincide', 'Discrepancia']],
    body: productTableData.length > 0 ? productTableData : [['No hay productos registrados', '', '', '', '', '', '']],
    theme: 'grid',
    headStyles: {
      fillColor: [255, 128, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 'auto' },
    },
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

/**
 * Generates a PDF document with the form data
 * @param headerData - The form data to include in the PDF
 * @param products - The list of products to include in the PDF
 * @param filename - Optional custom filename (default: 'previo-report.pdf')
 */
export const generatePrevioPDF = (
  headerData: PrevioHeaderData,
  products: Product[],
  filename: string = 'previo-report.pdf'
) => {
  // Create and save the PDF document
  const doc = createPrevioPDF(headerData, products);
  doc.save(filename);
  return doc;
};

/**
 * Generates a PDF document with the form data and returns it as a data URL for preview
 * @param headerData - The form data to include in the PDF
 * @param products - The list of products to include in the PDF
 */
export const generatePrevioDataURL = (headerData: PrevioHeaderData, products: Product[]): string => {
  // Create the PDF document and return as data URL
  const doc = createPrevioPDF(headerData, products);
  return `data:application/pdf;base64,${doc.output('base64')}`;
}; 