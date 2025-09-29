import jsPDF from 'jspdf';

export interface WorkOrderPDFData {
  inspector: string;
  codigoInspector: string;
  movilInspector: string;
  coordinador: string;
  movilCoordinador: string;
  expedienteNova: string;
  paisDestino: string;
  fechaInspeccion: string;
  horaInspeccion: string;
  personaContacto: string;
  expedienteCliente: string;
  exportador: string;
  importador: string;
  numeroContrato: string;
  suplementoContrato: string;
  lugarInspeccion: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  provincia: string;
  telefonoContacto: string;
  otrosDetallesContacto: string;
  cantidadTipoContenedor: string;
  horariosPrevisosCarga: string;
  descripcionMercancia: string;
  puertoAeropuertoOrigen: string;
  puertoAeropuertoDestino: string;
  buque: string;
  observacionesFinales: string;
  observacionesEspeciales: string;
}

export interface FieldInspectionPDFData {
  expedienteNova: string;
  fecha: string;
  codigoInspector: string;
  paisDestino: string;
  referenciaCliente: string;
  numeroContrato: string;
  numeroContenedor: string;
  tipoContenedor: string;
  tamanoContenedor: string;
  precintoNova: string;
  precintoNaviera: string;
  exportador: string;
  proveedor: string;
  personaContacto: string;
  lugarInspeccion: string;
  poblacion: string;
  provincia: string;
  horaInicio: string;
  horaFinalizacion: string;
  alcanceInspeccion: string;
  mercanciaDeclarada: string;
  paisFabricacion: string;
  puertoOrigen: string;
  puertoDestino: string;
  embalajePresentation: string;
  produccion: string;
  caducidad: string;
  tipoBulto: string;
  cantidad: string;
  pesoNeto: string;
  pesoBruto: string;
  estiba: string;
  otros: string;
}

export interface FinalInspectionPDFData {
  expedienteNova: string;
  expedienteCliente: string;
  fechaInspeccion: string;
  mercancia: string;
  numeroContrato: string;
  numeroContenedores: string;
  tipoContenedor: string;
  numeracionContenedores: string;
  precintosNova: string;
  precintosNaviera: string;
  puertos: string;
  vendedorEmpresa: string;
  vendedorContacto: string;
  compradorEmpresa: string;
  compradorContacto: string;
  lugarInspeccion: string;
  numeroBultos: string;
  aperturaBultos: string;
  pesajeBultos: string;
  detallePesos: string;
  marcasDetalle: string;
  fechaProduccionDetalle: string;
  fechaCaducidadDetalle: string;
  lotesDetalle: string;
  descripcionEstibaTexto: string;
  otrosHallazgos: string;
  conclusiones: string;
  anexos: string;
  lugarFecha: string;
}

const addFormField = (doc: jsPDF, x: number, y: number, label: string, value: string, fieldWidth: number = 70, isLarge: boolean = false): number => {
  const fontSize = 10;
  const labelHeight = 12;
  const fieldHeight = isLarge ? 20 : 8;
  const totalHeight = labelHeight + fieldHeight + 5;
  
  // Draw label
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(label + ':', x, y);
  
  // Draw value box
  const boxY = y + 3;
  doc.setFont('helvetica', 'normal');
  doc.rect(x, boxY, fieldWidth, fieldHeight);
  
  // Add value text if exists
  if (value && value.trim()) {
    const textY = boxY + (fieldHeight / 2) + 2;
    if (isLarge) {
      const lines = doc.splitTextToSize(value, fieldWidth - 4);
      let lineY = boxY + 5;
      lines.slice(0, 2).forEach((line: string) => { // Max 2 lines for large fields
        doc.text(line, x + 2, lineY);
        lineY += 5;
      });
    } else {
      doc.text(value.substring(0, 25), x + 2, textY); // Truncate if too long
    }
  }
  
  return y + totalHeight;
};

