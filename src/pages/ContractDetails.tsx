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
import { ArrowLeft, Search, FileText, AlertCircle } from 'lucide-react';

export function ContractDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [items, setItems] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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
                  <TableRow>
                    <TableHead>Código TUSS</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor Contratado</TableHead>
                    <TableHead className="text-right">Valor Máximo</TableHead>
                    <TableHead className="text-right">Qtd. Máxima</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono font-medium">{item.codigoTUSS}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={item.descricao || 'Sem descrição'}>
                          {item.descricao || <span className="text-gray-400">Sem descrição</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.tipoItem}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {contractsUtils.formatCurrency(item.valorContratado)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.valorMaximo ? contractsUtils.formatCurrency(item.valorMaximo) : '-'}
                      </TableCell>
                      <TableCell className="text-right">{item.quantidadeMaxima || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
