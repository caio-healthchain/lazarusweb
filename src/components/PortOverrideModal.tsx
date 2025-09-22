import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Edit } from "lucide-react";

interface Procedure {
  id: string;
  code: string;
  name: string;
  suggestedPort: number;
  currentPort: number;
  status: string;
  isEdited: boolean;
}

interface PortOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: Procedure | null;
  onConfirm: (newPort: number, justification: string) => void;
}

export function PortOverrideModal({ isOpen, onClose, procedure, onConfirm }: PortOverrideModalProps) {
  const [newPort, setNewPort] = useState<string>("");
  const [justification, setJustification] = useState("");

  if (!procedure) return null;

  const handleSubmit = () => {
    if (!newPort || !justification.trim()) return;
    
    onConfirm(parseInt(newPort), justification);
    setNewPort("");
    setJustification("");
  };

  const handleClose = () => {
    setNewPort("");
    setJustification("");
    onClose();
  };

  const isFormValid = newPort && justification.trim() && parseInt(newPort) !== procedure.currentPort;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Porte Cirúrgico
          </DialogTitle>
          <DialogDescription>
            Altere o porte cirúrgico e forneça uma justificativa para a mudança.
            Esta ação será registrada no log de auditoria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Procedimento */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Procedimento</Label>
              <p className="font-medium">{procedure.name}</p>
              <p className="text-sm text-muted-foreground font-mono">{procedure.code}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Porte Sugerido</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {procedure.suggestedPort}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Porte Atual</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={procedure.isEdited ? "bg-warning/20 text-warning border-warning/30" : ""}>
                    {procedure.currentPort}
                    {procedure.isEdited && <AlertTriangle className="h-3 w-3 ml-1" />}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Novo Porte */}
          <div className="space-y-2">
            <Label htmlFor="newPort">Novo Porte *</Label>
            <Select value={newPort} onValueChange={setNewPort}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo porte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Porte 1</SelectItem>
                <SelectItem value="2">Porte 2</SelectItem>
                <SelectItem value="3">Porte 3</SelectItem>
                <SelectItem value="4">Porte 4</SelectItem>
                <SelectItem value="5">Porte 5</SelectItem>
                <SelectItem value="6">Porte 6</SelectItem>
                <SelectItem value="7">Porte 7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Justificativa */}
          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa *</Label>
            <Textarea
              id="justification"
              placeholder="Descreva o motivo da alteração do porte cirúrgico..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Mínimo 10 caracteres. Esta justificativa será registrada no log de auditoria.
            </p>
          </div>

          {/* Alerta */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning">Atenção</h4>
                <p className="text-sm text-warning/80 mt-1">
                  Esta alteração será registrada permanentemente no sistema de auditoria 
                  e não poderá ser removida posteriormente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid || justification.length < 10}
            className="bg-warning hover:bg-warning/90 text-warning-foreground"
          >
            <Edit className="h-4 w-4 mr-2" />
            Confirmar Alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}