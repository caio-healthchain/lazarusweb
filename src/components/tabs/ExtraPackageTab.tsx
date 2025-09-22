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
import { AlertTriangle, CheckCircle2, XCircle, Plus, Search, Package2, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ExtraPackageItem {
  id: string;
  code: string;
  description: string;
  type: 'medication' | 'exam' | 'material' | 'procedure';
  packageType: string;
  status: 'included' | 'extra-package' | 'blocked';
  requestedBy: string;
  requestDate: Date;
  quantity: number;
  unitValue: number;
  justification?: string;
  contractualRule: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface PackageRequest {
  itemCode: string;
  itemDescription: string;
  itemType: 'medication' | 'exam' | 'material' | 'procedure';
  quantity: number;
  justification?: string;
}

interface ExtraPackageTabProps {
  patient?: any;
}

export function ExtraPackageTab({ patient }: ExtraPackageTabProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<ExtraPackageItem[]>([
    {
      id: "1",
      code: "MED-001",
      description: "Antibiótico Vancomicina 500mg",
      type: "medication",
      packageType: "Pacote Cirúrgico Básico",
      status: "included",
      requestedBy: "Dr. João Carlos",
      requestDate: new Date("2024-01-20T10:30:00"),
      quantity: 3,
      unitValue: 45.00,
      contractualRule: "Incluído no pacote - Cláusula 3.1",
      riskLevel: "low"
    },
    {
      id: "2",
      code: "EX-102",
      description: "Ressonância magnética com contraste",
      type: "exam",
      packageType: "Pacote Cirúrgico Básico",
      status: "extra-package",
      requestedBy: "Dr. Maria Silva",
      requestDate: new Date("2024-01-20T14:15:00"),
      quantity: 1,
      unitValue: 850.00,
      justification: "Suspeita de complicação pós-operatória. Necessário para diagnóstico diferencial.",
      contractualRule: "Exame adicional - Requer autorização",
      riskLevel: "medium"
    },
    {
      id: "3",
      code: "PROC-045",
      description: "Drenagem pleural de emergência",
      type: "procedure",
      packageType: "Pacote Cirúrgico Básico",
      status: "extra-package",
      requestedBy: "Dr. Carlos Eduardo",
      requestDate: new Date("2024-01-20T16:45:00"),
      quantity: 1,
      unitValue: 1200.00,
      justification: "Pneumotórax secundário à cirurgia. Procedimento de emergência necessário.",
      contractualRule: "Procedimento não previsto no pacote",
      riskLevel: "high"
    },
    {
      id: "4",
      code: "MAT-078",
      description: "Prótese cardíaca premium",
      type: "material",
      packageType: "Pacote Cardíaco",
      status: "blocked",
      requestedBy: "Dr. Ana Costa",
      requestDate: new Date("2024-01-20T18:20:00"),
      quantity: 1,
      unitValue: 15000.00,
      justification: "Material fora da cobertura contratual. Aguarda aprovação da operadora.",
      contractualRule: "Material não coberto pelo contrato",
      riskLevel: "high"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newRequest, setNewRequest] = useState<PackageRequest>({
    itemCode: "",
    itemDescription: "",
    itemType: "medication",
    quantity: 1,
    justification: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: ExtraPackageItem['status']) => {
    switch (status) {
      case 'included':
        return (
          <Badge variant="secondary" className="bg-success/20 text-success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Incluído
          </Badge>
        );
      case 'extra-package':
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Extra-Pacote
          </Badge>
        );
      case 'blocked':
        return (
          <Badge variant="secondary" className="bg-destructive/20 text-destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Bloqueado
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: ExtraPackageItem['type']) => {
    const configs = {
      medication: { label: "Medicamento", className: "bg-blue-100 text-blue-800" },
      exam: { label: "Exame", className: "bg-purple-100 text-purple-800" },
      material: { label: "Material", className: "bg-green-100 text-green-800" },
      procedure: { label: "Procedimento", className: "bg-orange-100 text-orange-800" }
    };
    
    const config = configs[type];
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel: ExtraPackageItem['riskLevel']) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive">Alto Risco</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-warning/20 text-warning">Médio Risco</Badge>;
      default:
        return <Badge variant="secondary" className="bg-success/20 text-success">Baixo Risco</Badge>;
    }
  };

  const filteredItems = items.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewRequest = () => {
    if (!newRequest.itemCode || !newRequest.itemDescription) {
      toast({
        title: "Erro",
        description: "Código e descrição do item são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Simular validação de pacote
    const isInPackage = Math.random() > 0.4; // 60% chance de estar fora do pacote
    const status: ExtraPackageItem['status'] = isInPackage ? 'included' : 
      (Math.random() > 0.8 ? 'blocked' : 'extra-package');

    const riskLevel: ExtraPackageItem['riskLevel'] = 
      status === 'blocked' ? 'high' :
      status === 'extra-package' ? 'medium' : 'low';

    const newItem: ExtraPackageItem = {
      id: Math.random().toString(36).substr(2, 9),
      code: newRequest.itemCode,
      description: newRequest.itemDescription,
      type: newRequest.itemType,
      packageType: "Pacote Cirúrgico Básico",
      status,
      requestedBy: "Dr. Ana Costa",
      requestDate: new Date(),
      quantity: newRequest.quantity,
      unitValue: Math.random() * 2000 + 50,
      justification: newRequest.justification,
      contractualRule: status === 'included' ? "Incluído no pacote" : "Item adicional - Requer validação",
      riskLevel
    };

    setItems(prev => [newItem, ...prev]);
    setNewRequest({ itemCode: "", itemDescription: "", itemType: "medication", quantity: 1, justification: "" });
    setIsDialogOpen(false);

    toast({
      title: "Item solicitado",
      description: `${newItem.description} foi ${status === 'included' ? 'aprovado' : status === 'blocked' ? 'bloqueado' : 'marcado como extra-pacote'}`,
      variant: status === 'included' ? "default" : "destructive"
    });
  };

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitValue), 0);
  const includedValue = items.filter(i => i.status === 'included').reduce((sum, item) => sum + (item.quantity * item.unitValue), 0);
  const extraPackageValue = items.filter(i => i.status === 'extra-package').reduce((sum, item) => sum + (item.quantity * item.unitValue), 0);
  const blockedValue = items.filter(i => i.status === 'blocked').reduce((sum, item) => sum + (item.quantity * item.unitValue), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5" />
              Incluído no Pacote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {includedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              {items.filter(i => i.status === 'included').length} itens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Extra-Pacote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              R$ {extraPackageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              {items.filter(i => i.status === 'extra-package').length} itens adicionais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5" />
              Bloqueados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {blockedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              {items.filter(i => i.status === 'blocked').length} itens bloqueados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package2 className="h-5 w-5" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              {items.length} itens totais
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar solicitações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Solicitação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemCode">Código do Item</Label>
                <Input
                  id="itemCode"
                  value={newRequest.itemCode}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, itemCode: e.target.value }))}
                  placeholder="Ex: MED-001"
                />
              </div>
              <div>
                <Label htmlFor="itemDescription">Descrição do Item</Label>
                <Input
                  id="itemDescription"
                  value={newRequest.itemDescription}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, itemDescription: e.target.value }))}
                  placeholder="Ex: Antibiótico Vancomicina"
                />
              </div>
              <div>
                <Label htmlFor="itemType">Tipo</Label>
                <Select 
                  value={newRequest.itemType} 
                  onValueChange={(value: 'medication' | 'exam' | 'material' | 'procedure') => 
                    setNewRequest(prev => ({ ...prev, itemType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medication">Medicamento</SelectItem>
                    <SelectItem value="exam">Exame</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="procedure">Procedimento</SelectItem>
                  </SelectContent>
                </Select>
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
                  placeholder="Descreva a necessidade clínica..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleNewRequest}>
                  Validar Solicitação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Solicitações Realizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Risco</TableHead>
                <TableHead className="text-center">Qtd.</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Regra Contratual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.description}</div>
                      {item.justification && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs" title={item.justification}>
                          {item.justification}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(item.type)}</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getRiskBadge(item.riskLevel)}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right font-mono">
                    R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    R$ {(item.quantity * item.unitValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{item.requestedBy}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={item.contractualRule}>
                      {item.contractualRule}
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