import React, { useState, useEffect } from 'react';
import { ContractItem } from '@/services/contractsService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface EditContractItemDialogProps {
  item: ContractItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: ContractItem) => Promise<void>;
}

export function EditContractItemDialog({
  item,
  open,
  onOpenChange,
  onSave,
}: EditContractItemDialogProps) {
  const [formData, setFormData] = useState<Partial<ContractItem>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        descricao: item.descricao || '',
        tipoAnestesia: item.tipoAnestesia || '',
        tempoSalaCirurgica: item.tempoSalaCirurgica || '',
        tempoPermanencia: item.tempoPermanencia || '',
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    try {
      setSaving(true);
      await onSave({
        ...item,
        ...formData,
      } as ContractItem);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Item do Contrato</DialogTitle>
          <DialogDescription>
            Código TUSS: {item.codigoTUSS} | Valor: R$ {item.valorContratado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Descrição */}
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição do Procedimento</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Angioplastia 1 stent"
              rows={2}
            />
          </div>

          {/* Tipo de Anestesia */}
          <div className="grid gap-2">
            <Label htmlFor="tipoAnestesia">Tipo de Anestesia</Label>
            <Select
              value={formData.tipoAnestesia || ''}
              onValueChange={(value) => setFormData({ ...formData, tipoAnestesia: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de anestesia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Geral">Geral</SelectItem>
                <SelectItem value="Local">Local</SelectItem>
                <SelectItem value="Local + Sedação">Local + Sedação</SelectItem>
                <SelectItem value="Raqui">Raqui</SelectItem>
                <SelectItem value="Raqui + Sedação">Raqui + Sedação</SelectItem>
                <SelectItem value="Sedação">Sedação</SelectItem>
                <SelectItem value="Geral + Peridural">Geral + Peridural</SelectItem>
                <SelectItem value="Geral + Bloqueio">Geral + Bloqueio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tempo de Sala Cirúrgica */}
          <div className="grid gap-2">
            <Label htmlFor="tempoSalaCirurgica">Tempo de Sala Cirúrgica</Label>
            <Select
              value={formData.tempoSalaCirurgica || ''}
              onValueChange={(value) => setFormData({ ...formData, tempoSalaCirurgica: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tempo de sala cirúrgica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Até 1 hora">Até 1 hora</SelectItem>
                <SelectItem value="Até 2 horas">Até 2 horas</SelectItem>
                <SelectItem value="Até 3 horas">Até 3 horas</SelectItem>
                <SelectItem value="Até 4 horas">Até 4 horas</SelectItem>
                <SelectItem value="Até 5 horas">Até 5 horas</SelectItem>
                <SelectItem value="Até 6 horas">Até 6 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tempo de Permanência */}
          <div className="grid gap-2">
            <Label htmlFor="tempoPermanencia">Tempo de Permanência</Label>
            <Input
              id="tempoPermanencia"
              value={formData.tempoPermanencia || ''}
              onChange={(e) => setFormData({ ...formData, tempoPermanencia: e.target.value })}
              placeholder="Ex: Até 1 Day Clinic, Até 2 Diárias de Apartamento"
            />
            <p className="text-xs text-gray-500">
              Exemplos: "Até 1 Day Clinic", "Até 1 Diária de Apartamento", "Até 2 Diárias (1 Internação + 1 UTI)"
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
