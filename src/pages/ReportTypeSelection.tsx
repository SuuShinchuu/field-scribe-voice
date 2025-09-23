import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ClipboardList } from 'lucide-react';

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
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Informe de Campo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Informe preliminar realizado directamente en el lugar de inspección
              </p>
              <Button variant="outline" className="w-full" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>

          <Link to="/informe-final" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Informe Final</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Informe completo y detallado con todos los hallazgos y conclusiones
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
            NOVA - Sistema de Gestión de Inspecciones
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportTypeSelection;