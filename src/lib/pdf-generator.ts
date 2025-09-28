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

const addFormField = (doc: jsPDF, x: number, y: number, label: string, value: string, width: number = 80): number => {
  const fontSize = 9;
  const lineHeight = 6;
  
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(label + ':', x, y);
  
  doc.setFont('helvetica', 'normal');
  const valueText = value || '________________________________';
  const lines = doc.splitTextToSize(valueText, width);
  
  let currentY = y;
  lines.forEach((line: string, index: number) => {
    if (index === 0) {
      doc.text(line, x + label.length * 0.6 + 2, currentY);
    } else {
      currentY += lineHeight;
      doc.text(line, x, currentY);
    }
  });
  
  return currentY + lineHeight + 2;
};

const addSection = (doc: jsPDF, x: number, y: number, title: string): number => {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x, y);
  doc.line(x, y + 2, x + 180, y + 2);
  return y + 10;
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
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDEN DE TRABAJO', 105, currentY, { align: 'center' });
  currentY += 15;
  
  // Inspector Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL INSPECTOR');
  currentY = addFormField(doc, 20, currentY, 'Inspector', data.inspector);
  currentY = addFormField(doc, 20, currentY, 'Código Inspector', data.codigoInspector);
  currentY = addFormField(doc, 20, currentY, 'Móvil Inspector', data.movilInspector);
  currentY = addFormField(doc, 20, currentY, 'Coordinador', data.coordinador);
  currentY = addFormField(doc, 20, currentY, 'Móvil Coordinador', data.movilCoordinador);
  currentY += 5;
  
  // Expedition Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL EXPEDIENTE');
  currentY = addFormField(doc, 20, currentY, 'Expediente NOVA', data.expedienteNova);
  currentY = addFormField(doc, 20, currentY, 'País Destino', data.paisDestino);
  currentY = addFormField(doc, 20, currentY, 'Fecha Inspección', data.fechaInspeccion);
  currentY = addFormField(doc, 20, currentY, 'Hora Inspección', data.horaInspeccion);
  currentY = addFormField(doc, 20, currentY, 'Persona Contacto', data.personaContacto);
  currentY += 5;
  
  // Client Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL CLIENTE');
  currentY = addFormField(doc, 20, currentY, 'Expediente Cliente', data.expedienteCliente);
  currentY = addFormField(doc, 20, currentY, 'Exportador', data.exportador);
  currentY = addFormField(doc, 20, currentY, 'Importador', data.importador);
  currentY = addFormField(doc, 20, currentY, 'Número Contrato', data.numeroContrato);
  currentY = addFormField(doc, 20, currentY, 'Suplemento Contrato', data.suplementoContrato);
  currentY += 5;
  
  // Check if new page needed
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Location Info Section
  currentY = addSection(doc, 20, currentY, 'LUGAR DE INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Lugar Inspección', data.lugarInspeccion);
  currentY = addFormField(doc, 20, currentY, 'Dirección', data.direccion);
  currentY = addFormField(doc, 20, currentY, 'Código Postal', data.codigoPostal);
  currentY = addFormField(doc, 20, currentY, 'Población', data.poblacion);
  currentY = addFormField(doc, 20, currentY, 'Provincia', data.provincia);
  currentY = addFormField(doc, 20, currentY, 'Teléfono Contacto', data.telefonoContacto);
  currentY = addFormField(doc, 20, currentY, 'Otros Detalles Contacto', data.otrosDetallesContacto);
  currentY += 5;
  
  // Inspection Details Section
  currentY = addSection(doc, 20, currentY, 'DETALLES DE LA INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Cantidad/Tipo Contenedor', data.cantidadTipoContenedor);
  currentY = addFormField(doc, 20, currentY, 'Horarios Previstos Carga', data.horariosPrevisosCarga);
  currentY = addFormField(doc, 20, currentY, 'Descripción Mercancía', data.descripcionMercancia);
  currentY = addFormField(doc, 20, currentY, 'Puerto/Aeropuerto Origen', data.puertoAeropuertoOrigen);
  currentY = addFormField(doc, 20, currentY, 'Puerto/Aeropuerto Destino', data.puertoAeropuertoDestino);
  currentY = addFormField(doc, 20, currentY, 'Buque', data.buque);
  currentY += 5;
  
  // Check if new page needed
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Observations Section
  currentY = addSection(doc, 20, currentY, 'OBSERVACIONES');
  currentY = addFormField(doc, 20, currentY, 'Observaciones Finales', data.observacionesFinales, 160);
  currentY += 10;
  currentY = addFormField(doc, 20, currentY, 'Observaciones Especiales', data.observacionesEspeciales, 160);
  
  // Add signature areas
  currentY += 20;
  doc.setFontSize(10);
  doc.text('Firma Inspector: ____________________', 20, currentY);
  doc.text('Fecha: ____________________', 120, currentY);
  
  const fileName = `Orden_Trabajo_${data.expedienteNova || 'Sin_Expediente'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateFieldInspectionPDF = (data: FieldInspectionPDFData) => {
  const doc = new jsPDF();
  let currentY = 20;
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE CAMPO', 105, currentY, { align: 'center' });
  currentY += 15;
  
  // Basic Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN BÁSICA');
  currentY = addFormField(doc, 20, currentY, 'Expediente NOVA', data.expedienteNova);
  currentY = addFormField(doc, 20, currentY, 'Fecha', data.fecha);
  currentY = addFormField(doc, 20, currentY, 'Código Inspector', data.codigoInspector);
  currentY = addFormField(doc, 20, currentY, 'País Destino', data.paisDestino);
  currentY += 5;
  
  // Client Reference Section
  currentY = addSection(doc, 20, currentY, 'REFERENCIA DEL CLIENTE');
  currentY = addFormField(doc, 20, currentY, 'Referencia Cliente', data.referenciaCliente);
  currentY = addFormField(doc, 20, currentY, 'Número Contrato', data.numeroContrato);
  currentY += 5;
  
  // Container Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL CONTENEDOR');
  currentY = addFormField(doc, 20, currentY, 'Número Contenedor', data.numeroContenedor);
  currentY = addFormField(doc, 20, currentY, 'Tipo', data.tipoContenedor);
  currentY = addFormField(doc, 20, currentY, 'Tamaño', data.tamanoContenedor);
  currentY = addFormField(doc, 20, currentY, 'Precinto NOVA', data.precintoNova);
  currentY = addFormField(doc, 20, currentY, 'Precinto Naviera', data.precintoNaviera);
  currentY += 5;
  
  // Company Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DE EMPRESAS');
  currentY = addFormField(doc, 20, currentY, 'Exportador', data.exportador);
  currentY = addFormField(doc, 20, currentY, 'Proveedor', data.proveedor);
  currentY = addFormField(doc, 20, currentY, 'Persona Contacto', data.personaContacto);
  currentY = addFormField(doc, 20, currentY, 'Lugar Inspección', data.lugarInspeccion);
  currentY += 5;
  
  // Check if new page needed
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Location and Schedule Section
  currentY = addSection(doc, 20, currentY, 'UBICACIÓN Y HORARIOS');
  currentY = addFormField(doc, 20, currentY, 'Población', data.poblacion);
  currentY = addFormField(doc, 20, currentY, 'Provincia', data.provincia);
  currentY = addFormField(doc, 20, currentY, 'Hora Inicio', data.horaInicio);
  currentY = addFormField(doc, 20, currentY, 'Hora Finalización', data.horaFinalizacion);
  currentY += 5;
  
  // Scope Section
  currentY = addSection(doc, 20, currentY, 'ALCANCE DE LA INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Alcance', data.alcanceInspeccion, 160);
  currentY += 10;
  
  // Product Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DEL PRODUCTO');
  currentY = addFormField(doc, 20, currentY, 'Mercancía Declarada', data.mercanciaDeclarada);
  currentY = addFormField(doc, 20, currentY, 'País Fabricación', data.paisFabricacion);
  currentY = addFormField(doc, 20, currentY, 'Puerto Origen', data.puertoOrigen);
  currentY = addFormField(doc, 20, currentY, 'Puerto Destino', data.puertoDestino);
  currentY += 5;
  
  // Check if new page needed
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Packaging Section
  currentY = addSection(doc, 20, currentY, 'EMBALAJE Y DETALLES');
  currentY = addFormField(doc, 20, currentY, 'Embalaje Presentado', data.embalajePresentation, 160);
  currentY += 5;
  currentY = addFormField(doc, 20, currentY, 'Producción', data.produccion);
  currentY = addFormField(doc, 20, currentY, 'Caducidad', data.caducidad);
  currentY = addFormField(doc, 20, currentY, 'Tipo Bulto', data.tipoBulto);
  currentY = addFormField(doc, 20, currentY, 'Cantidad', data.cantidad);
  currentY += 5;
  
  // Weight Section
  currentY = addSection(doc, 20, currentY, 'PESO');
  currentY = addFormField(doc, 20, currentY, 'Peso Neto', data.pesoNeto);
  currentY = addFormField(doc, 20, currentY, 'Peso Bruto', data.pesoBruto);
  currentY += 5;
  
  // Additional Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN ADICIONAL');
  currentY = addFormField(doc, 20, currentY, 'Estiba', data.estiba, 160);
  currentY += 5;
  currentY = addFormField(doc, 20, currentY, 'Otros', data.otros, 160);
  
  // Add signature areas
  currentY += 20;
  doc.setFontSize(10);
  doc.text('Firma Inspector: ____________________', 20, currentY);
  doc.text('Fecha: ____________________', 120, currentY);
  
  const fileName = `Informe_Campo_${data.expedienteNova || 'Sin_Expediente'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateFinalInspectionPDF = (data: FinalInspectionPDFData) => {
  const doc = new jsPDF();
  let currentY = 20;
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME FINAL DE INSPECCIÓN', 105, currentY, { align: 'center' });
  currentY += 15;
  
  // Basic Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN BÁSICA');
  currentY = addFormField(doc, 20, currentY, 'Expediente NOVA', data.expedienteNova);
  currentY = addFormField(doc, 20, currentY, 'Expediente Cliente', data.expedienteCliente);
  currentY = addFormField(doc, 20, currentY, 'Fecha Inspección', data.fechaInspeccion);
  currentY += 5;
  
  // Inspection Details Section
  currentY = addSection(doc, 20, currentY, 'DETALLES DE INSPECCIÓN');
  currentY = addFormField(doc, 20, currentY, 'Mercancía', data.mercancia);
  currentY = addFormField(doc, 20, currentY, 'Número Contrato', data.numeroContrato);
  currentY = addFormField(doc, 20, currentY, 'Nº Contenedores', data.numeroContenedores);
  currentY = addFormField(doc, 20, currentY, 'Tipo Contenedor', data.tipoContenedor);
  currentY = addFormField(doc, 20, currentY, 'Numeración Contenedores', data.numeracionContenedores);
  currentY = addFormField(doc, 20, currentY, 'Precintos NOVA', data.precintosNova);
  currentY = addFormField(doc, 20, currentY, 'Precintos Naviera', data.precintosNaviera);
  currentY = addFormField(doc, 20, currentY, 'Puertos Origen/Destino', data.puertos);
  currentY += 5;
  
  // Company Info Section
  currentY = addSection(doc, 20, currentY, 'INFORMACIÓN DE EMPRESAS');
  currentY = addFormField(doc, 20, currentY, 'Vendedor Empresa', data.vendedorEmpresa);
  currentY = addFormField(doc, 20, currentY, 'Vendedor Contacto', data.vendedorContacto);
  currentY = addFormField(doc, 20, currentY, 'Comprador Empresa', data.compradorEmpresa);
  currentY = addFormField(doc, 20, currentY, 'Comprador Contacto', data.compradorContacto);
  currentY = addFormField(doc, 20, currentY, 'Lugar Inspección', data.lugarInspeccion);
  currentY += 5;
  
  // Check if new page needed
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Findings Section
  currentY = addSection(doc, 20, currentY, 'HALLAZGOS');
  currentY = addFormField(doc, 20, currentY, 'Número Bultos', data.numeroBultos);
  currentY = addFormField(doc, 20, currentY, 'Apertura Bultos', data.aperturaBultos, 160);
  currentY += 5;
  currentY = addFormField(doc, 20, currentY, 'Pesaje Bultos', data.pesajeBultos);
  currentY = addFormField(doc, 20, currentY, 'Detalle Pesos', data.detallePesos, 160);
  currentY += 5;
  currentY = addFormField(doc, 20, currentY, 'Marcas Detalle', data.marcasDetalle, 160);
  currentY += 5;
  currentY = addFormField(doc, 20, currentY, 'Fecha Producción', data.fechaProduccionDetalle);
  currentY = addFormField(doc, 20, currentY, 'Fecha Caducidad', data.fechaCaducidadDetalle);
  currentY = addFormField(doc, 20, currentY, 'Lotes Detalle', data.lotesDetalle, 160);
  currentY += 5;
  
  // Check if new page needed
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  // Final Sections
  currentY = addSection(doc, 20, currentY, 'DESCRIPCIÓN Y CONCLUSIONES');
  currentY = addFormField(doc, 20, currentY, 'Descripción Estiba', data.descripcionEstibaTexto, 160);
  currentY += 10;
  currentY = addFormField(doc, 20, currentY, 'Otros Hallazgos', data.otrosHallazgos, 160);
  currentY += 10;
  currentY = addFormField(doc, 20, currentY, 'Conclusiones', data.conclusiones, 160);
  currentY += 10;
  currentY = addFormField(doc, 20, currentY, 'Anexos', data.anexos, 160);
  currentY += 10;
  currentY = addFormField(doc, 20, currentY, 'Lugar y Fecha', data.lugarFecha);
  
  // Add signature areas
  currentY += 20;
  doc.setFontSize(10);
  doc.text('Firma Inspector: ____________________', 20, currentY);
  doc.text('Fecha: ____________________', 120, currentY);
  
  const fileName = `Informe_Final_${data.expedienteNova || 'Sin_Expediente'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};