import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export const generateWordDocument = async (jsonData: any) => {
  try {
    // Fetch the template
    const response = await fetch('/templates/INFORME_INSPECCION_PLANTILLA.docx');
    const arrayBuffer = await response.arrayBuffer();
    
    // Load the docx file as binary content
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Prepare data for template - flatten nested objects and format arrays
    const templateData = {
      ...jsonData,
      // Flatten alcance_inspeccion
      revision_contenedor: jsonData.alcance_inspeccion?.revision_contenedor || '',
      conteo_bultos: jsonData.alcance_inspeccion?.conteo_bultos || '',
      apertura_bultos: jsonData.alcance_inspeccion?.apertura_bultos || '',
      pesaje_bultos: jsonData.alcance_inspeccion?.pesaje_bultos || '',
      embalaje_chk: jsonData.alcance_inspeccion?.embalaje || '',
      palets_fumigados: jsonData.alcance_inspeccion?.palets_fumigados || '',
      marcas_chk: jsonData.alcance_inspeccion?.marcas || '',
      descripcion_estiba: jsonData.alcance_inspeccion?.descripcion_estiba || '',
      mercancia_trincada: jsonData.alcance_inspeccion?.mercancia_trincada || '',
      fecha_produccion_chk: jsonData.alcance_inspeccion?.fecha_produccion_chk || '',
      fecha_caducidad_chk: jsonData.alcance_inspeccion?.fecha_caducidad_chk || '',
      lotes_chk: jsonData.alcance_inspeccion?.lotes_chk || '',
      certificados_chk: jsonData.alcance_inspeccion?.certificados_chk || '',
      toma_muestras: jsonData.alcance_inspeccion?.toma_muestras || '',
      pruebas_laboratorio: jsonData.alcance_inspeccion?.pruebas_laboratorio || '',
      pesaje_contenedor_chk: jsonData.alcance_inspeccion?.pesaje_contenedor_chk || '',
      tique_pesaje_chk: jsonData.alcance_inspeccion?.tique_pesaje_chk || '',
      temp_almacenaje_chk: jsonData.alcance_inspeccion?.temp_almacenaje_chk || '',
      temp_contenedor_chk: jsonData.alcance_inspeccion?.temp_contenedor_chk || '',
      precintado_chk: jsonData.alcance_inspeccion?.precintado_chk || '',
      precintado_grupaje_chk: jsonData.alcance_inspeccion?.precintado_grupaje_chk || '',
      precinto_barra_chk: jsonData.alcance_inspeccion?.precinto_barra_chk || '',
      informe_campo_chk: jsonData.alcance_inspeccion?.informe_campo_chk || '',
      
      // Flatten hallazgos_contenedores
      limpios: jsonData.hallazgos_contenedores?.limpios || '',
      libres_olores: jsonData.hallazgos_contenedores?.libres_olores || '',
      sin_agujeros_filtrado_luz: jsonData.hallazgos_contenedores?.sin_agujeros_filtrado_luz || '',
      sin_oxido_relevante: jsonData.hallazgos_contenedores?.sin_oxido_relevante || '',
      cierre_puertas_correcto: jsonData.hallazgos_contenedores?.cierre_puertas_correcto || '',
      
      // Format embalaje arrays as strings
      embalaje_tipo: Array.isArray(jsonData.embalaje?.tipo) 
        ? jsonData.embalaje.tipo.join(', ') 
        : '',
      embalaje_material: Array.isArray(jsonData.embalaje?.material) 
        ? jsonData.embalaje.material.join(', ') 
        : '',
      embalaje_presentado: Array.isArray(jsonData.embalaje?.presentado) 
        ? jsonData.embalaje.presentado.join(', ') 
        : '',
    };

    // Set the template data
    doc.setData(templateData);

    // Render the document
    doc.render();

    // Generate the output as a blob
    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    return output;
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};
