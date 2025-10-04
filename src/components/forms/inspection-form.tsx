import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { VoiceInput } from '@/components/ui/voice-input';
import { PhotoInput } from '@/components/ui/photo-input';
import { ChevronLeft, ChevronRight, Save, FileText, Home, ArrowLeft, Download, FileJson, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateFinalInspectionPDF } from '@/lib/pdf-generator';
import { generateWordDocument } from '@/lib/doc-generator';
import { toast } from '@/hooks/use-toast';


interface InspectionData {
  // Basic Info
  expedienteNova: string;
  expedienteCliente: string;
  fechaInspeccion: string;
  
  // Inspection Details
  mercancia: string;
  numeroContrato: string;
  viaTransporte: { aerea: boolean; maritima: boolean };
  tipoCarga: { contenedor: boolean; cargaAgrupada: boolean };
  numeroContenedores: string;
  tipoContenedor: string;
  numeracionContenedores: string;
  precintosNova: string;
  precintosNaviera: string;
  puertos: string;
  
  // Seller
  vendedorEmpresa: string;
  vendedorContacto: string;
  vendedorDireccion: string;
  vendedorEmail: string;
  vendedorCodPostal: string;
  vendedorTelefono: string;
  vendedorPoblacion: string;
  vendedorMovil: string;
  
  // Buyer
  compradorEmpresa: string;
  compradorContacto: string;
  compradorDireccion: string;
  compradorEmail: string;
  compradorCodPostal: string;
  compradorTelefono: string;
  compradorPoblacion: string;
  compradorMovil: string;
  
  // Location
  lugarInspeccion: string;
  
  // Scope options with YES/NO/NA
  alcance: {
    revisionContenedor: 'yes' | 'no' | 'na' | '';
    conteoBultos: 'yes' | 'no' | 'na' | '';
    aperturaBultos: 'yes' | 'no' | 'na' | '';
    pesajeBultos: 'yes' | 'no' | 'na' | '';
    embalaje: 'yes' | 'no' | 'na' | '';
    paletsFumigados: 'yes' | 'no' | 'na' | '';
    marcas: 'yes' | 'no' | 'na' | '';
    descripcionEstiba: 'yes' | 'no' | 'na' | '';
    mercanciaTrincada: 'yes' | 'no' | 'na' | '';
    fechaProduccion: 'yes' | 'no' | 'na' | '';
    fechaCaducidad: 'yes' | 'no' | 'na' | '';
    lotes: 'yes' | 'no' | 'na' | '';
    certificadosCalidad: 'yes' | 'no' | 'na' | '';
    tomaMuestras: 'yes' | 'no' | 'na' | '';
    pruebasLaboratorio: 'yes' | 'no' | 'na' | '';
    pesajeContenedor: 'yes' | 'no' | 'na' | '';
    tiqueOficial: 'yes' | 'no' | 'na' | '';
    temperaturaAlmacenaje: 'yes' | 'no' | 'na' | '';
    temperaturaContenedor: 'yes' | 'no' | 'na' | '';
    precintadoContenedor: 'yes' | 'no' | 'na' | '';
    precintadoGrupaje: 'yes' | 'no' | 'na' | '';
    precintoSeguridad: 'yes' | 'no' | 'na' | '';
    informeCampo: 'yes' | 'no' | 'na' | '';
  };
  
  // Findings
  revisionContenedores: {
    limpios: boolean;
    libresOlores: boolean;
    sinAgujeros: boolean;
    sinOxido: boolean;
    cierrePuertas: boolean;
  };
  
  numeroBultos: string;
  bultosFotos: string[];
  aperturaBultos: string;
  pesajeBultos: string;
  detallePesos: string;
  
  // Packaging
  embalajeTipo: {
    huacal: boolean;
    bidon: boolean;
    caja: boolean;
    bandeja: boolean;
    atado: boolean;
    saco: boolean;
    rollo: boolean;
    otros: boolean;
  };
  
  embalajeMaterial: {
    carton: boolean;
    madera: boolean;
    plastico: boolean;
    metalico: boolean;
    papel: boolean;
    kraft: boolean;
    otro: boolean;
  };
  
  embalajePresentation: {
    paletizado: boolean;
    retractilado: boolean;
    flejado: boolean;
    granel: boolean;
  };
  
  marcasDetalle: string;
  marcasFotos: string[];
  senalesInternacionales: boolean;
  fechaProduccionDetalle: string;
  fechaCaducidadDetalle: string;
  lotesDetalle: string;
  certificadosDetalle: string;
  tomaMuestrasDetalle: string;
  pruebasLaboratorioDetalle: string;
  pesajeContenedorDetalle: string;
  tiqueOficialDetalle: string;
  temperaturaContenedorDetalle: string;
  precintadoContenedorDetalle: string;
  precintadoFotos: string[];
  precintoSeguridadDetalle: string;
  
  // Final sections
  descripcionEstibaTexto: string;
  otrosHallazgos: string;
  conclusiones: string;
  anexos: string;
  lugarFecha: string;
}

