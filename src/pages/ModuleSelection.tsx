import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  ClipboardCheck, 
  Brain,
  ArrowRight,
  Shield,
  Hospital,
  FileCheck,
  Layers,
  Heart,
  Stethoscope,
  Scale,
  Settings,
  Package
} from 'lucide-react';

const ModuleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const workflowModules = [
    {
      id: 'control-tower',
      title: 'Control Tower',
      description: 'Vis\u00e3o completa do workflow de contas hospitalares em tempo real',
      icon: Layers,
      color: 'bg-gradient-to-r from-purple-600 to-blue-600',
      features: [
        'Kanban de contas por etapa',
        'SLA e prioridades',
        'Rastreamento de respons\u00e1veis',
        'M\u00e9tricas em tempo real'
      ],
      route: '/control-tower',
      available: true,
      highlight: true
    },
    {
      id: 'frente-administrativa',
      title: 'Frente Administrativa',
      description: 'Valida\u00e7\u00e3o de documenta\u00e7\u00e3o, elegibilidade e autoriza\u00e7\u00f5es',
      icon: ClipboardCheck,
      color: 'bg-purple-600',
      features: [
        'Checklist de documentos',
        'Valida\u00e7\u00e3o de elegibilidade',
        'Autoriza\u00e7\u00f5es pr\u00e9vias',
        'Auditoria administrativa'
      ],
      route: '/frente-administrativa',
      available: true,
      highlight: false
    },
    {
      id: 'frente-enfermagem',
      title: 'Frente de Enfermagem',
      description: 'Complemento da conta com materiais, medicamentos e prescri\u00e7\u00f5es',
      icon: Heart,
      color: 'bg-blue-600',
      features: [
        'Valida\u00e7\u00e3o de materiais/OPME',
        'Confer\u00eancia de medicamentos',
        'Lotes e validades',
        'Auditoria de enfermagem'
      ],
      route: '/frente-enfermagem',
      available: true,
      highlight: false
    },
    {
      id: 'frente-medica',
      title: 'Frente M\u00e9dica',
      description: 'Revis\u00e3o cl\u00ednica, justificativas e finaliza\u00e7\u00e3o da conta',
      icon: Stethoscope,
      color: 'bg-emerald-600',
      features: [
        'Revis\u00e3o de procedimentos',
        'Justificativa cl\u00ednica',
        'Enquadramento de porte',
        'Auditoria m\u00e9dica'
      ],
      route: '/frente-medica',
      available: true,
      highlight: false
    },
    {
      id: 'glosas',
      title: 'Glosas e Laudos',
      description: 'Gest\u00e3o de glosas, aceite, recurso e gera\u00e7\u00e3o de laudos',
      icon: Scale,
      color: 'bg-red-600',
      features: [
        'Aceite ou recurso de glosas',
        'Justificativa cl\u00ednica',
        'Gera\u00e7\u00e3o de laudos',
        'Acompanhamento de recursos'
      ],
      route: '/glosas',
      available: true,
      highlight: false
    },
    {
      id: 'backoffice',
      title: 'Backoffice',
      description: 'Gest\u00e3o de contratos, fornecedores e recomenda\u00e7\u00f5es inteligentes',
      icon: Settings,
      color: 'bg-gray-800',
      features: [
        'Gest\u00e3o de contratos',
        'Mapeamento de fornecedores',
        'Recomenda\u00e7\u00e3o de operadoras',
        'An\u00e1lise de custos'
      ],
      route: '/backoffice',
      available: true,
      highlight: false
    }
  ];

  const legacyModules = [
    {
      id: 'auditor',
      title: 'Auditor (Legado)',
      description: 'Sistema de auditoria e enquadramento de porte cir\u00fargico',
      icon: ClipboardCheck,
      color: 'bg-blue-500',
      features: ['Lista de pacientes', 'Enquadramento de porte', 'Relat\u00f3rios de auditoria'],
      route: '/audits',
      available: true,
      highlight: false
    },
    {
      id: 'gerencial',
      title: 'Gerencial',
      description: 'Dashboard executivo e assistente inteligente',
      icon: BarChart3,
      color: 'bg-emerald-500',
      features: ['Dashboard executivo', 'Chat com IA', 'An\u00e1lise de contratos'],
      route: '/gerencial',
      available: true,
      highlight: false
    },
    {
      id: 'analista',
      title: 'Analista (Legado)',
      description: 'Checklist de documenta\u00e7\u00e3o obrigat\u00f3ria',
      icon: FileCheck,
      color: 'bg-purple-500',
      features: ['Checklist de documentos', 'Status de conformidade', 'Gest\u00e3o de pend\u00eancias'],
      route: '/analista',
      available: true,
      highlight: false
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
                Lazarus - Hospital Sagrada Fam\u00edlia
              </h1>
              <p className="text-sm text-gray-500">
                Plataforma Integrada de Gest\u00e3o Hospitalar
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workflow de Contas Hospitalares
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gerencie todo o ciclo de vida da conta hospitalar, da entrada \u00e0 finaliza\u00e7\u00e3o
          </p>
        </div>

        {/* Workflow Modules */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {workflowModules.map((module) => {
            const IconComponent = module.icon;
            
            return (
              <Card 
                key={module.id} 
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg ${
                  module.highlight ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 ${module.color}`} />
                {module.highlight && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-600 text-white">Destaque</Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-11 h-11 ${module.color} rounded-lg`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm mt-0.5">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-1.5">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <Badge className="bg-emerald-100 text-emerald-800" variant="secondary">
                        Dispon\u00edvel
                      </Badge>
                      
                      <Button
                        onClick={() => handleModuleSelect(module.route)}
                        className={`${module.color} hover:opacity-90 transition-opacity`}
                        size="sm"
                      >
                        Acessar
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Legacy Modules */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-500 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" /> M\u00f3dulos Originais
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {legacyModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card 
                  key={module.id} 
                  className="hover:shadow-md transition-all duration-200 border border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`flex items-center justify-center w-9 h-9 ${module.color} rounded-lg`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{module.title}</h3>
                        <p className="text-xs text-gray-500">{module.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleModuleSelect(module.route)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Acessar <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Powered by AI \u2022 Workflow Integrado \u2022 Audit Trail Completo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelection;
