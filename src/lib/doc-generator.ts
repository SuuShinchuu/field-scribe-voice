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

  try {
    // Step 1: Generate Word document
    console.log('[PDF] 1) Generando documento Word...');
    const wordBlob = await generateWordDocument(jsonData);
    console.log('[PDF] Word generado. size=', wordBlob.size);

    // Step 2: Render DOCX to HTML using docx-preview
    console.log('[PDF] 2) Renderizando DOCX a HTML...');
    
    // Create a temporary container for the rendered document
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.minHeight = '297mm';
    container.style.background = 'white';
    container.style.padding = '20mm';
    container.style.zIndex = '-1';
    container.style.opacity = '0';
    document.body.appendChild(container);

    // Import docx-preview dynamically
    const { renderAsync } = await import('docx-preview');
    
    // Render the DOCX to HTML
    await renderAsync(wordBlob, container, undefined, {
      className: 'docx-preview',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      experimental: true,
      trimXmlDeclaration: true,
      useBase64URL: true,
      renderHeaders: true,
      renderFooters: true,
    });

    console.log('[PDF] HTML renderizado. Container height:', container.scrollHeight);
    console.log('[PDF] 3) Convirtiendo HTML a PDF...');
    
    // Wait a bit for all resources to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Import html2pdf dynamically
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Convert HTML to PDF
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: 'documento.pdf',
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' as const,
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'], before: '.page-break' }
    };

    const pdfBlob = await html2pdf()
      .set(opt)
      .from(container)
      .output('blob');

    // Clean up
    document.body.removeChild(container);

    console.log('[PDF] PDF generado. size=', pdfBlob.size);
    console.timeEnd('[PDF] Tiempo total');
    console.groupEnd();
    
    return pdfBlob;
  } catch (error) {
    console.error('[PDF] Error en conversión:', error);
    console.groupEnd();
    throw error;
  }
}