const initialData: InspectionData = {
  expedienteNova: '',
  expedienteCliente: '',
  fechaInspeccion: new Date().toISOString().split('T')[0],
  mercancia: '',
  numeroContrato: '',
  viaTransporte: { aerea: false, maritima: false },
  tipoCarga: { contenedor: false, cargaAgrupada: false },
  numeroContenedores: '',
  tipoContenedor: '',
  numeracionContenedores: '',
  precintosNova: '',
  precintosNaviera: '',
  puertos: '',
  vendedorEmpresa: '',
  vendedorContacto: '',
  vendedorDireccion: '',
  vendedorEmail: '',
  vendedorCodPostal: '',
  vendedorTelefono: '',
  vendedorPoblacion: '',
  vendedorMovil: '',
  compradorEmpresa: '',
  compradorContacto: '',
  compradorDireccion: '',
  compradorEmail: '',
  compradorCodPostal: '',
  compradorTelefono: '',
  compradorPoblacion: '',
  compradorMovil: '',
  lugarInspeccion: '',
  alcance: {
    revisionContenedor: '',
    conteoBultos: '',
    aperturaBultos: '',
    pesajeBultos: '',
    embalaje: '',
    paletsFumigados: '',
    marcas: '',
    descripcionEstiba: '',
    mercanciaTrincada: '',
    fechaProduccion: '',
    fechaCaducidad: '',
    lotes: '',
    certificadosCalidad: '',
    tomaMuestras: '',
    pruebasLaboratorio: '',
    pesajeContenedor: '',
    tiqueOficial: '',
    temperaturaAlmacenaje: '',
    temperaturaContenedor: '',
    precintadoContenedor: '',
    precintadoGrupaje: '',
    precintoSeguridad: '',
    informeCampo: '',
  },
  revisionContenedores: {
    limpios: false,
    libresOlores: false,
    sinAgujeros: false,
    sinOxido: false,
    cierrePuertas: false,
  },
  numeroBultos: '',
  bultosFotos: [],
  aperturaBultos: '',
  pesajeBultos: '',
  detallePesos: '',
  embalajeTipo: {
    huacal: false,
    bidon: false,
    caja: false,
    bandeja: false,
    atado: false,
    saco: false,
    rollo: false,
    otros: false,
  },
  embalajeMaterial: {
    carton: false,
    madera: false,
    plastico: false,
    metalico: false,
    papel: false,
    kraft: false,
    otro: false,
  },
  embalajePresentation: {
    paletizado: false,
    retractilado: false,
    flejado: false,
    granel: false,
  },
  marcasDetalle: '',
  marcasFotos: [],
  senalesInternacionales: false,
  fechaProduccionDetalle: '',
  fechaCaducidadDetalle: '',
  lotesDetalle: '',
  certificadosDetalle: '',
  tomaMuestrasDetalle: '',
  pruebasLaboratorioDetalle: '',
  pesajeContenedorDetalle: '',
  tiqueOficialDetalle: '',
  temperaturaContenedorDetalle: '',
  precintadoContenedorDetalle: '',
  precintadoFotos: [],
  precintoSeguridadDetalle: '',
  descripcionEstibaTexto: '',
  otrosHallazgos: '',
  conclusiones: '',
  anexos: '',
  lugarFecha: '',
};

