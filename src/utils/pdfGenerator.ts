import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

interface PrevioHeaderData {
  client: string;
  date: string;
  entry: string;
  supplier: string;
  packages: number;
  packageType: string | null;
  carrier: string | null;
  totalWeight: number | null;
  location: string | null;
  purchaseOrder: string | null;
  trackingNumber: string | null;
  revisor?: string;
}

interface Product {
  id: string;
  code: string;
  detailedDescription: string;
  quantity: number;
  unitOfMeasure: string;
  weight: number | null;
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

const ORANGE_COLOR = [255, 84, 0]; // RGB for Cargo Claro orange
const GRAY_COLOR = [128, 128, 128];
const LIGHT_GRAY = [245, 245, 245];
const TEXT_COLOR = [33, 33, 33];

/**
 * Creates a PDF document with the form data
 * @param headerData - The form data to include in the PDF
 * @param products - The list of products to include in the PDF
 * @returns The jsPDF document object
 */
const createPrevioPDF = (headerData: PrevioHeaderData, products: Product[]): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight;
  
  // Add title in orange
  doc.setFontSize(24);
  doc.setTextColor(ORANGE_COLOR[0], ORANGE_COLOR[1], ORANGE_COLOR[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Previo Cargo Claro', pageWidth / 2, 20, { align: 'center' });
  
  // Add date and revisor
  doc.setFontSize(10);
  doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);
  doc.setFont('helvetica', 'normal');
  const revisorText = headerData.revisor ? ` | Revisor: ${headerData.revisor}` : '';
  doc.text(`Generado: ${new Date().toLocaleString('es-MX')}${revisorText}`, pageWidth / 2, 27, { align: 'center' });
  
  // Create the general information section
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(LIGHT_GRAY[0], LIGHT_GRAY[1], LIGHT_GRAY[2]);
  doc.rect(marginLeft, 35, contentWidth, 85, 'FD');
  
  // Add general information header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
  doc.text('Información General', marginLeft + 6, 45);
  
  // Left column
  doc.setFontSize(11);
  const leftX = marginLeft + 6;
  let y = 55;
  const labelOffset = 30;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.client || 'N/A', leftX + labelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.date || 'N/A', leftX + labelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Entrada:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.entry || 'N/A', leftX + labelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('P.O.:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.purchaseOrder || 'N/A', leftX + labelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Guía:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.trackingNumber || 'N/A', leftX + labelOffset, y);
  
  // Right column
  const rightX = pageWidth / 2 + 10;
  y = 55;
  const rightLabelOffset = 35;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Proveedor:', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.supplier || 'N/A', rightX + rightLabelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Bultos:', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${headerData.packages} ${headerData.packageType || ''}` || '0', rightX + rightLabelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Línea:', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.carrier || 'N/A', rightX + rightLabelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Peso Total:', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${headerData.totalWeight || 0} lbs`, rightX + rightLabelOffset, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Ubicación:', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(headerData.location || 'N/A', rightX + rightLabelOffset, y);
  
  // Add products title
  const productsY = 135;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalles de Productos', marginLeft + 6, productsY);
  
  // Convert products to table data
  const productTableData = products.map(product => [
    product.code,
    product.detailedDescription,
    `${product.quantity} ${product.unitOfMeasure}`,
    `${product.weight || 0} lbs`,
    product.origin,
    product.matchesInvoice ? 'Sí' : 'No',
    product.discrepancy || 'N/A'
  ]);
  
  // Create product table with adjusted column widths
  autoTable(doc, {
    startY: productsY + 5,
    tableWidth: 'auto',
    margin: { left: 7, right: 7 },
    head: [['Código', 'Descrip.', 'Cantidad', 'Peso', 'Origen', 'Coincide', 'Discrepancia']],
    body: productTableData.length > 0 ? productTableData : [['No hay productos registrados', '', '', '', '', '', '']],
    theme: 'grid',
    headStyles: {
      fillColor: [ORANGE_COLOR[0], ORANGE_COLOR[1], ORANGE_COLOR[2]] as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 8,
      cellPadding: 2
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: 'middle',
      overflow: 'linebreak',
      lineWidth: 0.1
    },
    // Column widths as percentages of available space
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' }, // Código
      1: { cellWidth: 30, halign: 'left' },   // Descripción
      2: { cellWidth: 10, halign: 'center' }, // Cantidad
      3: { cellWidth: 10, halign: 'center' }, // Peso
      4: { cellWidth: 10, halign: 'center' }, // Origen
      5: { cellWidth: 10, halign: 'center' }, // Coincide
      6: { cellWidth: 15, halign: 'left' }    // Discrepancia
    },
    didDrawPage: (data) => {
      // Add header to each page
      if (data.pageNumber > 1) {
        doc.setFontSize(10);
        doc.setTextColor(ORANGE_COLOR[0], ORANGE_COLOR[1], ORANGE_COLOR[2]);
        doc.text('Previo Cargo Claro', pageWidth / 2, 15, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
        doc.text('Detalles de Productos (continuación)', marginLeft + 6, 25);
      }
    }
  });
  
  // Add footer with page numbers
  const pageCount = (doc as any).internal.pages.length;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
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
  return doc.output('datauristring');
};
