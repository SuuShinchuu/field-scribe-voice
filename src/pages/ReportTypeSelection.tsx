import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ClipboardList, Clipboard } from 'lucide-react';

const ReportTypeSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sistema de Informes NOVA
          </h1>
          <p className="text-xl text-muted-foreground">
            Seleccione el tipo de informe que desea crear
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/orden-trabajo" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Clipboard className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Orden de Trabajo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-sm">
                  Crear una nueva orden de trabajo de inspección con alcance detallado
                </p>
                <Button className="w-full">
                  Crear Orden de Trabajo
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Informe de Campo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6 text-sm">
                Informe preliminar realizado directamente en el lugar de inspección
              </p>
              <Link to="/informe-campo" className="block">
                <Button className="w-full">
                  Crear Informe de Campo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Link to="/informe-final" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Informe Final</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 text-sm">
                  Informe completo y detallado con todos los hallazgos,conclusiones y fotos
                </p>
                <Button className="w-full">
                  Crear Informe Final
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            NOVA - All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportTypeSelection;