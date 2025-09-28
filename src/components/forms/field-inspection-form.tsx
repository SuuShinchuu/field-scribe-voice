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
import { ChevronLeft, ChevronRight, Save, FileText, Home, Download, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldInspectionData {
  // Basic Info
  expedienteNova: string;
  fecha: string;
  codigoInspector: string;
  paisDestino: string;
  
  // Client Reference
  referenciaCliente: string;
  numeroContrato: string;
  
  // Inspection Result
  resultadoInspeccion: {
    satisfactoria: boolean;
    noSatisfactoria: boolean;
    condicional: boolean;
    fallida: boolean;
  };
  
  // Container Info
  numeroContenedor: string;
  tipoContenedor: string;
  tamanoContenedor: string;
  precintoNova: string;
  precintoNaviera: string;
  
  // Company Info
  exportador: string;
  proveedor: string;
  personaContacto: string;
  lugarInspeccion: string;
  poblacion: string;
  provincia: string;
  horaInicio: string;
  horaFinalizacion: string;
  
  // Scope
  alcanceInspeccion: string;
  
  // Product Info
  mercanciaDeclarada: string;
  paisFabricacion: string;
  puertoOrigen: string;
  puertoDestino: string;
  
  // Packaging
  embalajePresentation: string;
  produccion: string;
  caducidad: string;
  
  // Package Details
  tipoBulto: string;
  cantidad: string;
  
  // Weight
  pesoNeto: string;
  pesoBruto: string;
  
  // Additional Info
  estiba: string;
  otros: string;
  
  // Photos
  fotosMercancia: string[];
  fotosMarcas: string[];
  fotosContenedor: string[];
}

const initialData: FieldInspectionData = {
  expedienteNova: '',
  fecha: new Date().toISOString().split('T')[0],
  codigoInspector: '',
  paisDestino: '',
  referenciaCliente: '',
  numeroContrato: '',
  resultadoInspeccion: {
    satisfactoria: false,
    noSatisfactoria: false,
    condicional: false,
    fallida: false,
  },
  numeroContenedor: '',
  tipoContenedor: '',
  tamanoContenedor: '',
  precintoNova: '',
  precintoNaviera: '',
  exportador: '',
  proveedor: '',
  personaContacto: '',
  lugarInspeccion: '',
  poblacion: '',
  provincia: '',
  horaInicio: '',
  horaFinalizacion: '',
  alcanceInspeccion: '',
  mercanciaDeclarada: '',
  paisFabricacion: '',
  puertoOrigen: '',
  puertoDestino: '',
  embalajePresentation: '',
  produccion: '',
  caducidad: '',
  tipoBulto: '',
  cantidad: '',
  pesoNeto: '',
  pesoBruto: '',
  estiba: '',
  otros: '',
  fotosMercancia: [],
  fotosMarcas: [],
  fotosContenedor: [],
};

export const FieldInspectionForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [data, setData] = useState<FieldInspectionData>(initialData);

  const updateField = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const importFromWorkOrder = () => {
    const workOrderData = localStorage.getItem('workOrderData');
    if (workOrderData) {
      const workOrder = JSON.parse(workOrderData);
      setData(prev => ({
        ...prev,
        expedienteNova: workOrder.expedienteNova || prev.expedienteNova,
        codigoInspector: workOrder.codigoInspector || prev.codigoInspector,
        paisDestino: workOrder.paisDestino || prev.paisDestino,
        referenciaCliente: workOrder.expedienteCliente || prev.referenciaCliente,
        numeroContrato: workOrder.numeroContrato || prev.numeroContrato,
        exportador: workOrder.exportador || prev.exportador,
        personaContacto: workOrder.personaContacto || prev.personaContacto,
        lugarInspeccion: workOrder.lugarInspeccion || prev.lugarInspeccion,
        poblacion: workOrder.poblacion || prev.poblacion,
        provincia: workOrder.provincia || prev.provincia,
        fecha: workOrder.fechaInspeccion || prev.fecha,
      }));
      setShowImportOptions(false);
    }
  };

  const updateNestedField = (parent: keyof FieldInspectionData, field: string, value: any) => {
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
      title: "Información Básica",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expedienteNova">Expediente NOVA</Label>
            <Input
              id="expedienteNova"
              value={data.expedienteNova}
              onChange={(e) => updateField('expedienteNova', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={data.fecha}
              onChange={(e) => updateField('fecha', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="codigoInspector">Código Inspector</Label>
            <Input
              id="codigoInspector"
              value={data.codigoInspector}
              onChange={(e) => updateField('codigoInspector', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paisDestino">País Destino</Label>
            <Input
              id="paisDestino"
              value={data.paisDestino}
              onChange={(e) => updateField('paisDestino', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Referencia del Cliente",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referenciaCliente">Referencia Cliente</Label>
            <Input
              id="referenciaCliente"
              value={data.referenciaCliente}
              onChange={(e) => updateField('referenciaCliente', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numeroContrato">Número de Contrato</Label>
            <Input
              id="numeroContrato"
              value={data.numeroContrato}
              onChange={(e) => updateField('numeroContrato', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Resultado de Inspección",
      component: (
        <div className="space-y-4">
          <Label className="text-base font-semibold">Resultado de la inspección:</Label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: 'satisfactoria', label: 'Satisfactoria', color: 'text-green-700' },
              { key: 'noSatisfactoria', label: 'No Satisfactoria', color: 'text-red-700' },
              { key: 'condicional', label: 'Condicional', color: 'text-yellow-700' },
              { key: 'fallida', label: 'Fallida', color: 'text-red-900' }
            ].map(item => (
              <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={item.key}
                  checked={data.resultadoInspeccion[item.key as keyof typeof data.resultadoInspeccion]}
                  onCheckedChange={(checked) => updateNestedField('resultadoInspeccion', item.key, checked)}
                />
                <Label htmlFor={item.key} className={cn("flex-1 font-medium", item.color)}>
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Información del Contenedor",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numeroContenedor">Número Contenedor</Label>
            <Input
              id="numeroContenedor"
              value={data.numeroContenedor}
              onChange={(e) => updateField('numeroContenedor', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoContenedor">Tipo</Label>
              <Input
                id="tipoContenedor"
                value={data.tipoContenedor}
                onChange={(e) => updateField('tipoContenedor', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tamanoContenedor">Tamaño</Label>
              <Input
                id="tamanoContenedor"
                value={data.tamanoContenedor}
                onChange={(e) => updateField('tamanoContenedor', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precintoNova">Precinto NOVA</Label>
              <Input
                id="precintoNova"
                value={data.precintoNova}
                onChange={(e) => updateField('precintoNova', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precintoNaviera">Precinto Naviera</Label>
              <Input
                id="precintoNaviera"
                value={data.precintoNaviera}
                onChange={(e) => updateField('precintoNaviera', e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Información de Empresas",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exportador">Exportador</Label>
            <Input
              id="exportador"
              value={data.exportador}
              onChange={(e) => updateField('exportador', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proveedor">Proveedor</Label>
            <Input
              id="proveedor"
              value={data.proveedor}
              onChange={(e) => updateField('proveedor', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personaContacto">Persona de Contacto</Label>
            <Input
              id="personaContacto"
              value={data.personaContacto}
              onChange={(e) => updateField('personaContacto', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lugarInspeccion">Lugar de Inspección</Label>
            <Input
              id="lugarInspeccion"
              value={data.lugarInspeccion}
              onChange={(e) => updateField('lugarInspeccion', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Ubicación y Horarios",
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="poblacion">Población</Label>
              <Input
                id="poblacion"
                value={data.poblacion}
                onChange={(e) => updateField('poblacion', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Input
                id="provincia"
                value={data.provincia}
                onChange={(e) => updateField('provincia', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora de Inicio</Label>
              <Input
                id="horaInicio"
                type="time"
                value={data.horaInicio}
                onChange={(e) => updateField('horaInicio', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFinalizacion">Hora de Finalización</Label>
              <Input
                id="horaFinalizacion"
                type="time"
                value={data.horaFinalizacion}
                onChange={(e) => updateField('horaFinalizacion', e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Alcance de la Inspección",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alcanceInspeccion">Alcance de la Inspección</Label>
            <div className="flex gap-2">
              <Textarea
                id="alcanceInspeccion"
                value={data.alcanceInspeccion}
                onChange={(e) => updateField('alcanceInspeccion', e.target.value)}
                rows={4}
                placeholder="Describa el alcance completo de la inspección realizada..."
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('alcanceInspeccion', text)} />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Información del Producto",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mercanciaDeclarada">Mercancía Declarada</Label>
            <Input
              id="mercanciaDeclarada"
              value={data.mercanciaDeclarada}
              onChange={(e) => updateField('mercanciaDeclarada', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paisFabricacion">País de Fabricación</Label>
            <Input
              id="paisFabricacion"
              value={data.paisFabricacion}
              onChange={(e) => updateField('paisFabricacion', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="puertoOrigen">Puerto/Aeropuerto de Origen</Label>
            <Input
              id="puertoOrigen"
              value={data.puertoOrigen}
              onChange={(e) => updateField('puertoOrigen', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="puertoDestino">Puerto/Aeropuerto de Destino</Label>
            <Input
              id="puertoDestino"
              value={data.puertoDestino}
              onChange={(e) => updateField('puertoDestino', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: "Embalaje y Fechas",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="embalajePresentation">Embalaje Presentado</Label>
            <div className="flex gap-2">
              <Textarea
                id="embalajePresentation"
                value={data.embalajePresentation}
                onChange={(e) => updateField('embalajePresentation', e.target.value)}
                rows={3}
                placeholder="Describa el tipo de embalaje presentado..."
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('embalajePresentation', text)} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="produccion">Producción</Label>
              <Input
                id="produccion"
                value={data.produccion}
                onChange={(e) => updateField('produccion', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caducidad">Caducidad</Label>
              <Input
                id="caducidad"
                value={data.caducidad}
                onChange={(e) => updateField('caducidad', e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Detalles de Bultos y Peso",
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoBulto">Tipo Bulto</Label>
              <Input
                id="tipoBulto"
                value={data.tipoBulto}
                onChange={(e) => updateField('tipoBulto', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                value={data.cantidad}
                onChange={(e) => updateField('cantidad', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesoNeto">Peso Neto</Label>
              <Input
                id="pesoNeto"
                value={data.pesoNeto}
                onChange={(e) => updateField('pesoNeto', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pesoBruto">Peso Bruto</Label>
              <Input
                id="pesoBruto"
                value={data.pesoBruto}
                onChange={(e) => updateField('pesoBruto', e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Estiba y Observaciones",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estiba">Estiba</Label>
            <div className="flex gap-2">
              <Textarea
                id="estiba"
                value={data.estiba}
                onChange={(e) => updateField('estiba', e.target.value)}
                rows={4}
                placeholder="Describa la disposición y estiba de la mercancía..."
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('estiba', text)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otros">Otros</Label>
            <div className="flex gap-2">
              <Textarea
                id="otros"
                value={data.otros}
                onChange={(e) => updateField('otros', e.target.value)}
                rows={4}
                placeholder="Observaciones adicionales, incidencias o comentarios..."
              />
              <VoiceInput onTranscript={(text) => handleVoiceInput('otros', text)} />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Documentación Fotográfica",
      component: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Fotos de Mercancía</Label>
            <PhotoInput
              photos={data.fotosMercancia}
              onPhotosChange={(photos) => updateField('fotosMercancia', photos)}
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Fotos de Marcas</Label>
            <PhotoInput
              photos={data.fotosMarcas}
              onPhotosChange={(photos) => updateField('fotosMarcas', photos)}
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Fotos Contenedor</Label>
            <PhotoInput
              photos={data.fotosContenedor}
              onPhotosChange={(photos) => updateField('fotosContenedor', photos)}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Informe de Campo</h1>
          <p className="text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {currentStep === 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <Button
                onClick={() => {
                  const workOrderData = localStorage.getItem('workOrderData');
                  if (workOrderData) {
                    const workOrder = JSON.parse(workOrderData);
                    setData(prev => ({
                      ...prev,
                      expedienteNova: workOrder.expedienteNova || prev.expedienteNova,
                      fecha: workOrder.fechaInspeccion || prev.fecha,
                      codigoInspector: workOrder.codigoInspector || prev.codigoInspector,
                      paisDestino: workOrder.paisDestino || prev.paisDestino,
                      referenciaCliente: workOrder.expedienteCliente || prev.referenciaCliente,
                      numeroContrato: workOrder.numeroContrato || prev.numeroContrato,
                      exportador: workOrder.exportador || prev.exportador,
                      personaContacto: workOrder.personaContacto || prev.personaContacto,
                      lugarInspeccion: workOrder.lugarInspeccion || prev.lugarInspeccion,
                      poblacion: workOrder.poblacion || prev.poblacion,
                      provincia: workOrder.provincia || prev.provincia,
                      horaInicio: workOrder.horaInspeccion || prev.horaInicio,
                      mercanciaDeclarada: workOrder.descripcionMercancia || prev.mercanciaDeclarada,
                      puertoOrigen: workOrder.puertoAeropuertoOrigen || prev.puertoOrigen,
                      puertoDestino: workOrder.puertoAeropuertoDestino || prev.puertoDestino,
                    }));
                    alert('Datos de Orden de Trabajo cargados exitosamente');
                  } else {
                    alert('No hay datos de Orden de Trabajo guardados');
                  }
                }}
                variant="outline"
                className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Cargar datos de Orden de Trabajo
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    localStorage.setItem('fieldInspectionData', JSON.stringify(data));
                    alert('Datos guardados exitosamente');
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Menú Principal
                  </Button>
                </Link>
              </div>
            </div>
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
            onClick={currentStep === steps.length - 1 ? () => {
              localStorage.setItem('fieldInspectionData', JSON.stringify(data));
              console.log('Informe de campo guardado:', data);
              alert('Informe de campo guardado exitosamente');
            } : nextStep}
            className="flex-1"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
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