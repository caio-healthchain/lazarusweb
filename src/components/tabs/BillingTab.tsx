import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Calculator, Download } from "lucide-react";

interface BillingTabProps {
  patient?: any;
  billing?: any[];
}

export function BillingTab({ patient, billing }: BillingTabProps) {
  const billingItems = [
    {
      id: "1",
      description: "Colecistectomia laparoscópica",
      code: "31.602.31-5", 
      port: 4,
      unitValue: 2847.35,
      quantity: 1,
      total: 2847.35
    },
    {
      id: "2",
      description: "Apendicectomia laparoscópica", 
      code: "33.405.70-2",
      port: 3,
      unitValue: 1895.60,
      quantity: 1,
      total: 1895.60
    },
    {
      id: "3",
      description: "Ressecção de tumor de cólon",
      code: "40.302.16-0",
      port: 6,
      unitValue: 4271.02,
      quantity: 1,
      total: 4271.02
    },
    {
      id: "4",
      description: "Taxa de sala cirúrgica",
      code: "SALA-01",
      port: null,
      unitValue: 850.00,
      quantity: 3,
      total: 2550.00
    },
    {
      id: "5",
      description: "Material cirúrgico descartável",
      code: "MAT-001",
      port: null,
      unitValue: 320.50,
      quantity: 1,
      total: 320.50
    }
  ];

  const totalGeral = billingItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">R$ {(totalGeral - (totalGeral * 0.05)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxas:</span>
                <span className="font-medium">R$ {(totalGeral * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Geral:</span>
                  <span className="font-bold text-lg text-primary">R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Convênio:</span>
                <span className="font-medium">Unimed Nacional</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cobertura:</span>
                <Badge variant="secondary" className="bg-success text-success-foreground">100%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline">Aguardando Autorização</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Pré-fatura
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Relatório de Custos
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Guia TISS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Itens de Faturamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Porte</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-center">Qtd.</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">
                    {item.port ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {item.port}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 border-border font-medium">
                <TableCell colSpan={5} className="text-right">Total Geral:</TableCell>
                <TableCell className="text-right font-bold text-primary">
                  R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}