const addTwoColumnFields = (doc: jsPDF, x: number, y: number, leftLabel: string, leftValue: string, rightLabel: string, rightValue: string, fieldWidth: number = 60): number => {
  const rightX = x + fieldWidth + 20;
  addFormField(doc, x, y, leftLabel, leftValue, fieldWidth);
  addFormField(doc, rightX, y, rightLabel, rightValue, fieldWidth);
  return y + 25;
};

const addSection = (doc: jsPDF, x: number, y: number, title: string): number => {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x, y);
  doc.setLineWidth(0.5);
  doc.line(x, y + 2, x + 170, y + 2);
  return y + 15;
};

const addCheckboxField = (doc: jsPDF, x: number, y: number, label: string, checked: boolean = false): number => {
  const fontSize = 9;
  
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'normal');
  
  // Draw checkbox
  doc.rect(x, y - 3, 3, 3);
  if (checked) {
    doc.text('×', x + 0.5, y - 0.5);
  }
  
  // Draw label
  doc.text(label, x + 5, y);
  
  return y + 6;
};

export const generateWorkOrderPDF = (data: WorkOrderPDFData) => {
  const doc = new jsPDF();
  let currentY = 20;
  
  // Header with border
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDEN DE TRABAJO', 105, currentY + 8, { align: 'center' });
  doc.rect(15, currentY, 180, 12);
  currentY += 18;
  
  // Inspector Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL INSPECTOR');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Inspector', data.inspector, 'Código Inspector', data.codigoInspector);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Móvil Inspector', data.movilInspector, 'Coordinador', data.coordinador);
  currentY = addFormField(doc, 20, currentY, 'Móvil Coordinador', data.movilCoordinador, 85);
  currentY += 5;
  
  // Expedition Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL EXPEDIENTE');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Expediente NOVA', data.expedienteNova, 'País Destino', data.paisDestino);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Fecha Inspección', data.fechaInspeccion, 'Hora Inspección', data.horaInspeccion);
  currentY = addFormField(doc, 20, currentY, 'Persona Contacto', data.personaContacto, 175);
  currentY += 5;
  
  // Client Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL CLIENTE');
  currentY = addFormField(doc, 20, currentY, 'Expediente Cliente', data.expedienteCliente, 175);
  
  // Check if we need new page before adding exportador/importador (prevent cutting)
  if (currentY > 190) {
    doc.addPage();
    currentY = 20;
    currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL CLIENTE (continuación)');
  }
  
  currentY = addTwoColumnFields(doc, 20, currentY, 'Exportador', data.exportador, 'Importador', data.importador);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Número Contrato', data.numeroContrato, 'Suplemento Contrato', data.suplementoContrato);
  currentY += 5;
  
  // Check if new page needed for location
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }
  
  // Location Info Section
  currentY = addSection(doc, 20, currentY, 'LUGAR DE INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Lugar Inspección', data.lugarInspeccion, 140);
  currentY = addFormField(doc, 20, currentY, 'Dirección', data.direccion, 140);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Código Postal', data.codigoPostal, 'Población', data.poblacion);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Provincia', data.provincia, 'Teléfono Contacto', data.telefonoContacto);
  currentY = addFormField(doc, 20, currentY, 'Otros Detalles Contacto', data.otrosDetallesContacto, 140, true);
  currentY += 10;
  
  // Inspection Details Section
  currentY = addSection(doc, 20, currentY, 'DETALLES DE LA INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Cantidad/Tipo Contenedor', data.cantidadTipoContenedor, 140);
  currentY = addFormField(doc, 20, currentY, 'Horarios Previstos Carga', data.horariosPrevisosCarga, 140);
  currentY = addFormField(doc, 20, currentY, 'Descripción Mercancía', data.descripcionMercancia, 140, true);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Puerto/Aeropuerto Origen', data.puertoAeropuertoOrigen, 'Puerto/Aeropuerto Destino', data.puertoAeropuertoDestino);
  currentY = addFormField(doc, 20, currentY, 'Buque', data.buque, 140);
  currentY += 10;
  
  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Observations Section
  currentY = addSection(doc, 20, currentY, 'OBSERVACIONES');
  currentY = addFormField(doc, 20, currentY, 'Observaciones Finales', data.observacionesFinales, 160, true);
  currentY += 5;
  currentY = addFormField(doc, 20, currentY, 'Observaciones Especiales', data.observacionesEspeciales, 160, true);
  
  // Add signature areas
  currentY += 30;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma Inspector:', 20, currentY);
  doc.rect(20, currentY + 5, 60, 15);
  doc.text('Fecha:', 120, currentY);
  doc.rect(120, currentY + 5, 60, 15);
  
  const fileName = `Orden_Trabajo_${data.expedienteNova || 'Sin_Expediente'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateFieldInspectionPDF = (data: FieldInspectionPDFData) => {
  const doc = new jsPDF();
  let currentY = 25;
  
  // Header with border
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE CAMPO', 105, currentY, { align: 'center' });
  doc.rect(15, 15, 180, 15);
  currentY += 25;
  
  // Basic Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN BÁSICA');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Expediente NOVA', data.expedienteNova, 'Fecha', data.fecha);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Código Inspector', data.codigoInspector, 'País Destino', data.paisDestino);
  currentY += 10;
  
  // Client Reference Section
  currentY = addSection(doc, 20, currentY, 'REFERENCIA DEL CLIENTE');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Referencia Cliente', data.referenciaCliente, 'Número Contrato', data.numeroContrato);
  currentY += 10;
  
  // Container Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL CONTENEDOR');
  currentY = addFormField(doc, 20, currentY, 'Número Contenedor', data.numeroContenedor, 140);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Tipo', data.tipoContenedor, 'Tamaño', data.tamanoContenedor);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Precinto NOVA', data.precintoNova, 'Precinto Naviera', data.precintoNaviera);
  currentY += 10;
  
  // Company Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DE EMPRESAS');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Exportador', data.exportador, 'Proveedor', data.proveedor);
  currentY = addFormField(doc, 20, currentY, 'Persona Contacto', data.personaContacto, 140);
  currentY = addFormField(doc, 20, currentY, 'Lugar Inspección', data.lugarInspeccion, 140);
  currentY += 10;
  
  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Location and Schedule Section
  currentY = addSection(doc, 20, currentY, 'UBICACIÓN Y HORARIOS');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Población', data.poblacion, 'Provincia', data.provincia);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Hora Inicio', data.horaInicio, 'Hora Finalización', data.horaFinalizacion);
  currentY += 10;
  
  // Scope Section
  currentY = addSection(doc, 20, currentY, 'ALCANCE DE LA INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Alcance', data.alcanceInspeccion, 160, true);
  currentY += 10;
  
  // Product Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL PRODUCTO');
  currentY = addFormField(doc, 20, currentY, 'Mercancía Declarada', data.mercanciaDeclarada, 140);
  currentY = addTwoColumnFields(doc, 20, currentY, 'País Fabricación', data.paisFabricacion, 'Puerto Origen', data.puertoOrigen);
  currentY = addFormField(doc, 20, currentY, 'Puerto Destino', data.puertoDestino, 140);
  currentY += 10;
  
  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Packaging Section
  currentY = addSection(doc, 20, currentY, 'EMBALAJE Y DETALLES');
  currentY = addFormField(doc, 20, currentY, 'Embalaje Presentado', data.embalajePresentation, 160, true);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Producción', data.produccion, 'Caducidad', data.caducidad);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Tipo Bulto', data.tipoBulto, 'Cantidad', data.cantidad);
  currentY += 10;
  
  // Weight Section
  currentY = addSection(doc, 20, currentY, 'PESO');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Peso Neto', data.pesoNeto, 'Peso Bruto', data.pesoBruto);
  currentY += 10;
  
  // Additional Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN ADICIONAL');
  currentY = addFormField(doc, 20, currentY, 'Estiba', data.estiba, 160, true);
  currentY = addFormField(doc, 20, currentY, 'Otros', data.otros, 160, true);
  
  // Add signature areas
  currentY += 30;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma Inspector:', 20, currentY);
  doc.rect(20, currentY + 5, 60, 15);
  doc.text('Fecha:', 120, currentY);
  doc.rect(120, currentY + 5, 60, 15);
  
  const fileName = `Informe_Campo_${data.expedienteNova || 'Sin_Expediente'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateFinalInspectionPDF = (data: FinalInspectionPDFData) => {
  const doc = new jsPDF();
  let currentY = 25;
  
  // Header with border
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME FINAL DE INSPECCIÓN', 105, currentY, { align: 'center' });
  doc.rect(15, 15, 180, 15);
  currentY += 25;
  
  // Basic Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN BÁSICA');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Expediente NOVA', data.expedienteNova, 'Expediente Cliente', data.expedienteCliente);
  currentY = addFormField(doc, 20, currentY, 'Fecha Inspección', data.fechaInspeccion, 70);
  currentY += 10;
  
  // Inspection Details Section
  currentY = addSection(doc, 20, currentY, 'DETALLES DE INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Mercancía', data.mercancia, 140);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Número Contrato', data.numeroContrato, 'Nº Contenedores', data.numeroContenedores);
  currentY = addFormField(doc, 20, currentY, 'Tipo Contenedor', data.tipoContenedor, 140);
  currentY = addFormField(doc, 20, currentY, 'Numeración Contenedores', data.numeracionContenedores, 140);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Precintos NOVA', data.precintosNova, 'Precintos Naviera', data.precintosNaviera);
  currentY = addFormField(doc, 20, currentY, 'Puertos Origen/Destino', data.puertos, 140);
  currentY += 10;
  
  // Company Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DE EMPRESAS');
  currentY = addTwoColumnFields(doc, 20, currentY, 'Vendedor Empresa', data.vendedorEmpresa, 'Vendedor Contacto', data.vendedorContacto);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Comprador Empresa', data.compradorEmpresa, 'Comprador Contacto', data.compradorContacto);
  currentY = addFormField(doc, 20, currentY, 'Lugar Inspección', data.lugarInspeccion, 140);
  currentY += 10;
  
  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Findings Section
  currentY = addSection(doc, 20, currentY, 'HALLAZGOS');
  currentY = addFormField(doc, 20, currentY, 'Número Bultos', data.numeroBultos, 70);
  currentY = addFormField(doc, 20, currentY, 'Apertura Bultos', data.aperturaBultos, 160, true);
  currentY = addFormField(doc, 20, currentY, 'Pesaje Bultos', data.pesajeBultos, 70);
  currentY = addFormField(doc, 20, currentY, 'Detalle Pesos', data.detallePesos, 160, true);
  currentY = addFormField(doc, 20, currentY, 'Marcas Detalle', data.marcasDetalle, 160, true);
  currentY = addTwoColumnFields(doc, 20, currentY, 'Fecha Producción', data.fechaProduccionDetalle, 'Fecha Caducidad', data.fechaCaducidadDetalle);
  currentY = addFormField(doc, 20, currentY, 'Lotes Detalle', data.lotesDetalle, 160, true);
  currentY += 10;
  
  // Check if new page needed
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Final Sections
  currentY = addSection(doc, 20, currentY, 'DESCRIPCIÓN Y CONCLUSIONES');
  currentY = addFormField(doc, 20, currentY, 'Descripción Estiba', data.descripcionEstibaTexto, 160, true);
  currentY = addFormField(doc, 20, currentY, 'Otros Hallazgos', data.otrosHallazgos, 160, true);
  currentY = addFormField(doc, 20, currentY, 'Conclusiones', data.conclusiones, 160, true);
  currentY = addFormField(doc, 20, currentY, 'Anexos', data.anexos, 160, true);
  currentY = addFormField(doc, 20, currentY, 'Lugar y Fecha', data.lugarFecha, 140);
  
  // Add signature areas
  currentY += 30;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma Inspector:', 20, currentY);
  doc.rect(20, currentY + 5, 60, 15);
  doc.text('Fecha:', 120, currentY);
  doc.rect(120, currentY + 5, 60, 15);
  
  const fileName = `Informe_Final_${data.expedienteNova || 'Sin_Expediente'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};