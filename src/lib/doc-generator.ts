import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import jsPDF from 'jspdf';

export async function generateWordDocument(jsonData: any): Promise<Blob> {
  const templateUrl = '/templates/INFORME_INSPECCION_PLANTILLA.docx';
  console.group('[DOCX] Generación');
  console.time('[DOCX] Tiempo total');

  console.log('[DOCX] Cargando plantilla:', templateUrl);
  const response = await fetch(templateUrl);
  console.log('[DOCX] response.ok:', response.ok, 'status:', response.status);

  if (!response.ok) {
    console.error('[DOCX] Error HTTP al cargar plantilla:', response.status, response.statusText);
    console.groupEnd();
    throw new Error(`No se pudo cargar la plantilla: ${templateUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  console.log('[DOCX] Plantilla cargada. Bytes:', arrayBuffer.byteLength);

  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{{', end: '}}' },
    nullGetter: () => '',
  });

  console.log('[DOCX] JSON keys:', Object.keys(jsonData || {}).length);

  try {
    doc.render(jsonData);
    console.log('[DOCX] ✅ Render completado sin errores');
  } catch (e: any) {
    console.error('[DOCX] ❌ Error en render:', e);
    const errors = e?.properties?.errors || [];
    if (errors.length) {
      errors.forEach((err: any, i: number) => {
        console.error(`#${i + 1}`, {
          explanation: err.explanation,
          id: err.id,
          tag: err.properties?.tag,
          context: err.properties?.context,
        });
      });
    }
    console.groupEnd();
    throw e;
  }

  console.log('[DOCX] Generando blob...');
  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE', // ↓ ajuda amb documents grans
  });

  console.log('[DOCX] Blob generado. size=', (out as any).size ?? 'desconocido');
  console.timeEnd('[DOCX] Tiempo total');
  console.groupEnd();
  return out;
}

