import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractsService, Contract, contractsUtils } from '@/services/contractsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Calendar, Building2, AlertCircle } from 'lucide-react';

export function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    try {
      setLoading(true);
      setError(null);
      const data = await contractsService.getAll();
      setContracts(data);
    } catch (err) {
      console.error('Erro ao carregar contratos:', err);
      setError('Erro ao carregar contratos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const filteredContracts = (contracts || []).filter(
    (c) =>
      c?.numeroContrato?.toLowerCase().includes(search.toLowerCase()) ||
      c?.tipoContrato?.toLowerCase().includes(search.toLowerCase())
  );

  const activeContracts = filteredContracts.filter((c) => contractsUtils.isContractActive(c));
  const inactiveContracts = filteredContracts.filter((c) => !contractsUtils.isContractActive(c));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando contratos...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadContracts} className="w-full">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Contratos</h1>
        <p className="text-gray-600">Gerencie os contratos com operadoras de saúde</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Contratos</p>
                <p className="text-3xl font-bold text-gray-900">{contracts.length}</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                <p className="text-3xl font-bold text-green-600">{activeContracts.length}</p>
              </div>
              <Building2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Inativos</p>
                <p className="text-3xl font-bold text-gray-400">{inactiveContracts.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar por número do contrato ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {search ? 'Nenhum contrato encontrado com esse filtro.' : 'Nenhum contrato cadastrado.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Contracts */}
          {activeContracts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contratos Ativos</h2>
              <div className="grid gap-4">
                {activeContracts.map((contract) => (
                  <ContractCard key={contract.id} contract={contract} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          {/* Inactive Contracts */}
          {inactiveContracts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contratos Inativos</h2>
              <div className="grid gap-4">
                {inactiveContracts.map((contract) => (
                  <ContractCard key={contract.id} contract={contract} navigate={navigate} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Component for Contract Card
function ContractCard({ contract, navigate }: { contract: Contract; navigate: any }) {
  const isActive = contractsUtils.isContractActive(contract);

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all ${
        isActive ? 'border-l-4 border-l-green-500' : 'opacity-75'
      }`}
      onClick={() => navigate(`/contracts/${contract.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{contract.numeroContrato}</CardTitle>
            <CardDescription>{contract.tipoContrato}</CardDescription>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-500' : ''}>
            {contract.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Início da Vigência</p>
            <p className="font-medium">{new Date(contract.dataInicio).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Fim da Vigência</p>
            <p className="font-medium">{new Date(contract.dataFim).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Operadora</p>
            <p className="font-medium text-sm">{contract.operadoraId.substring(0, 8)}...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
