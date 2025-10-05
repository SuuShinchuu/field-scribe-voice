// doc-generator.ts
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';
import jsPDF from 'jspdf'; // compat PDF

// === CONFIG IMÁGENES / CELDA ===
const PX_PER_CM = 37.7952755906;   // ~96 dpi
const CELL_W_CM = 8.8;             // ancho máx celda
const CELL_H_CM = 5.8;             // alto  máx celda

// ==== HELPERS SINCRÓNICOS ====
// dataURL -> ArrayBuffer (lo que exige el módulo)
function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const [, b64 = ''] = dataUrl.split(',');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// --- helpers bàsics ---
const isDataUrl = (s?: string) => typeof s === 'string' && s.startsWith('data:');

async function urlToDataUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result || ''));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('[img] No s’ha pogut convertir a dataURL:', url, e);
    return '';
  }
}

// Redueix dataURL a ~500x300 i qualitat JPEG 0.7
async function downscaleDataUrl(
  dataUrl: string,
  maxW = 500,
  maxH = 300,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Accepta string o {path:string}. Converteix a dataURL i el redueix.
async function ensureDataUrl(v: any): Promise<string> {
  let src = '';

  if (typeof v === 'string') {
    src = isDataUrl(v) ? v : await urlToDataUrl(v);
  } else if (v && typeof v === 'object' && typeof v.path === 'string') {
    src = isDataUrl(v.path) ? v.path : await urlToDataUrl(v.path);
  }

  if (!src) return '';
  // redueix sempre que sigui dataURL
  if (isDataUrl(src)) return await downscaleDataUrl(src);
  return '';
}

async function ensureList(arr?: any[], max = 4): Promise<string[]> {
  const srcs = (arr || []).slice(0, max);
  const out: string[] = [];
  for (const s of srcs) out.push(await ensureDataUrl(s));
  while (out.length < max) out.push('');
  return out;
}
// Lee tamaño PNG
function getPngSize(buf: ArrayBuffer) {
  const dv = new DataView(buf);
  const w = dv.getUint32(16);
  const h = dv.getUint32(20);
  return { w, h };
}
// Lee tamaño JPEG (SOF)
function getJpegSize(buf: ArrayBuffer) {
  const dv = new DataView(buf);
  let i = 2; // salta 0xFFD8
  while (i + 9 < dv.byteLength) {
    const marker = dv.getUint16(i); i += 2;
    const size = dv.getUint16(i);  i += 2;
    if ((marker >= 0xFFC0 && marker <= 0xFFC3) ||
        (marker >= 0xFFC5 && marker <= 0xFFC7) ||
        (marker >= 0xFFC9 && marker <= 0xFFCB) ||
        (marker >= 0xFFCD && marker <= 0xFFCF)) {
      const h = dv.getUint16(i + 1);
      const w = dv.getUint16(i + 3);
      return { w, h };
    }
    i += size - 2;
  }
  return { w: 0, h: 0 };
}

function getImageSizePx(buf: ArrayBuffer) {
  const dv = new DataView(buf);
  if (dv.getUint32(0) === 0x89504E47) return getPngSize(buf); // PNG
  if (dv.getUint16(0) === 0xFFD8)     return getJpegSize(buf); // JPEG
  return { w: 0, h: 0 };
}

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

  // —— Módulo de imágenes: síncrono + fit a celda ——
  const imageModule = new ImageModule({
    // Debe devolver ArrayBuffer (NO Promise)
    getImage: (tagValue: unknown, tagName: string): ArrayBuffer => {
      if (!tagValue) {
        console.warn('[DOCX][getImage] valor vacío para', tagName);
        return new ArrayBuffer(0);
      }

      if (typeof tagValue === 'string') {
        if (tagValue.startsWith('data:')) {
          // dataURL directo del form
          return dataUrlToArrayBuffer(tagValue);
        }
        // Rutas/URL http(s) requerirían fetch async (no se puede aquí)
        console.warn('[DOCX][getImage] URL/ruta no soportada en modo síncrono para', tagName, tagValue.slice(0, 60));
        return new ArrayBuffer(0);
      }

      if (tagValue instanceof Uint8Array) {
        return tagValue.buffer;
      }

      if (tagValue instanceof Blob) {
        console.warn('[DOCX][getImage] Blob recibido: conviértelo a dataURL antes (frontend) para', tagName);
        return new ArrayBuffer(0);
      }

      if (tagValue && typeof tagValue === 'object') {
        const anyVal = tagValue as any;
        if (typeof anyVal.path === 'string' && anyVal.path.startsWith('data:')) {
          return dataUrlToArrayBuffer(anyVal.path);
        }
      }

      console.warn('[DOCX][getImage] tipo no soportado para', tagName, typeof tagValue);
      return new ArrayBuffer(0);
    },

    // Escala manteniendo proporción para encajar en la celda
    getSize: (imgBuf: ArrayBuffer, _tagValue: unknown, tagName: string) => {
      const maxWpx = CELL_W_CM * PX_PER_CM;
      const maxHpx = CELL_H_CM * PX_PER_CM;

      const { w, h } = getImageSizePx(imgBuf);
      if (!w || !h) {
        console.warn('[DOCX][getSize] tamaño desconocido, uso caja máx para', tagName);
        return [maxWpx, maxHpx];
      }
      const scale = Math.min(maxWpx / w, maxHpx / h);
      return [w * scale, h * scale];
    },

    centered: false,
  });

  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{{', end: '}}' }, // texto e imágenes: {{%TAG}}
    nullGetter: () => '',
    modules: [imageModule],
  });

  console.log('[DOCX] JSON keys:', Object.keys(jsonData || {}).length);
  try {
    const full = (doc as any).getFullText?.() ?? '';
    console.log('[DOCX][DEBUG] tiene {{%MERCANCIA_1}}?', full.includes('{{%MERCANCIA_1}}'));
  } catch {}

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
    compression: 'DEFLATE',
  });

  console.log('[DOCX] Blob generado. size=', (out as any).size ?? 'desconocido');
  console.timeEnd('[DOCX] Tiempo total');
  console.groupEnd();
  return out;
}

