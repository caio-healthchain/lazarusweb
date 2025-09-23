import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Brain
} from 'lucide-react';

const ManagerialDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const kpis = [
    {
      title: 'Receita Total',
      value: 'R$ 2.847.320',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'Pacientes Atendidos',
      value: '1.247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: '87.3%',
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      color: 'text-orange-600'
    },
    {
      title: 'Cirurgias Realizadas',
      value: '342',
      change: '+15.7%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-purple-600'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Estoque Baixo - UTI',
      description: 'Medicamentos críticos com estoque abaixo do mínimo',
      time: '2h atrás'
    },
    {
      id: 2,
      type: 'success',
      title: 'Meta de Satisfação Atingida',
      description: 'NPS do mês superou a meta de 85%',
      time: '4h atrás'
    },
    {
      id: 3,
      type: 'info',
      title: 'Novo Contrato Assinado',
      description: 'Convênio XYZ renovado por mais 12 meses',
      time: '1d atrás'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião Diretoria',
      time: '14:00',
      date: 'Hoje',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Auditoria Externa',
      time: '09:00',
      date: 'Amanhã',
      type: 'audit'
    },
    {
      id: 3,
      title: 'Treinamento Equipe',
      time: '16:00',
      date: 'Sex',
      type: 'training'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Gerencial</h1>
          <p className="text-gray-600 mt-1">Visão executiva do hospital</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat com IA
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ml-1 ${
                        kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Performance</CardTitle>
              <CardDescription>
                Métricas principais dos últimos {selectedPeriod === '7d' ? '7 dias' : selectedPeriod === '30d' ? '30 dias' : '90 dias'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="revenue">Receita</TabsTrigger>
                  <TabsTrigger value="patients">Pacientes</TabsTrigger>
                  <TabsTrigger value="operations">Operações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="revenue" className="mt-6">
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Gráfico de receita será implementado</p>
                      <p className="text-sm text-gray-500 mt-2">Integração com Recharts em desenvolvimento</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="patients" className="mt-6">
                  <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-600">Análise de pacientes será implementada</p>
                      <p className="text-sm text-gray-500 mt-2">Dashboard interativo em desenvolvimento</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="operations" className="mt-6">
                  <div className="h-64 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                      <p className="text-gray-600">Métricas operacionais serão implementadas</p>
                      <p className="text-sm text-gray-500 mt-2">Análise em tempo real em desenvolvimento</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                Alertas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-600">{event.date} às {event.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                Consultar IA
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Ver Equipes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerialDashboard;
