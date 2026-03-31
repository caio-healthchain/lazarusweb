import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, User, Building2, AlertTriangle, ArrowRight, 
  FileText, Stethoscope, Calendar
} from 'lucide-react';
import { WorkflowAccount, getStatusLabel, getStatusColor, getPrioridadeColor } from '@/data/workflowMockData';

interface AccountCardProps {
  account: WorkflowAccount;
  basePath: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const AccountCard = ({ account, basePath }: AccountCardProps) => {
  const navigate = useNavigate();

  const docsTotal = account.documentos.length;
  const docsValidados = account.documentos.filter(d => d.status === 'validado').length;
  const docsProgress = docsTotal > 0 ? Math.round((docsValidados / docsTotal) * 100) : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4" style={{
      borderLeftColor: account.prioridade === 'critica' ? '#ef4444' : 
                       account.prioridade === 'alta' ? '#f97316' : 
                       account.prioridade === 'media' ? '#eab308' : '#9ca3af'
    }}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-gray-900">{account.id}</span>
              <Badge className={getStatusColor(account.status)} variant="secondary">
                {getStatusLabel(account.status)}
              </Badge>
              <Badge className={getPrioridadeColor(account.prioridade)} variant="secondary">
                {account.prioridade.charAt(0).toUpperCase() + account.prioridade.slice(1)}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{account.paciente}</h3>
            <p className="text-sm text-gray-500">{account.procedimentoPrincipal}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{formatCurrency(account.valorTotal)}</p>
            {account.valorGlosado > 0 && (
              <p className="text-sm text-red-600 font-medium">
                Glosa: {formatCurrency(account.valorGlosado)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Building2 className="h-3.5 w-3.5 text-blue-500" />
            <span>{account.operadora}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Stethoscope className="h-3.5 w-3.5 text-emerald-500" />
            <span>{account.medicoResponsavel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="h-3.5 w-3.5 text-purple-500" />
            <span>{new Date(account.dataInternacao).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <User className="h-3.5 w-3.5 text-orange-500" />
            <span>{account.owner}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Docs: {docsValidados}/{docsTotal}</span>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all" 
                  style={{ width: `${docsProgress}%` }} 
                />
              </div>
            </div>
            {account.slaRestante > 0 && (
              <div className={`flex items-center gap-1.5 text-xs ${
                account.slaRestante < 12 ? 'text-red-600' : 
                account.slaRestante < 24 ? 'text-orange-600' : 'text-gray-500'
              }`}>
                <Clock className="h-3.5 w-3.5" />
                <span>SLA: {account.slaRestante}h restantes</span>
                {account.slaRestante < 12 && <AlertTriangle className="h-3.5 w-3.5" />}
              </div>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate(`${basePath}/${account.id}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Abrir
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
