import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  MessageSquare, 
  ClipboardCheck, 
  Users, 
  TrendingUp, 
  Brain,
  ArrowRight,
  Shield,
  Hospital,
  FileCheck
} from 'lucide-react';

const ModuleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const modules = [
    {
      id: 'auditor',
      title: 'Módulo Auditor',
      description: 'Sistema de auditoria e enquadramento de porte cirúrgico',
      icon: ClipboardCheck,
      color: 'bg-blue-600',
      features: [
        'Lista de pacientes',
        'Enquadramento de porte',
        'Relatórios de auditoria',
        'Validação de procedimentos'
      ],
      route: '/audits',
      available: true
    },
    {
      id: 'gerencial',
      title: 'Módulo Gerencial',
      description: 'Dashboard executivo e assistente inteligente para gestão hospitalar',
      icon: BarChart3,
      color: 'bg-emerald-600',
      features: [
        'Dashboard executivo',
        'Chat com IA especializada',
        'Análise de contratos',
        'Insights de gestão'
      ],
      route: '/gerencial',
      available: true
    },
    {
      id: 'analista',
      title: 'Módulo Analista',
      description: 'Checklist de documentação obrigatória e conformidade',
      icon: FileCheck,
      color: 'bg-purple-600',
      features: [
        'Checklist de documentos',
        'Status de conformidade',
        'Validação de XMLs',
        'Gestão de pendências'
      ],
      route: '/analista',
      available: true
    }
  ];

  const handleModuleSelect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                HealthChain Solutions
              </h1>
              <p className="text-sm text-gray-500">
                Plataforma Integrada de Gestão Hospitalar
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <span className="text-white font-medium text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selecione um Módulo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o módulo que melhor atende às suas necessidades de trabalho
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modules.map((module) => {
            const IconComponent = module.icon;
            
            return (
              <Card 
                key={module.id} 
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 ${module.color}`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-12 h-12 ${module.color} rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Badge 
                        variant={module.available ? "default" : "secondary"}
                        className={module.available ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        {module.available ? "Disponível" : "Em breve"}
                      </Badge>
                      
                      <Button
                        onClick={() => handleModuleSelect(module.route)}
                        disabled={!module.available}
                        className={`${module.color} hover:opacity-90 transition-opacity`}
                      >
                        Acessar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <Brain className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Powered by AI • Seguro • Escalável
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelection;
