import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, CreditCard, Activity, Stethoscope, Package, PackageCheck, AlertTriangle, ArrowLeft, Paperclip } from "lucide-react";
import { GeneralData } from "./tabs/GeneralData";
import { SurgeryTab } from "./tabs/SurgeryTab";
import { BillingTab } from "./tabs/BillingTab";
import { AuditTab } from "./tabs/AuditTab";
import { MaterialsTab } from "./tabs/MaterialsTab";
import { ExtraPackageTab } from "./tabs/ExtraPackageTab";
import { PendenciesTab } from "./tabs/PendenciesTab";
import { AnexosTab } from "./tabs/AnexosTab";
import { Button } from "@/components/ui/button";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  type: 'port_change' | 'material_approval' | 'extra_package' | 'billing_adjustment';
  description: string;
  status: 'approved' | 'rejected' | 'pending';
  details: {
    procedureId?: string;
    procedureName?: string;
    previousPort?: number;
    newPort?: number;
    itemName?: string;
    requestType?: string;
    value?: number;
  };
  justification: string;
}

export function PatientRecord() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const navigate = useNavigate();

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">Ficha do Paciente</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Sistema de Enquadramento de Porte Cirúrgico
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/patients')}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="pendencies" className="w-full">
              <TabsList className="grid w-full grid-cols-8 bg-muted/50 p-1 rounded-none">
                <TabsTrigger value="pendencies" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Pendências
                </TabsTrigger>
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados Gerais
                </TabsTrigger>
                <TabsTrigger value="surgery" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Cirurgia
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Materiais
                </TabsTrigger>
                <TabsTrigger value="extra-package" className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4" />
                  Extra-Pacote
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Faturamento
                </TabsTrigger>
                <TabsTrigger value="anexos" className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Anexos
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Auditoria
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="pendencies" className="mt-0">
                  <PendenciesTab />
                </TabsContent>
                
                <TabsContent value="general" className="mt-0">
                  <GeneralData />
                </TabsContent>

                <TabsContent value="surgery" className="mt-0">
                  <SurgeryTab onAuditLog={addAuditLog} />
                </TabsContent>

                <TabsContent value="materials" className="mt-0">
                  <MaterialsTab />
                </TabsContent>

                <TabsContent value="extra-package" className="mt-0">
                  <ExtraPackageTab />
                </TabsContent>

                <TabsContent value="billing" className="mt-0">
                  <BillingTab />
                </TabsContent>

                <TabsContent value="anexos" className="mt-0">
                  <AnexosTab />
                </TabsContent>

                <TabsContent value="audit" className="mt-0">
                  <AuditTab auditLogs={auditLogs} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}