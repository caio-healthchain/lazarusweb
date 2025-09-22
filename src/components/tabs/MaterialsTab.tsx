import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, XCircle, Plus, Search, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  status: 'covered' | 'not-covered' | 'requires-justification';
  requestedBy: string;
  requestDate: Date;
  quantity: number;
  unitValue: number;
  justification?: string;
  contractualBase: string;
}

interface MaterialRequest {
  materialCode: string;
  materialName: string;
  quantity: number;
  justification?: string;
}

interface MaterialsTabProps {
  patient?: any;
}

export function MaterialsTab({ patient }: MaterialsTabProps) {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      code: "MAT-001",
      name: "Tela de polipropileno 15x15cm",
      category: "Material Cirúrgico",
      status: "covered",
      requestedBy: "Dr. João Carlos",
      requestDate: new Date("2024-01-20T10:30:00"),
      quantity: 2,
      unitValue: 150.00,
      contractualBase: "Cláusula 4.2 - Materiais básicos"
    },
    {
      id: "2", 
      code: "MAT-102",
      name: "Prótese de quadril especial importada",
      category: "Prótese",
      status: "not-covered",
      requestedBy: "Dr. Maria Silva",
      requestDate: new Date("2024-01-20T14:15:00"),
      quantity: 1,
      unitValue: 8500.00,
      justification: "Paciente com anatomia atípica requer prótese personalizada",
      contractualBase: "Não previsto no contrato"
    },
    {
      id: "3",
      code: "MAT-045",
      name: "Stent farmacológico premium",
      category: "Dispositivo Médico",
      status: "requires-justification",
      requestedBy: "Dr. Carlos Eduardo",
      requestDate: new Date("2024-01-20T16:45:00"),
      quantity: 1,
      unitValue: 3200.00,
      justification: "Paciente diabético com histórico de reestenose",
      contractualBase: "Requer avaliação caso a caso"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newRequest, setNewRequest] = useState<MaterialRequest>({
    materialCode: "",
    materialName: "",
    quantity: 1,
    justification: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: Material['status']) => {
    switch (status) {
      case 'covered':
        return (
          <Badge variant="secondary" className="bg-success/20 text-success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Coberto
          </Badge>
        );
      case 'not-covered':
        return (
          <Badge variant="secondary" className="bg-destructive/20 text-destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Não Coberto
          </Badge>
        );
      case 'requires-justification':
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Requer Justificativa
          </Badge>
        );
    }
  };

  const getRiskLevel = (material: Material) => {
    if (material.status === 'not-covered') return 'Alto';
    if (material.status === 'requires-justification') return 'Médio';
    return 'Baixo';
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Alto':
        return <Badge variant="destructive">Alto Risco</Badge>;
      case 'Médio':
        return <Badge variant="secondary" className="bg-warning/20 text-warning">Médio Risco</Badge>;
      default:
        return <Badge variant="secondary" className="bg-success/20 text-success">Baixo Risco</Badge>;
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewRequest = () => {
    if (!newRequest.materialCode || !newRequest.materialName) {
      toast({
        title: "Erro",
        description: "Código e nome do material são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Simular validação via Lazarus
    const isLazarusValidated = Math.random() > 0.3; // 70% chance de validação
    const status: Material['status'] = isLazarusValidated ? 'covered' : 
      (Math.random() > 0.5 ? 'not-covered' : 'requires-justification');

    const newMaterial: Material = {
      id: Math.random().toString(36).substr(2, 9),
      code: newRequest.materialCode,
      name: newRequest.materialName,
      category: "Material Cirúrgico",
      status,
      requestedBy: "Dr. Ana Costa",
      requestDate: new Date(),
      quantity: newRequest.quantity,
      unitValue: Math.random() * 1000 + 100,
      justification: newRequest.justification,
      contractualBase: status === 'covered' ? "Validado pelo Lazarus" : "Requer análise manual"
    };

    setMaterials(prev => [newMaterial, ...prev]);
    setNewRequest({ materialCode: "", materialName: "", quantity: 1, justification: "" });
    setIsDialogOpen(false);

    toast({
      title: "Material solicitado",
      description: `Material ${newMaterial.name} foi ${status === 'covered' ? 'aprovado' : 'marcado para revisão'}`,
      variant: status === 'covered' ? "default" : "destructive"
    });
  };

  const totalValue = materials.reduce((sum, material) => sum + (material.quantity * material.unitValue), 0);
  const coveredValue = materials.filter(m => m.status === 'covered').reduce((sum, material) => sum + (material.quantity * material.unitValue), 0);
  const notCoveredValue = materials.filter(m => m.status === 'not-covered').reduce((sum, material) => sum + (material.quantity * material.unitValue), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Total Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{materials.length}</div>
            <p className="text-sm text-muted-foreground">itens solicitados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5" />
              Valor Coberto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {coveredValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              {((coveredValue / totalValue) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5" />
              Valor Não Coberto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {notCoveredValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">risco de glosa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Status Lazarus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="font-medium">Online</span>
            </div>
            <p className="text-sm text-muted-foreground">Validação ativa</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar materiais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Solicitar Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Novo Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="materialCode">Código do Material</Label>
                <Input
                  id="materialCode"
                  value={newRequest.materialCode}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, materialCode: e.target.value }))}
                  placeholder="Ex: MAT-001"
                />
              </div>
              <div>
                <Label htmlFor="materialName">Nome do Material</Label>
                <Input
                  id="materialName"
                  value={newRequest.materialName}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, materialName: e.target.value }))}
                  placeholder="Ex: Tela de polipropileno"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newRequest.quantity}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <Label htmlFor="justification">Justificativa Clínica</Label>
                <Textarea
                  id="justification"
                  value={newRequest.justification}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, justification: e.target.value }))}
                  placeholder="Descreva a necessidade clínica do material..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleNewRequest}>
                  Solicitar via Lazarus
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materiais Solicitados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Risco</TableHead>
                <TableHead className="text-center">Qtd.</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Base Contratual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-mono text-sm">{material.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{material.name}</div>
                      {material.justification && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs" title={material.justification}>
                          {material.justification}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{material.category}</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(material.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getRiskBadge(getRiskLevel(material))}
                  </TableCell>
                  <TableCell className="text-center">{material.quantity}</TableCell>
                  <TableCell className="text-right font-mono">
                    R$ {material.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    R$ {(material.quantity * material.unitValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{material.requestedBy}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={material.contractualBase}>
                      {material.contractualBase}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}