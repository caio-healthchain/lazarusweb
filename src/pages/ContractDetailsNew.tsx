import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contractsService, Contract, ContractItem, contractsUtils } from '@/services/contractsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Search, FileText, AlertCircle, Edit, Settings } from 'lucide-react';
import { EditContractItemDialog } from '@/components/contracts/EditContractItemDialog';
import { useToast } from '@/hooks/use-toast';

export function ContractDetailsNew() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contract, setContract] = useState<Contract | null>(null);
  const [items, setItems] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<ContractItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadContractDetails(id);
    }
  }, [id]);

  async function loadContractDetails(contractId: string) {
    try {
      setLoading(true);
      setError(null);
      const [contractData, itemsData] = await Promise.all([
        contractsService.getById(contractId),
        contractsService.getItems(contractId),
      ]);
      setContract(contractData);
      setItems(itemsData);
    } catch (err) {
      console.error('Erro ao carregar detalhes do contrato:', err);
      setError('Erro ao carregar detalhes do contrato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveItem(item: ContractItem) {
    try {
      // Aqui você implementaria a chamada à API para atualizar o item
      // Por enquanto, vamos apenas atualizar localmente
      const updatedItems = items.map((i) => (i.id === item.id ? item : i));
      setItems(updatedItems);
      
      toast({
        title: 'Item atualizado',
        description: 'As informações do item foram atualizadas com sucesso.',
      });
      
      // Recarregar dados do servidor
      if (id) {
        loadContractDetails(id);
      }
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o item. Tente novamente.',
        variant: 'destructive',
      });
    }
  }

  function handleEditItem(item: ContractItem) {
    setEditingItem(item);
    setDialogOpen(true);
  }

  const filteredItems = items.filter(
    (item) =>
      item.codigoTUSS.toLowerCase().includes(search.toLowerCase()) ||
      (item.descricao && item.descricao.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do contrato...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Erro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error || 'Contrato não encontrado.'}</p>
            <Button onClick={() => navigate('/contracts')} className="w-full">
              Voltar para Contratos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = contractsUtils.isContractActive(contract);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/contracts')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Contratos
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contrato {contract.numeroContrato}</h1>
            <p className="text-gray-600">{contract.tipoContrato}</p>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-500 text-lg px-4 py-2' : 'text-lg px-4 py-2'}>
            {contract.status}
          </Badge>
        </div>
      </div>

      {/* Contract Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Início da Vigência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{new Date(contract.dataInicio).toLocaleDateString('pt-BR')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Fim da Vigência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{new Date(contract.dataFim).toLocaleDateString('pt-BR')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Itens do Contrato</CardTitle>
              <CardDescription>Procedimentos, materiais e medicamentos contratados</CardDescription>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar por código TUSS ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {search ? 'Nenhum item encontrado com esse filtro.' : 'Nenhum item cadastrado neste contrato.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-100">
                    <TableHead className="font-semibold text-purple-900 w-[25%]">Descrição do procedimento</TableHead>
                    <TableHead className="font-semibold text-purple-900 w-[20%]">Materiais inclusos</TableHead>
                    <TableHead className="font-semibold text-purple-900 w-[12%]">Tipo de anestesia</TableHead>
                    <TableHead className="font-semibold text-purple-900 text-center w-[12%]">Sala cirúrgica</TableHead>
                    <TableHead className="font-semibold text-purple-900 text-center w-[15%]">Permanência</TableHead>
                    <TableHead className="font-semibold text-purple-900 text-right w-[10%]">Valor 2025</TableHead>
                    <TableHead className="font-semibold text-purple-900 text-center w-[6%]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, index) => (
                    <TableRow key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-50'}>
                      <TableCell className="align-top">
                        <div className="font-medium">
                          {item.descricao || <span className="text-gray-400">Código TUSS: {item.codigoTUSS}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        {item.materiaisInclusos && item.materiaisInclusos.length > 0 ? (
                          <div className="text-sm space-y-1">
                            {item.materiaisInclusos.map((mat, idx) => (
                              <div key={mat.id}>
                                {mat.quantidade > 1 ? `${mat.quantidade.toString().padStart(2, '0')} ` : ''}
                                {mat.descricaoMaterial}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Não Incluso</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        {item.tipoAnestesia || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell className="align-top text-center">
                        {item.tempoSalaCirurgica || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell className="align-top text-center">
                        {item.tempoPermanencia || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell className="align-top text-right font-medium">
                        {contractsUtils.formatCurrency(item.valorContratado)}
                      </TableCell>
                      <TableCell className="align-top text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditContractItemDialog
        item={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveItem}
      />
    </div>
  );
}
