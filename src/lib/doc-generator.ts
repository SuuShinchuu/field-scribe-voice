import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

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