export const InspectionForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [data, setData] = useState<InspectionData>(initialData);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const importFromFieldReport = () => {
    const fieldReportData = localStorage.getItem('fieldInspectionData');
    if (fieldReportData) {
      const fieldReport = JSON.parse(fieldReportData);
      setData(prev => ({
        ...prev,
        expedienteNova: fieldReport.expedienteNova || prev.expedienteNova,
        expedienteCliente: fieldReport.referenciaCliente || prev.expedienteCliente,
        fechaInspeccion: fieldReport.fecha || prev.fechaInspeccion,
        numeroContrato: fieldReport.numeroContrato || prev.numeroContrato,
        numeroContenedores: fieldReport.numeroContenedor || prev.numeroContenedores,
        tipoContenedor: fieldReport.tipoContenedor || prev.tipoContenedor,
        numeracionContenedores: fieldReport.numeroContenedor || prev.numeracionContenedores,
        precintosNova: fieldReport.precintoNova || prev.precintosNova,
        precintosNaviera: fieldReport.precintoNaviera || prev.precintosNaviera,
        vendedorEmpresa: fieldReport.exportador || prev.vendedorEmpresa,
        vendedorContacto: fieldReport.personaContacto || prev.vendedorContacto,
        lugarInspeccion: fieldReport.lugarInspeccion || prev.lugarInspeccion,
      }));
      setShowImportOptions(false);
    }
  };

  const buildJSONData = () => {
    // Map embalaje types to array
    const embalajeTypes: string[] = [];
    if (data.embalajeTipo.huacal) embalajeTypes.push('Huacal');
    if (data.embalajeTipo.bidon) embalajeTypes.push('Bidón');
    if (data.embalajeTipo.caja) embalajeTypes.push('Caja');
    if (data.embalajeTipo.bandeja) embalajeTypes.push('Bandeja');
    if (data.embalajeTipo.atado) embalajeTypes.push('Atado');
    if (data.embalajeTipo.saco) embalajeTypes.push('Saco');
    if (data.embalajeTipo.rollo) embalajeTypes.push('Rollo');
    if (data.embalajeTipo.otros) embalajeTypes.push('Otros');

    // Map embalaje materials to array
    const embalajeMaterials: string[] = [];
    if (data.embalajeMaterial.carton) embalajeMaterials.push('Cartón');
    if (data.embalajeMaterial.madera) embalajeMaterials.push('Madera');
    if (data.embalajeMaterial.plastico) embalajeMaterials.push('Plástico');
    if (data.embalajeMaterial.metalico) embalajeMaterials.push('Metálico');
    if (data.embalajeMaterial.papel) embalajeMaterials.push('Papel');
    if (data.embalajeMaterial.kraft) embalajeMaterials.push('Kraft');
    if (data.embalajeMaterial.otro) embalajeMaterials.push('Otro');

    // Map embalaje presentation to array
    const embalajePresentation: string[] = [];
    if (data.embalajePresentation.paletizado) embalajePresentation.push('Paletizado');
    if (data.embalajePresentation.retractilado) embalajePresentation.push('Retractilado');
    if (data.embalajePresentation.flejado) embalajePresentation.push('Flejado');
    if (data.embalajePresentation.granel) embalajePresentation.push('Granel');

    // Get via transporte
    const viaTransporte = data.viaTransporte.aerea ? 'Aérea' : data.viaTransporte.maritima ? 'Marítima' : '';
    
    // Get tipo carga
    const tipoCarga = data.tipoCarga.contenedor ? 'Contenedor' : data.tipoCarga.cargaAgrupada ? 'Carga Agrupada' : '';

    // Map photos
    const fotosMercancia = data.bultosFotos.map((path, index) => ({ 
      path, 
      titulo: `Foto Mercancía ${index + 1}` 
    }));
    const fotosMarcas = data.marcasFotos.map((path, index) => ({ 
      path, 
      titulo: `Foto Marcas ${index + 1}` 
    }));
    const fotosPrecintado = data.precintadoFotos.map((path, index) => ({ 
      path, 
      titulo: `Foto Precintado ${index + 1}` 
    }));

    return {
      expediente_nova: data.expedienteNova,
      expediente_cliente: data.expedienteCliente,
      fecha_inspeccion: data.fechaInspeccion,
      mercancia_declarada: data.mercancia,
      numero_contrato: data.numeroContrato,
      via_transporte: viaTransporte,
      tipo_carga: tipoCarga,
      num_con: data.numeroContenedores,
      t_con: data.tipoContenedor,
      numer_con: data.numeracionContenedores,
      pre_nova: data.precintosNova,
      pre_naviera: data.precintosNaviera,
      ori_dest: data.puertos,

      vendedor_empresa: data.vendedorEmpresa,
      vendedor_contacto: data.vendedorContacto,
      vendedor_direccion: data.vendedorDireccion,
      vendedor_email: data.vendedorEmail,
      vendedor_cp: data.vendedorCodPostal,
      vendedor_telefono_fijo: data.vendedorTelefono,
      vendedor_poblacion: data.vendedorPoblacion,
      vendedor_telefono_movil: data.vendedorMovil,

      comprador_empresa: data.compradorEmpresa,
      comprador_contacto: data.compradorContacto,
      comprador_direccion: data.compradorDireccion,
      comprador_email: data.compradorEmail,
      comprador_cp: data.compradorCodPostal,
      comprador_telefono_fijo: data.compradorTelefono,
      comprador_poblacion: data.compradorPoblacion,
      comprador_telefono_movil: data.compradorMovil,

      lugar_inspeccion: data.lugarInspeccion,

      alcance_inspeccion: {
        revision_contenedor: data.alcance.revisionContenedor,
        conteo_bultos: data.alcance.conteoBultos,
        apertura_bultos: data.alcance.aperturaBultos,
        pesaje_bultos: data.alcance.pesajeBultos,
        embalaje: data.alcance.embalaje,
        palets_fumigados: data.alcance.paletsFumigados,
        marcas: data.alcance.marcas,
        descripcion_estiba: data.alcance.descripcionEstiba,
        mercancia_trincada: data.alcance.mercanciaTrincada,
        fecha_produccion_chk: data.alcance.fechaProduccion,
        fecha_caducidad_chk: data.alcance.fechaCaducidad,
        lotes_chk: data.alcance.lotes,
        certificados_chk: data.alcance.certificadosCalidad,
        toma_muestras: data.alcance.tomaMuestras,
        pruebas_laboratorio: data.alcance.pruebasLaboratorio,
        pesaje_contenedor_chk: data.alcance.pesajeContenedor,
        tique_pesaje_chk: data.alcance.tiqueOficial,
        temp_almacenaje_chk: data.alcance.temperaturaAlmacenaje,
        temp_contenedor_chk: data.alcance.temperaturaContenedor,
        precintado_chk: data.alcance.precintadoContenedor,
        precintado_grupaje_chk: data.alcance.precintadoGrupaje,
        precinto_barra_chk: data.alcance.precintoSeguridad,
        informe_campo_chk: data.alcance.informeCampo
      },

      hallazgos_contenedores: {
        limpios: data.revisionContenedores.limpios ? 'Sí' : 'No',
        libres_olores: data.revisionContenedores.libresOlores ? 'Sí' : 'No',
        sin_agujeros_filtrado_luz: data.revisionContenedores.sinAgujeros ? 'Sí' : 'No',
        sin_oxido_relevante: data.revisionContenedores.sinOxido ? 'Sí' : 'No',
        cierre_puertas_correcto: data.revisionContenedores.cierrePuertas ? 'Sí' : 'No'
      },

      numero_bultos_totales: data.numeroBultos,
      apertura_bultos_resultado: data.aperturaBultos,
      pesaje_bultos_resultado: data.pesajeBultos,
      detalle_pesos: data.detallePesos,

      embalaje: {
        tipo: embalajeTypes,
        material: embalajeMaterials,
        presentado: embalajePresentation
      },

      marcas_resultado: data.marcasDetalle,
      senales_internacionales: data.senalesInternacionales ? 'Sí' : 'No',
      fecha_produccion_valor: data.fechaProduccionDetalle,
      fecha_caducidad_valor: data.fechaCaducidadDetalle,
      lotes_valor: data.lotesDetalle,
      certificados_calidad: data.certificadosDetalle,
      toma_muestras_resultado: data.tomaMuestrasDetalle,
      pruebas_laboratorio_resultado: data.pruebasLaboratorioDetalle,
      pesaje_contenedor_resultado: data.pesajeContenedorDetalle,
      tique_pesaje_resultado: data.tiqueOficialDetalle,
      temp_contenedor_valor: data.temperaturaContenedorDetalle,
      precintado_resultado: data.precintadoContenedorDetalle,
      precinto_barra_resultado: data.precintoSeguridadDetalle,

      descripcion_estiba_texto: data.descripcionEstibaTexto,
      otros_hallazgos: data.otrosHallazgos,
      peso_neto: '',
      peso_bruto: '',

      conclusiones: data.conclusiones,

      lugar_firma: data.lugarFecha,
      fecha_firma: data.fechaInspeccion,

      fotos: {
        mercancia: fotosMercancia,
        marcas: fotosMarcas,
        carga_contenedor: fotosPrecintado,
        generales: []
      },

      foto_mercancia: data.bultosFotos[0] || '',
      foto_marcas: data.marcasFotos[0] || '',
      foto_contenedor: data.precintadoFotos[0] || '',
      foto_control_carga: ''
    };
  };

  const exportToJSON = () => {
    const jsonData = buildJSONData();
    
    // Create and download JSON file
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Informe_Final_${data.expedienteNova || 'NOVA'}_${data.fechaInspeccion}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleJSONUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Map JSON data back to form state
        setData({
          expedienteNova: jsonData.expediente_nova || '',
          expedienteCliente: jsonData.expediente_cliente || '',
          fechaInspeccion: jsonData.fecha_inspeccion || new Date().toISOString().split('T')[0],
          mercancia: jsonData.mercancia_declarada || '',
          numeroContrato: jsonData.numero_contrato || '',
          viaTransporte: {
            aerea: jsonData.via_transporte === 'Aérea',
            maritima: jsonData.via_transporte === 'Marítima'
          },
          tipoCarga: {
            contenedor: jsonData.tipo_carga === 'Contenedor',
            cargaAgrupada: jsonData.tipo_carga === 'Carga Agrupada'
          },
          numeroContenedores: jsonData.numero_contenedores || '',
          tipoContenedor: jsonData.tipo_contenedor || '',
          numeracionContenedores: jsonData.numeracion_contenedores || '',
          precintosNova: jsonData.precintos_nova || '',
          precintosNaviera: jsonData.precintos_naviera || '',
          puertos: jsonData.puertos_origen_destino || '',
          
          vendedorEmpresa: jsonData.vendedor_empresa || '',
          vendedorContacto: jsonData.vendedor_contacto || '',
          vendedorDireccion: jsonData.vendedor_direccion || '',
          vendedorEmail: jsonData.vendedor_email || '',
          vendedorCodPostal: jsonData.vendedor_cp || '',
          vendedorTelefono: jsonData.vendedor_telefono_fijo || '',
          vendedorPoblacion: jsonData.vendedor_poblacion || '',
          vendedorMovil: jsonData.vendedor_telefono_movil || '',
          
          compradorEmpresa: jsonData.comprador_empresa || '',
          compradorContacto: jsonData.comprador_contacto || '',
          compradorDireccion: jsonData.comprador_direccion || '',
          compradorEmail: jsonData.comprador_email || '',
          compradorCodPostal: jsonData.comprador_cp || '',
          compradorTelefono: jsonData.comprador_telefono_fijo || '',
          compradorPoblacion: jsonData.comprador_poblacion || '',
          compradorMovil: jsonData.comprador_telefono_movil || '',
          
          lugarInspeccion: jsonData.lugar_inspeccion || '',
          
          alcance: {
            revisionContenedor: jsonData.alcance_inspeccion?.revision_contenedor || '',
            conteoBultos: jsonData.alcance_inspeccion?.conteo_bultos || '',
            aperturaBultos: jsonData.alcance_inspeccion?.apertura_bultos || '',
            pesajeBultos: jsonData.alcance_inspeccion?.pesaje_bultos || '',
            embalaje: jsonData.alcance_inspeccion?.embalaje || '',
            paletsFumigados: jsonData.alcance_inspeccion?.palets_fumigados || '',
            marcas: jsonData.alcance_inspeccion?.marcas || '',
            descripcionEstiba: jsonData.alcance_inspeccion?.descripcion_estiba || '',
            mercanciaTrincada: jsonData.alcance_inspeccion?.mercancia_trincada || '',
            fechaProduccion: jsonData.alcance_inspeccion?.fecha_produccion_chk || '',
            fechaCaducidad: jsonData.alcance_inspeccion?.fecha_caducidad_chk || '',
            lotes: jsonData.alcance_inspeccion?.lotes_chk || '',
            certificadosCalidad: jsonData.alcance_inspeccion?.certificados_chk || '',
            tomaMuestras: jsonData.alcance_inspeccion?.toma_muestras || '',
            pruebasLaboratorio: jsonData.alcance_inspeccion?.pruebas_laboratorio || '',
            pesajeContenedor: jsonData.alcance_inspeccion?.pesaje_contenedor_chk || '',
            tiqueOficial: jsonData.alcance_inspeccion?.tique_pesaje_chk || '',
            temperaturaAlmacenaje: jsonData.alcance_inspeccion?.temp_almacenaje_chk || '',
            temperaturaContenedor: jsonData.alcance_inspeccion?.temp_contenedor_chk || '',
            precintadoContenedor: jsonData.alcance_inspeccion?.precintado_chk || '',
            precintadoGrupaje: jsonData.alcance_inspeccion?.precintado_grupaje_chk || '',
            precintoSeguridad: jsonData.alcance_inspeccion?.precinto_barra_chk || '',
            informeCampo: jsonData.alcance_inspeccion?.informe_campo_chk || '',
          },
          
          revisionContenedores: {
            limpios: jsonData.hallazgos_contenedores?.limpios === 'Sí',
            libresOlores: jsonData.hallazgos_contenedores?.libres_olores === 'Sí',
            sinAgujeros: jsonData.hallazgos_contenedores?.sin_agujeros_filtrado_luz === 'Sí',
            sinOxido: jsonData.hallazgos_contenedores?.sin_oxido_relevante === 'Sí',
            cierrePuertas: jsonData.hallazgos_contenedores?.cierre_puertas_correcto === 'Sí',
          },
          
          numeroBultos: jsonData.numero_bultos_totales || '',
          bultosFotos: jsonData.fotos?.mercancia?.map((f: any) => f.path) || [],
          aperturaBultos: jsonData.apertura_bultos_resultado || '',
          pesajeBultos: jsonData.pesaje_bultos_resultado || '',
          detallePesos: jsonData.detalle_pesos || '',
          
          embalajeTipo: {
            huacal: jsonData.embalaje?.tipo?.includes('Huacal') || false,
            bidon: jsonData.embalaje?.tipo?.includes('Bidón') || false,
            caja: jsonData.embalaje?.tipo?.includes('Caja') || false,
            bandeja: jsonData.embalaje?.tipo?.includes('Bandeja') || false,
            atado: jsonData.embalaje?.tipo?.includes('Atado') || false,
            saco: jsonData.embalaje?.tipo?.includes('Saco') || false,
            rollo: jsonData.embalaje?.tipo?.includes('Rollo') || false,
            otros: jsonData.embalaje?.tipo?.includes('Otros') || false,
          },
          
          embalajeMaterial: {
            carton: jsonData.embalaje?.material?.includes('Cartón') || false,
            madera: jsonData.embalaje?.material?.includes('Madera') || false,
            plastico: jsonData.embalaje?.material?.includes('Plástico') || false,
            metalico: jsonData.embalaje?.material?.includes('Metálico') || false,
            papel: jsonData.embalaje?.material?.includes('Papel') || false,
            kraft: jsonData.embalaje?.material?.includes('Kraft') || false,
            otro: jsonData.embalaje?.material?.includes('Otro') || false,
          },
          
          embalajePresentation: {
            paletizado: jsonData.embalaje?.presentado?.includes('Paletizado') || false,
            retractilado: jsonData.embalaje?.presentado?.includes('Retractilado') || false,
            flejado: jsonData.embalaje?.presentado?.includes('Flejado') || false,
            granel: jsonData.embalaje?.presentado?.includes('Granel') || false,
          },
          
          marcasDetalle: jsonData.marcas_resultado || '',
          marcasFotos: jsonData.fotos?.marcas?.map((f: any) => f.path) || [],
          senalesInternacionales: jsonData.senales_internacionales === 'Sí',
          fechaProduccionDetalle: jsonData.fecha_produccion_valor || '',
          fechaCaducidadDetalle: jsonData.fecha_caducidad_valor || '',
          lotesDetalle: jsonData.lotes_valor || '',
          certificadosDetalle: jsonData.certificados_calidad || '',
          tomaMuestrasDetalle: jsonData.toma_muestras_resultado || '',
          pruebasLaboratorioDetalle: jsonData.pruebas_laboratorio_resultado || '',
          pesajeContenedorDetalle: jsonData.pesaje_contenedor_resultado || '',
          tiqueOficialDetalle: jsonData.tique_pesaje_resultado || '',
          temperaturaContenedorDetalle: jsonData.temp_contenedor_valor || '',
          precintadoContenedorDetalle: jsonData.precintado_resultado || '',
          precintadoFotos: jsonData.fotos?.carga_contenedor?.map((f: any) => f.path) || [],
          precintoSeguridadDetalle: jsonData.precinto_barra_resultado || '',
          
          descripcionEstibaTexto: jsonData.descripcion_estiba_texto || '',
          otrosHallazgos: jsonData.otros_hallazgos || '',
          conclusiones: jsonData.conclusiones || '',
          anexos: '',
          lugarFecha: jsonData.lugar_firma || '',
        });
        
        toast({
          title: "JSON importado",
          description: "Los datos se han cargado correctamente en el formulario",
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast({
          title: "Error",
          description: "El archivo JSON no tiene el formato correcto",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    // Reset input
    if (jsonInputRef.current) {
      jsonInputRef.current.value = '';
    }
  };

  const generateWordDoc = async () => {
    // guardamos el id del toast de carga para cerrarlo luego
    let loadingToastId: string | number | undefined;
  
    try {
      console.group('[UI] Generar Word');
      console.time('[UI] Temps total');
  
      console.log('[UI] 1) Mostrant toast inicial');
      const loading = toast({
        title: 'Generando documento',
        description: 'Por favor espera mientras se genera el documento Word...',
        duration: 10000, // que se cierre solo si algo tarda/fracasa
      });
      loadingToastId = (loading as any)?.id;
  
      console.log('[UI] 2) buildJSONData()');
      const jsonData = buildJSONData();
      console.log('[UI] JSON keys:', Object.keys(jsonData || {}).length);
      console.log('[UI] mercancia_declarada:', jsonData?.mercancia_declarada);
  
      console.log('[UI] 3) Cridant generateWordDocument()');
      console.time('[UI] generateWordDocument');
      const blob = await generateWordDocument(jsonData);
      console.timeEnd('[UI] generateWordDocument');
      console.log('[UI] Blob creat?', !!blob, 'mida:', blob?.size);
  
      if (!blob || !(blob instanceof Blob) || blob.size === 0) {
        throw new Error('Blob vacío o inválido');
      }
  
      console.log('[UI] 4) Preparant descàrrega');
      const url = URL.createObjectURL(blob);
  
      // intento 1: <a>.click()
      const link = document.createElement('a');
      link.href = url;
      link.download = `Informe_Inspeccion_${data.expedienteNova || 'NOVA'}_${data.fechaInspeccion}.docx`;
      link.rel = 'noopener';
      link.target = '_blank'; // ayuda en Safari
      document.body.appendChild(link);
  
      try {
        link.click();
        console.log('[UI] Descàrrega llançada amb <a>.click() ✅');
      } catch (e) {
        console.warn('[UI] <a>.click() ha fallat, provant window.open', e);
        // intento 2: window.open (fallback Safari/iOS)
        const w = window.open(url, '_blank');
        if (!w) {
          console.warn('[UI] window.open bloqueado por el navegador.');
          // intento 3: mostramos un toast con enlace manual
          toast({
            title: 'Descarga bloqueada',
            description:
              'Tu navegador ha bloqueado la descarga automática. Haz clic aquí para descargar el archivo.',
            action: (
              <a
                href={url}
                download={`Informe_Inspeccion_${data.expedienteNova || 'NOVA'}_${data.fechaInspeccion}.docx`}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                Descargar ahora
              </a>
            ) as any,
          });
        }
      } finally {
        // revocar con un pequeño retardo para evitar cancelaciones tempranas
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
          console.log('[UI] URL revocada i <a> eliminat ✅');
        }, 1500);
      }
  
      // cerramos el toast de carga si aún sigue
      if (loadingToastId !== undefined && (toast as any)?.dismiss) {
        (toast as any).dismiss(loadingToastId);
      }
  
      console.log('[UI] 5) Mostrant toast final');
      toast({
        title: 'Documento generado',
        description: 'El documento Word se ha descargado correctamente',
      });
  
      console.timeEnd('[UI] Temps total');
      console.groupEnd();
    } catch (error) {
      console.error('[UI] ❌ Error generateWordDoc:', error);
  
      // cerrar el toast de carga si se quedó abierto
      if (loadingToastId !== undefined && (toast as any)?.dismiss) {
        (toast as any).dismiss(loadingToastId);
      }
  
      toast({
        title: 'Error',
        description: 'No se pudo generar el documento Word',
        variant: 'destructive',
      });
  
      console.groupEnd?.();
    }
  };

  const updateNestedField = (parent: keyof InspectionData, field: string, value: any) => {
    setData(prev => {
      const parentObject = prev[parent];
      if (typeof parentObject === 'object' && parentObject !== null && !Array.isArray(parentObject)) {
        return {
          ...prev,
          [parent]: { ...parentObject, [field]: value }
        };
      }
      return prev;
    });
  };

  const handleVoiceInput = (field: string, transcript: string) => {
    updateField(field, transcript);
  };

  const steps = [
    {
      title: "Información Básica",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expedienteNova">Expediente NOVA</Label>
            <div className="flex gap-2">
              <Input
                id="expedienteNova"
                value={data.expedienteNova}
                onChange={(e) => updateField('expedienteNova', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expedienteCliente">Expediente Cliente</Label>
            <div className="flex gap-2">
              <Input
                id="expedienteCliente"
              value={data.expedienteCliente}
              onChange={(e) => updateField('expedienteCliente', e.target.value)}
            />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fechaInspeccion">Fecha de Inspección</Label>
            <Input
              id="fechaInspeccion"
              type="date"
              value={data.fechaInspeccion}
              onChange={(e) => updateField('fechaInspeccion', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Detalles de Inspección",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mercancia">Mercancía Declarada</Label>
            <div className="flex gap-2">
              <Input
                id="mercancia"
                value={data.mercancia}
                onChange={(e) => updateField('mercancia', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numeroContrato">Número de Contrato</Label>
            <div className="flex gap-2">
              <Input
                id="numeroContrato"
              value={data.numeroContrato}
              onChange={(e) => updateField('numeroContrato', e.target.value)}
            />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Vía de Transporte</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aerea"
                  checked={data.viaTransporte.aerea}
                  onCheckedChange={(checked) => updateNestedField('viaTransporte', 'aerea', checked)}
                />
                <Label htmlFor="aerea">Aérea</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maritima"
                  checked={data.viaTransporte.maritima}
                  onCheckedChange={(checked) => updateNestedField('viaTransporte', 'maritima', checked)}
                />
                <Label htmlFor="maritima">Marítima</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Tipo de Carga</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contenedor"
                  checked={data.tipoCarga.contenedor}
                  onCheckedChange={(checked) => updateNestedField('tipoCarga', 'contenedor', checked)}
                />
                <Label htmlFor="contenedor">Contenedor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cargaAgrupada"
                  checked={data.tipoCarga.cargaAgrupada}
                  onCheckedChange={(checked) => updateNestedField('tipoCarga', 'cargaAgrupada', checked)}
                />
                <Label htmlFor="cargaAgrupada">Carga Agrupada</Label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroContenedores">Nº Contenedores</Label>
              <Input
                id="numeroContenedores"
                value={data.numeroContenedores}
                onChange={(e) => updateField('numeroContenedores', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoContenedor">Tipo Contenedor</Label>
              <Input
                id="tipoContenedor"
                value={data.tipoContenedor}
                onChange={(e) => updateField('tipoContenedor', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numeracionContenedores">Numeración de Contenedores</Label>
            <div className="flex gap-2">
              <Input
                id="numeracionContenedores"
                value={data.numeracionContenedores}
                onChange={(e) => updateField('numeracionContenedores', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precintosNova">Precintos NOVA</Label>
              <Input
                id="precintosNova"
                value={data.precintosNova}
                onChange={(e) => updateField('precintosNova', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precintosNaviera">Precintos Naviera</Label>
              <Input
                id="precintosNaviera"
                value={data.precintosNaviera}
                onChange={(e) => updateField('precintosNaviera', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="puertos">Puertos Origen/Destino</Label>
            <div className="flex gap-2">
              <Input
                id="puertos"
                value={data.puertos}
                onChange={(e) => updateField('puertos', e.target.value)}
              />
              
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Información del Vendedor",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendedorEmpresa">Empresa</Label>
            <div className="flex gap-2">
              <Input
                id="vendedorEmpresa"
                value={data.vendedorEmpresa}
                onChange={(e) => updateField('vendedorEmpresa', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vendedorContacto">Persona de Contacto</Label>
            <div className="flex gap-2">
              <Input
                id="vendedorContacto"
                value={data.vendedorContacto}
                onChange={(e) => updateField('vendedorContacto', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vendedorDireccion">Dirección</Label>
            <div className="flex gap-2">
              <Input
                id="vendedorDireccion"
                value={data.vendedorDireccion}
                onChange={(e) => updateField('vendedorDireccion', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendedorEmail">Email</Label>
              <Input
                id="vendedorEmail"
                type="email"
                value={data.vendedorEmail}
                onChange={(e) => updateField('vendedorEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendedorCodPostal">Código Postal</Label>
              <Input
                id="vendedorCodPostal"
                value={data.vendedorCodPostal}
                onChange={(e) => updateField('vendedorCodPostal', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vendedorPoblacion">Población</Label>
            <div className="flex gap-2">
              <Input
                id="vendedorPoblacion"
                value={data.vendedorPoblacion}
                onChange={(e) => updateField('vendedorPoblacion', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendedorTelefono">Teléfono Fijo</Label>
              <Input
                id="vendedorTelefono"
                type="tel"
                value={data.vendedorTelefono}
                onChange={(e) => updateField('vendedorTelefono', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendedorMovil">Teléfono Móvil</Label>
              <Input
                id="vendedorMovil"
                type="tel"
                value={data.vendedorMovil}
                onChange={(e) => updateField('vendedorMovil', e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Información del Comprador",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="compradorEmpresa">Empresa</Label>
            <div className="flex gap-2">
              <Input
                id="compradorEmpresa"
                value={data.compradorEmpresa}
                onChange={(e) => updateField('compradorEmpresa', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="compradorContacto">Persona de Contacto</Label>
            <div className="flex gap-2">
              <Input
                id="compradorContacto"
              value={data.compradorContacto}
              onChange={(e) => updateField('compradorContacto', e.target.value)}
            />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="compradorDireccion">Dirección</Label>
            <div className="flex gap-2">
              <Input
                id="compradorDireccion"
                value={data.compradorDireccion}
                onChange={(e) => updateField('compradorDireccion', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="compradorEmail">Email</Label>
              <Input
                id="compradorEmail"
                type="email"
                value={data.compradorEmail}
                onChange={(e) => updateField('compradorEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compradorCodPostal">Código Postal</Label>
              <Input
                id="compradorCodPostal"
                value={data.compradorCodPostal}
                onChange={(e) => updateField('compradorCodPostal', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="compradorPoblacion">Población</Label>
            <div className="flex gap-2">
              <Input
                id="compradorPoblacion"
                value={data.compradorPoblacion}
                onChange={(e) => updateField('compradorPoblacion', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="compradorTelefono">Teléfono Fijo</Label>
              <Input
                id="compradorTelefono"
                type="tel"
                value={data.compradorTelefono}
                onChange={(e) => updateField('compradorTelefono', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compradorMovil">Teléfono Móvil</Label>
              <Input
                id="compradorMovil"
                type="tel"
                value={data.compradorMovil}
                onChange={(e) => updateField('compradorMovil', e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Lugar de Inspección",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lugarInspeccion">Lugar de Inspección</Label>
            <div className="flex gap-2">
              <Input
                id="lugarInspeccion"
                value={data.lugarInspeccion}
                onChange={(e) => updateField('lugarInspeccion', e.target.value)}
              />
              
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Alcance de Inspección",
      component: (
        <div className="space-y-4">
          <Label className="text-base font-semibold">Marque las inspecciones a realizar:</Label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: 'revisionContenedor', label: 'Revisión del estado del contenedor' },
              { key: 'conteoBultos', label: 'Conteo de bultos' },
              { key: 'aperturaBultos', label: 'Apertura de bultos' },
              { key: 'pesajeBultos', label: 'Pesaje de bultos' },
              { key: 'embalaje', label: 'Embalaje' },
              { key: 'paletsFumigados', label: 'Palets fumigados' },
              { key: 'marcas', label: 'Marcas' },
              { key: 'descripcionEstiba', label: 'Descripción de estiba' },
              { key: 'mercanciaTrincada', label: 'Indicar si la mercancía se trinca al contenedor' },
              { key: 'fechaProduccion', label: 'Fecha de producción' },
              { key: 'fechaCaducidad', label: 'Fecha de caducidad' },
              { key: 'lotes', label: 'Lotes' },
              { key: 'certificadosCalidad', label: 'Certificados de Calidad/Espec. Técnicas' },
              { key: 'tomaMuestras', label: 'Toma de muestras' },
              { key: 'pruebasLaboratorio', label: 'Pruebas de laboratorio' },
              { key: 'pesajeContenedor', label: 'Pesaje de contenedor' },
              { key: 'tiqueOficial', label: 'Tique oficial de pesaje' },
              { key: 'temperaturaAlmacenaje', label: 'Temperatura almacenaje previo carga' },
              { key: 'temperaturaContenedor', label: 'Temperatura de contenedor' },
              { key: 'precintadoContenedor', label: 'Precintado de contenedor' },
              { key: 'precintadoGrupaje', label: 'Precintado en grupaje (si es posible)' },
              { key: 'precintoSeguridad', label: 'Precinto de seguridad "barra a barra"' },
              { key: 'informeCampo', label: 'Se puede entregar Informe de Campo' }
            ].map(item => (
              <div key={item.key} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <Label className="flex-1 text-sm leading-relaxed font-medium">
                    {item.label}
                  </Label>
                  <div className="flex gap-3 min-w-[180px]">
                    <div className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id={`${item.key}-yes`}
                        name={item.key}
                        value="yes"
                        checked={data.alcance[item.key as keyof typeof data.alcance] === 'yes'}
                        onChange={() => updateNestedField('alcance', item.key, 'yes')}
                        className="w-3 h-3 text-primary"
                      />
                      <Label htmlFor={`${item.key}-yes`} className="text-xs font-medium text-green-700">
                        YES
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id={`${item.key}-no`}
                        name={item.key}
                        value="no"
                        checked={data.alcance[item.key as keyof typeof data.alcance] === 'no'}
                        onChange={() => updateNestedField('alcance', item.key, 'no')}
                        className="w-3 h-3 text-primary"
                      />
                      <Label htmlFor={`${item.key}-no`} className="text-xs font-medium text-red-700">
                        NO
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id={`${item.key}-na`}
                        name={item.key}
                        value="na"
                        checked={data.alcance[item.key as keyof typeof data.alcance] === 'na'}
                        onChange={() => updateNestedField('alcance', item.key, 'na')}
                        className="w-3 h-3 text-primary"
                      />
                      <Label htmlFor={`${item.key}-na`} className="text-xs font-medium text-gray-600">
                        NA
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Hallazgos - Revisión de Contenedores",
      component: (
        <div className="space-y-4">
          <Label className="text-base font-semibold">Estado de los contenedores:</Label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: 'limpios', label: 'Limpios' },
              { key: 'libresOlores', label: 'Libres de olores' },
              { key: 'sinAgujeros', label: 'Sin agujeros/Roturas/Filtrado de luz' },
              { key: 'sinOxido', label: 'Sin óxido relevante' },
              { key: 'cierrePuertas', label: 'Cierre de puertas correcto' }
            ].map(item => (
              <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={item.key}
                  checked={data.revisionContenedores[item.key as keyof typeof data.revisionContenedores]}
                  onCheckedChange={(checked) => updateNestedField('revisionContenedores', item.key, checked)}
                />
                <Label htmlFor={item.key} className="flex-1">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numeroBultos">Número de bultos totales</Label>
            <div className="flex gap-2">
              <Input
                id="numeroBultos"
                value={data.numeroBultos}
                onChange={(e) => updateField('numeroBultos', e.target.value)}
              />
              
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Fotos de Bultos</Label>
            <PhotoInput
              photos={data.bultosFotos}
              onPhotosChange={(photos) => updateField('bultosFotos', photos)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Embalaje",
      component: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tipo de Embalaje:</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'huacal', label: 'Huacal' },
                { key: 'bidon', label: 'Bidón' },
                { key: 'caja', label: 'Caja' },
                { key: 'bandeja', label: 'Bandeja' },
                { key: 'atado', label: 'Atado' },
                { key: 'saco', label: 'Saco' },
                { key: 'rollo', label: 'Rollo' },
                { key: 'otros', label: 'Otros' }
              ].map(item => (
                <div key={item.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipo-${item.key}`}
                    checked={data.embalajeTipo[item.key as keyof typeof data.embalajeTipo]}
                    onCheckedChange={(checked) => updateNestedField('embalajeTipo', item.key, checked)}
                  />
                  <Label htmlFor={`tipo-${item.key}`}>{item.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Material:</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'carton', label: 'Cartón' },
                { key: 'madera', label: 'Madera' },
                { key: 'plastico', label: 'Plástico' },
                { key: 'metalico', label: 'Metálico' },
                { key: 'papel', label: 'Papel' },
                { key: 'kraft', label: 'Kraft' },
                { key: 'otro', label: 'Otro' }
              ].map(item => (
                <div key={item.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${item.key}`}
                    checked={data.embalajeMaterial[item.key as keyof typeof data.embalajeMaterial]}
                    onCheckedChange={(checked) => updateNestedField('embalajeMaterial', item.key, checked)}
                  />
                  <Label htmlFor={`material-${item.key}`}>{item.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Presentación:</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'paletizado', label: 'Paletizado' },
                { key: 'retractilado', label: 'Retractilado' },
                { key: 'flejado', label: 'Flejado' },
                { key: 'granel', label: 'Granel' }
              ].map(item => (
                <div key={item.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`presentacion-${item.key}`}
                    checked={data.embalajePresentation[item.key as keyof typeof data.embalajePresentation]}
                    onCheckedChange={(checked) => updateNestedField('embalajePresentation', item.key, checked)}
                  />
                  <Label htmlFor={`presentacion-${item.key}`}>{item.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Detalles Adicionales",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="marcasDetalle">Marcas</Label>
            <div className="flex gap-2">
              <Textarea
                id="marcasDetalle"
                value={data.marcasDetalle}
                onChange={(e) => updateField('marcasDetalle', e.target.value)}
                rows={3}
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('marcasDetalle', text)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Fotos de Marcas</Label>
            <PhotoInput
              photos={data.marcasFotos}
              onPhotosChange={(photos) => updateField('marcasFotos', photos)}
            />
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              id="senalesInternacionales"
              checked={data.senalesInternacionales}
              onCheckedChange={(checked) => updateField('senalesInternacionales', checked)}
            />
            <Label htmlFor="senalesInternacionales">Señales internacionales</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="precintadoContenedorDetalle">Precintado de contenedores</Label>
            <div className="flex gap-2">
              <Textarea
                id="precintadoContenedorDetalle"
                value={data.precintadoContenedorDetalle}
                onChange={(e) => updateField('precintadoContenedorDetalle', e.target.value)}
                rows={2}
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('precintadoContenedorDetalle', text)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Fotos de Precintado</Label>
            <PhotoInput
              photos={data.precintadoFotos}
              onPhotosChange={(photos) => updateField('precintadoFotos', photos)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Conclusiones",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcionEstibaTexto">Descripción de la estiba</Label>
            <div className="flex gap-2">
              <Textarea
                id="descripcionEstibaTexto"
                value={data.descripcionEstibaTexto}
                onChange={(e) => updateField('descripcionEstibaTexto', e.target.value)}
                rows={3}
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('descripcionEstibaTexto', text)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otrosHallazgos">Otros hallazgos o incidencias</Label>
            <div className="flex gap-2">
              <Textarea
                id="otrosHallazgos"
                value={data.otrosHallazgos}
                onChange={(e) => updateField('otrosHallazgos', e.target.value)}
                rows={4}
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('otrosHallazgos', text)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conclusiones">Conclusiones</Label>
            <div className="flex gap-2">
              <Textarea
                id="conclusiones"
                value={data.conclusiones}
                onChange={(e) => updateField('conclusiones', e.target.value)}
                rows={4}
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('conclusiones', text)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lugarFecha">Lugar y Fecha</Label>
            <div className="flex gap-2">
              <Input
                id="lugarFecha"
                value={data.lugarFecha}
                onChange={(e) => updateField('lugarFecha', e.target.value)}
              />
              
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveData = () => {
    localStorage.setItem('inspectionData', JSON.stringify(data));
    alert('Datos guardados correctamente');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Informe de Inspección
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    localStorage.setItem('inspectionData', JSON.stringify(data));
                    console.log('Datos guardados:', data);
                    alert('Datos guardados exitosamente');
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                
                <Button 
                  onClick={() => generateFinalInspectionPDF(data)}
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generar PDF
                </Button>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Menú Principal
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index <= currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {currentStep === 0 && !showImportOptions && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowImportOptions(true)}
              className="w-full"
            >
              Importar datos de Informe de Campo
            </Button>
          </div>
        )}

        {showImportOptions && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Importar Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                ¿Desea importar los datos guardados del Informe de Campo?
              </p>
              <div className="flex gap-2">
                <Button onClick={importFromFieldReport}>
                  Sí, importar datos
                </Button>
                <Button variant="outline" onClick={() => setShowImportOptions(false)}>
                  No, continuar sin importar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {steps[currentStep].component}
          </CardContent>
        </Card>

<div className="flex flex-col gap-4 mt-6">
  {/* Navegación */}
  <div className="flex justify-between gap-4">
    {currentStep === 0 ? (
      <Link to="/" className="flex-1">
        <Button type="button" variant="outline" className="w-full">
          <Home className="h-4 w-4 mr-2" />
          Volver al Inicio
        </Button>
      </Link>
    ) : (
      <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Anterior
      </Button>
    )}

    <Button
      type="button"
      onClick={
        currentStep === steps.length - 1
          ? () => {
              localStorage.setItem('inspectionData', JSON.stringify(data));
              console.log('Informe final guardado:', data);
              alert('Informe final guardado exitosamente');
            }
          : nextStep
      }
      className="flex-1"
    >
      {currentStep === steps.length - 1 ? (
        <>
          <Save className="h-4 w-4 mr-2" />
          Guardar Informe
        </>
      ) : (
        <>
          Siguiente
          <ChevronRight className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  </div>

  {/* Acciones extra: siempre visibles en todos los pasos */}
  {/* input hidden para subir JSON */}
  <input
    ref={jsonInputRef}
    type="file"
    accept=".json"
    onChange={handleJSONUpload}
    className="hidden"
  />

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <Button type="button" onClick={() => jsonInputRef.current?.click()} variant="outline" className="w-full">
      <Upload className="h-4 w-4 mr-2" />
      Cargar desde JSON
    </Button>

    <Button type="button" onClick={exportToJSON} variant="outline" className="w-full">
      <FileJson className="h-4 w-4 mr-2" />
      Exportar a JSON
    </Button>

    <Button type="button" onClick={generateWordDoc} variant="outline" className="w-full">
      <FileText className="h-4 w-4 mr-2" />
      Generar Documento Word
    </Button>
  </div>
</div>
      </div>
    </div>
  );
};