// ==== PDF (sin cambios; no lo estás usando ahora) ====
export async function generatePDFFromWord(jsonData: any): Promise<Blob> {
  console.group('[PDF] Generación desde Word');
  console.time('[PDF] Tiempo total');

  try {
    console.log('[PDF] 1) Generando documento Word...');
    const wordBlob = await generateWordDocument(jsonData);
    console.log('[PDF] Word generado. size=', wordBlob.size);

    console.log('[PDF] 2) Renderizando DOCX a HTML...');
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

    const { renderAsync } = await import('docx-preview');
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
    await new Promise(resolve => setTimeout(resolve, 500));

    const html2pdf = (await import('html2pdf.js')).default;
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

    const pdfBlob = await html2pdf().set(opt).from(container).output('blob');
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

export async function prepareDocxImages(jsonData: any) {
  const merc = await ensureList(jsonData?.fotos?.mercancia, 4);
  const marc = await ensureList(jsonData?.fotos?.marcas, 4);
  const cont = await ensureList(jsonData?.fotos?.carga_contenedor, 4);

  return {
    MERCANCIA_1: merc[0],
    MERCANCIA_2: merc[1],
    MERCANCIA_3: merc[2],
    MERCANCIA_4: merc[3],
    MARCAS_1:    marc[0],
    MARCAS_2:    marc[1],
    MARCAS_3:    marc[2],
    MARCAS_4:    marc[3],
    CONTENEDOR_1: cont[0],
    CONTENEDOR_2: cont[1],
    CONTENEDOR_3: cont[2],
    CONTENEDOR_4: cont[3],
  };
}