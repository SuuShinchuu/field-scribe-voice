import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { VoiceInput } from '@/components/ui/voice-input';
import { PhotoInput } from '@/components/ui/photo-input';
import { ChevronLeft, ChevronRight, Save, FileText, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

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
              <Button onClick={saveData} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
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

        <div className="flex justify-between mt-6 gap-4">
          {currentStep === 0 ? (
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          ) : (
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
          )}
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex-1"
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};