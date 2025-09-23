import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Home, Save, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkOrderData {
  // Inspector Info
  inspector: string;
  codigoInspector: string;
  movilInspector: string;
  coordinador: string;
  movilCoordinador: string;
  
  // Expedition Info
  expedienteNova: string;
  paisDestino: string;
  fechaInspeccion: string;
  horaInspeccion: string;
  personaContacto: string;
  
  // Client Info
  expedienteCliente: string;
  exportador: string;
  importador: string;
  numeroContrato: string;
  suplementoContrato: string;
  
  // Location Info
  lugarInspeccion: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  provincia: string;
  telefonoContacto: string;
  otrosDetallesContacto: string;
  
  // Inspection Details
  cantidadTipoContenedor: string;
  horariosPrevisosCarga: string;
  descripcionMercancia: string;
  puertoAeropuertoOrigen: string;
  puertoAeropuertoDestino: string;
  buque: string;
  
  // Supervision Scope
  revisionEstadoContenedor: boolean;
  conteoBultos: boolean;
  aperturaBultos: string; // SÍ/NO/N/A
  pesajeBultos: string;
  embalaje: boolean;
  paletsFumigados: boolean;
  marcas: boolean;
  descripcionEstiba: boolean;
  mercanciaTrincaContenedor: boolean;
  fechaProduccion: boolean;
  fechaCaducidad: boolean;
  lotes: boolean;
  certificadosCalidad: boolean;
  tomaMuestras: boolean;
  pruebasLaboratorio: boolean;
  pesajeContenedor: boolean;
  tiqueOficialPesaje: boolean;
  temperaturaAlmacenajePrevio: boolean;
  temperaturaContenedor: boolean;
  precintadoContenedor: boolean;
  precintadoGrupaje: boolean;
  precintoSeguridadBarra: boolean;
  puedeEntregarInformeCampo: boolean;
  
  // Additional Notes
  observacionesEspeciales: string;
}

const initialData: WorkOrderData = {
  inspector: '',
  codigoInspector: '',
  movilInspector: '',
  coordinador: '',
  movilCoordinador: '',
  expedienteNova: '',
  paisDestino: '',
  fechaInspeccion: new Date().toISOString().split('T')[0],
  horaInspeccion: '',
  personaContacto: '',
  expedienteCliente: '',
  exportador: '',
  importador: '',
  numeroContrato: '',
  suplementoContrato: '',
  lugarInspeccion: '',
  direccion: '',
  codigoPostal: '',
  poblacion: '',
  provincia: '',
  telefonoContacto: '',
  otrosDetallesContacto: '',
  cantidadTipoContenedor: '',
  horariosPrevisosCarga: '',
  descripcionMercancia: '',
  puertoAeropuertoOrigen: '',
  puertoAeropuertoDestino: '',
  buque: '',
  revisionEstadoContenedor: false,
  conteoBultos: false,
  aperturaBultos: 'NO',
  pesajeBultos: 'NO',
  embalaje: false,
  paletsFumigados: false,
  marcas: false,
  descripcionEstiba: false,
  mercanciaTrincaContenedor: false,
  fechaProduccion: false,
  fechaCaducidad: false,
  lotes: false,
  certificadosCalidad: false,
  tomaMuestras: false,
  pruebasLaboratorio: false,
  pesajeContenedor: false,
  tiqueOficialPesaje: false,
  temperaturaAlmacenajePrevio: false,
  temperaturaContenedor: false,
  precintadoContenedor: false,
  precintadoGrupaje: false,
  precintoSeguridadBarra: false,
  puedeEntregarInformeCampo: false,
  observacionesEspeciales: ''
};