export async function generatePDFFromWord(jsonData: any): Promise<Blob> {
  console.group('[PDF] Generación desde Word');
  console.time('[PDF] Tiempo total');

  // Step 1: Generate Word document
  console.log('[PDF] 1) Generando documento Word...');
  const wordBlob = await generateWordDocument(jsonData);
  console.log('[PDF] Word generado. size=', wordBlob.size);

  // Step 2: Convert Word to PDF
  // Note: Converting DOCX to PDF in browser is complex. 
  // We'll create a simple PDF with the data instead
  console.log('[PDF] 2) Convirtiendo a PDF...');
  
  const doc = new jsPDF();
  let currentY = 20;
  
  // Helper function to add text with word wrap
  const addText = (text: string, y: number, maxWidth: number = 170): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, 20, y);
    return y + (lines.length * 7);
  };
  
  // Helper function to add section header
  const addSection = (title: string, y: number): number => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, y);
    doc.setLineWidth(0.5);
    doc.line(20, y + 2, 190, y + 2);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    return y + 10;
  };

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME FINAL DE INSPECCIÓN', 105, currentY, { align: 'center' });
  currentY += 15;

  // Basic Info
  currentY = addSection('INFORMACIÓN BÁSICA', currentY);
  if (jsonData.expediente_nova) {
    currentY = addText(`Expediente NOVA: ${jsonData.expediente_nova}`, currentY);
  }
  if (jsonData.expediente_cliente) {
    currentY = addText(`Expediente Cliente: ${jsonData.expediente_cliente}`, currentY);
  }
  if (jsonData.fecha_inspeccion) {
    currentY = addText(`Fecha Inspección: ${jsonData.fecha_inspeccion}`, currentY);
  }
  currentY += 5;

  // Check if new page needed
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // Inspection Details
  currentY = addSection('DETALLES DE INSPECCIÓN', currentY);
  if (jsonData.mercancia_declarada) {
    currentY = addText(`Mercancía: ${jsonData.mercancia_declarada}`, currentY);
  }
  if (jsonData.numero_contrato) {
    currentY = addText(`Número Contrato: ${jsonData.numero_contrato}`, currentY);
  }
  if (jsonData.via_transporte) {
    currentY = addText(`Vía Transporte: ${jsonData.via_transporte}`, currentY);
  }
  if (jsonData.tipo_carga) {
    currentY = addText(`Tipo Carga: ${jsonData.tipo_carga}`, currentY);
  }
  if (jsonData.num_con) {
    currentY = addText(`Número Contenedores: ${jsonData.num_con}`, currentY);
  }
  if (jsonData.t_con) {
    currentY = addText(`Tipo Contenedor: ${jsonData.t_con}`, currentY);
  }
  if (jsonData.numer_con) {
    currentY = addText(`Numeración Contenedores: ${jsonData.numer_con}`, currentY);
  }
  if (jsonData.pre_nova) {
    currentY = addText(`Precintos NOVA: ${jsonData.pre_nova}`, currentY);
  }
  if (jsonData.pre_naviera) {
    currentY = addText(`Precintos Naviera: ${jsonData.pre_naviera}`, currentY);
  }
  if (jsonData.ori_dest) {
    currentY = addText(`Puertos Origen/Destino: ${jsonData.ori_dest}`, currentY);
  }
  currentY += 5;

  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // Company Info
  currentY = addSection('INFORMACIÓN DE EMPRESAS', currentY);
  if (jsonData.vendedor_empresa) {
    currentY = addText(`Vendedor: ${jsonData.vendedor_empresa}`, currentY);
  }
  if (jsonData.vendedor_contacto) {
    currentY = addText(`Contacto Vendedor: ${jsonData.vendedor_contacto}`, currentY);
  }
  if (jsonData.comprador_empresa) {
    currentY = addText(`Comprador: ${jsonData.comprador_empresa}`, currentY);
  }
  if (jsonData.comprador_contacto) {
    currentY = addText(`Contacto Comprador: ${jsonData.comprador_contacto}`, currentY);
  }
  if (jsonData.lugar_inspeccion) {
    currentY = addText(`Lugar Inspección: ${jsonData.lugar_inspeccion}`, currentY);
  }
  currentY += 5;

  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // Findings
  currentY = addSection('HALLAZGOS', currentY);
  if (jsonData.numero_bultos_totales) {
    currentY = addText(`Número Bultos: ${jsonData.numero_bultos_totales}`, currentY);
  }
  if (jsonData.apertura_bultos_resultado) {
    currentY = addText(`Apertura Bultos: ${jsonData.apertura_bultos_resultado}`, currentY);
  }
  if (jsonData.pesaje_bultos_resultado) {
    currentY = addText(`Pesaje Bultos: ${jsonData.pesaje_bultos_resultado}`, currentY);
  }
  if (jsonData.detalle_pesos) {
    currentY = addText(`Detalle Pesos: ${jsonData.detalle_pesos}`, currentY);
  }
  if (jsonData.marcas_resultado) {
    currentY = addText(`Marcas: ${jsonData.marcas_resultado}`, currentY);
  }
  if (jsonData.fecha_produccion_valor) {
    currentY = addText(`Fecha Producción: ${jsonData.fecha_produccion_valor}`, currentY);
  }
  if (jsonData.fecha_caducidad_valor) {
    currentY = addText(`Fecha Caducidad: ${jsonData.fecha_caducidad_valor}`, currentY);
  }
  if (jsonData.lotes_valor) {
    currentY = addText(`Lotes: ${jsonData.lotes_valor}`, currentY);
  }
  currentY += 5;

  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // Conclusions
  currentY = addSection('DESCRIPCIÓN Y CONCLUSIONES', currentY);
  if (jsonData.descripcion_estiba_texto) {
    currentY = addText(`Descripción Estiba: ${jsonData.descripcion_estiba_texto}`, currentY);
  }
  if (jsonData.otros_hallazgos) {
    currentY = addText(`Otros Hallazgos: ${jsonData.otros_hallazgos}`, currentY);
  }
  if (jsonData.conclusiones) {
    currentY = addText(`Conclusiones: ${jsonData.conclusiones}`, currentY);
  }
  currentY += 10;

  // Signature
  if (jsonData.lugar_firma) {
    currentY = addText(`Lugar y Fecha: ${jsonData.lugar_firma}`, currentY);
  }

  const pdfBlob = doc.output('blob');
  
  console.log('[PDF] PDF generado. size=', pdfBlob.size);
  console.timeEnd('[PDF] Tiempo total');
  console.groupEnd();
  
  return pdfBlob;
}