export const WorkOrderForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WorkOrderData>(initialData);

  const updateField = (field: keyof WorkOrderData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

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

  const steps = [
    {
      title: "Información del Inspector",
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inspector">Inspector</Label>
              <Input
                id="inspector"
                value={data.inspector}
                onChange={(e) => updateField('inspector', e.target.value)}
                placeholder="Nombre completo del inspector"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="codigoInspector">Código Inspector</Label>
              <Input
                id="codigoInspector"
                value={data.codigoInspector}
                onChange={(e) => updateField('codigoInspector', e.target.value)}
                placeholder="080909"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="movilInspector">Móvil Inspector</Label>
              <Input
                id="movilInspector"
                type="tel"
                value={data.movilInspector}
                onChange={(e) => updateField('movilInspector', e.target.value)}
                placeholder="669 870 200"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coordinador">Coordinador</Label>
              <Input
                id="coordinador"
                value={data.coordinador}
                onChange={(e) => updateField('coordinador', e.target.value)}
                placeholder="Nombre del coordinador"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="movilCoordinador">Móvil Coordinador</Label>
              <Input
                id="movilCoordinador"
                type="tel"
                value={data.movilCoordinador}
                onChange={(e) => updateField('movilCoordinador', e.target.value)}
                placeholder="646 086 394"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Información del Expediente",
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expedienteNova">Expediente NOVA</Label>
              <Input
                id="expedienteNova"
                value={data.expedienteNova}
                onChange={(e) => updateField('expedienteNova', e.target.value)}
                placeholder="NC-CU-07215-25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paisDestino">País Destino</Label>
              <Input
                id="paisDestino"
                value={data.paisDestino}
                onChange={(e) => updateField('paisDestino', e.target.value)}
                placeholder="Cuba"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personaContacto">Persona Contacto</Label>
              <Input
                id="personaContacto"
                value={data.personaContacto}
                onChange={(e) => updateField('personaContacto', e.target.value)}
                placeholder="Teresa Fluvià"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInspeccion">Fecha Inspección</Label>
              <Input
                id="fechaInspeccion"
                type="date"
                value={data.fechaInspeccion}
                onChange={(e) => updateField('fechaInspeccion', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horaInspeccion">Hora Inspección</Label>
              <Input
                id="horaInspeccion"
                type="time"
                value={data.horaInspeccion}
                onChange={(e) => updateField('horaInspeccion', e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Información del Cliente",
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expedienteCliente">Expediente Cliente</Label>
              <Input
                id="expedienteCliente"
                value={data.expedienteCliente}
                onChange={(e) => updateField('expedienteCliente', e.target.value)}
                placeholder="CMI 2507-0488"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exportador">Exportador</Label>
              <Input
                id="exportador"
                value={data.exportador}
                onChange={(e) => updateField('exportador', e.target.value)}
                placeholder="RCI"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="importador">Importador</Label>
              <Input
                id="importador"
                value={data.importador}
                onChange={(e) => updateField('importador', e.target.value)}
                placeholder="Tabaimport"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numeroContrato">Número de Contrato</Label>
              <Input
                id="numeroContrato"
                value={data.numeroContrato}
                onChange={(e) => updateField('numeroContrato', e.target.value)}
                placeholder="078-2025-15555-ES-1482"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="suplementoContrato">Suplemento Contrato</Label>
              <Input
                id="suplementoContrato"
                value={data.suplementoContrato}
                onChange={(e) => updateField('suplementoContrato', e.target.value)}
                placeholder="--"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Lugar de Inspección",
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lugarInspeccion">Lugar de Inspección</Label>
              <Input
                id="lugarInspeccion"
                value={data.lugarInspeccion}
                onChange={(e) => updateField('lugarInspeccion', e.target.value)}
                placeholder="BADRINAS SAU"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={data.direccion}
                onChange={(e) => updateField('direccion', e.target.value)}
                placeholder="P.I. Els Plans d'Arau Carrer Alexandre Volta 39"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código Postal</Label>
                <Input
                  id="codigoPostal"
                  value={data.codigoPostal}
                  onChange={(e) => updateField('codigoPostal', e.target.value)}
                  placeholder="08787"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poblacion">Población</Label>
                <Input
                  id="poblacion"
                  value={data.poblacion}
                  onChange={(e) => updateField('poblacion', e.target.value)}
                  placeholder="La Pobla de Claramunt"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Input
                id="provincia"
                value={data.provincia}
                onChange={(e) => updateField('provincia', e.target.value)}
                placeholder="Barcelona"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefonoContacto">Teléfono de Contacto</Label>
              <Input
                id="telefonoContacto"
                type="tel"
                value={data.telefonoContacto}
                onChange={(e) => updateField('telefonoContacto', e.target.value)}
                placeholder="+34 93 460 71 44"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otrosDetallesContacto">Otros Detalles de Contacto</Label>
              <Input
                id="otrosDetallesContacto"
                type="email"
                value={data.otrosDetallesContacto}
                onChange={(e) => updateField('otrosDetallesContacto', e.target.value)}
                placeholder="teresa.fluvia@rayt.com"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Detalles de la Inspección",
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cantidadTipoContenedor">Cantidad y Tipo de Contenedor</Label>
              <Input
                id="cantidadTipoContenedor"
                value={data.cantidadTipoContenedor}
                onChange={(e) => updateField('cantidadTipoContenedor', e.target.value)}
                placeholder="Carga agrupada, 7 palets"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horariosPrevisosCarga">Horarios Previstos de Carga</Label>
              <Input
                id="horariosPrevisosCarga"
                value={data.horariosPrevisosCarga}
                onChange={(e) => updateField('horariosPrevisosCarga', e.target.value)}
                placeholder="N/A"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descripcionMercancia">Descripción Mercancía</Label>
              <Input
                id="descripcionMercancia"
                value={data.descripcionMercancia}
                onChange={(e) => updateField('descripcionMercancia', e.target.value)}
                placeholder="Pegamento para cigarro G-1217-N"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="puertoAeropuertoOrigen">Puerto/Aeropuerto Origen</Label>
              <Input
                id="puertoAeropuertoOrigen"
                value={data.puertoAeropuertoOrigen}
                onChange={(e) => updateField('puertoAeropuertoOrigen', e.target.value)}
                placeholder="Barcelona"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="puertoAeropuertoDestino">Puerto/Aeropuerto Destino</Label>
              <Input
                id="puertoAeropuertoDestino"
                value={data.puertoAeropuertoDestino}
                onChange={(e) => updateField('puertoAeropuertoDestino', e.target.value)}
                placeholder="La Habana"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buque">Buque (si se conoce)</Label>
              <Input
                id="buque"
                value={data.buque}
                onChange={(e) => updateField('buque', e.target.value)}
                placeholder="No informado"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Alcance de Supervisión",
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { key: 'revisionEstadoContenedor', label: 'Revisión del estado del contenedor' },
              { key: 'conteoBultos', label: 'Conteo de bultos' },
              { key: 'embalaje', label: 'Embalaje' },
              { key: 'paletsFumigados', label: 'Palets fumigados' },
              { key: 'marcas', label: 'Marcas' },
              { key: 'descripcionEstiba', label: 'Descripción de estiba' },
              { key: 'mercanciaTrincaContenedor', label: 'Indicar si la mercancía se trinca al contenedor' },
              { key: 'fechaProduccion', label: 'Fecha de producción' },
              { key: 'fechaCaducidad', label: 'Fecha de caducidad' },
              { key: 'lotes', label: 'Lotes' },
              { key: 'certificadosCalidad', label: 'Certificados de Calidad/Espec. Técnicas' },
              { key: 'tomaMuestras', label: 'Toma de muestras' },
              { key: 'pruebasLaboratorio', label: 'Pruebas de laboratorio' },
              { key: 'pesajeContenedor', label: 'Pesaje de contenedor' },
              { key: 'tiqueOficialPesaje', label: 'Tique oficial de pesaje' },
              { key: 'temperaturaAlmacenajePrevio', label: 'Temperatura almacenaje previo carga' },
              { key: 'temperaturaContenedor', label: 'Temperatura de contenedor' },
              { key: 'precintadoContenedor', label: 'Precintado de contenedor' },
              { key: 'precintadoGrupaje', label: 'Precintado en grupaje (si es posible)' },
              { key: 'precintoSeguridadBarra', label: 'Precinto de seguridad "barra a barra"' },
              { key: 'puedeEntregarInformeCampo', label: 'Se puede entregar Informe de Campo' }
            ].map((item) => (
              <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={item.key}
                  checked={data[item.key as keyof WorkOrderData] as boolean}
                  onCheckedChange={(checked) => updateField(item.key as keyof WorkOrderData, checked)}
                />
                <Label htmlFor={item.key} className="flex-1 text-sm cursor-pointer">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Observaciones Especiales",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observacionesEspeciales">Observaciones y Notas Especiales</Label>
            <Textarea
              id="observacionesEspeciales"
              value={data.observacionesEspeciales}
              onChange={(e) => updateField('observacionesEspeciales', e.target.value)}
              rows={8}
              placeholder="OJO, hacer reportaje fotográfico muy completo, se trata de un grupaje y es la única forma de que nuestro informe final sea exhaustivo. Describir bien el embalaje y sus materiales, así como las marcas que acompañan el envío. Gracias."
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Orden de Trabajo</h1>
          <p className="text-muted-foreground text-lg">
            Paso {currentStep + 1} de {steps.length}
          </p>
          <div className="w-full bg-muted rounded-full h-3 mt-4 max-w-md mx-auto">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {steps[currentStep].component}
          </CardContent>
        </Card>

        <div className="flex justify-between gap-4">
          {currentStep === 0 ? (
            <Link to="/" className="flex-1 max-w-xs">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          ) : (
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex-1 max-w-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
          )}
          
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex-1 max-w-xs"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Orden
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};