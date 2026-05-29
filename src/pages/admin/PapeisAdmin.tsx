import { CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import RoleBadge from '@/components/auth/RoleBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CANONICAL_ROLES = [
  {
    code: 'GERENCIAL',
    name: 'Gestor/Diretor',
    frontendProfile: 'gerencial',
    description: 'Acesso ao dashboard executivo, indicadores financeiros e chat de IA gerencial.',
    modules: ['Painel Gerencial', 'Assistente IA'],
    permissions: ['viewDashboard', 'accessAI', 'viewReports', 'manageContracts'],
  },
  {
    code: 'AUDITOR',
    name: 'Auditor Médico',
    frontendProfile: 'auditor',
    description: 'Acesso às filas e rotinas de auditoria médica, enquadramento e aprovação/rejeição.',
    modules: ['Central de Contas', 'Frentes Operacionais', 'Auditor Legado', 'Glosas'],
    permissions: ['viewPatients', 'auditProcedures', 'approveReject', 'viewReports'],
  },
  {
    code: 'ANALISTA',
    name: 'Analista de Conformidade',
    frontendProfile: 'analista',
    description: 'Acesso ao checklist documental, validação de XMLs e pendências operacionais.',
    modules: ['Frente Administrativa', 'Glosas', 'Backoffice', 'Analista Legado'],
    permissions: ['validateXML', 'checkDocuments', 'managePendencies'],
  },
  {
    code: 'ADMIN',
    name: 'Administrador',
    frontendProfile: 'admin',
    description: 'Papel reservado para administração de IAM, parâmetros globais e futuras rotas /admin.',
    modules: ['Todos os módulos', 'Administração IAM'],
    permissions: ['manageUsers', 'manageRoles', 'manageTenants', 'viewAuditLog'],
  },
];

const PapeisAdmin = () => (
  <div className="min-h-screen bg-slate-50 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white border shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm uppercase tracking-[0.18em]">
            <LockKeyhole className="h-4 w-4" />
            Administração IAM
          </div>
          <h1 className="text-3xl font-bold text-slate-950 mt-2">Papéis canônicos</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Esta visão read-only consolida os papéis do MVP IAM usados pelo `ms-users` e pelo RBAC do `lazarusweb`, sem expor segredos ou permitir alteração operacional direta.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-emerald-50 text-emerald-700 border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          Read-only
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {CANONICAL_ROLES.map((role) => (
          <Card key={role.code}>
            <CardHeader>
              <RoleBadge role={role.frontendProfile} label={role.name} className="w-fit" />
              <CardTitle className="text-lg">{role.code}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs uppercase text-muted-foreground mb-2">Módulos</p>
              <div className="flex flex-wrap gap-2">
                {role.modules.map((module) => <Badge key={module} variant="secondary">{module}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de permissões</CardTitle>
          <CardDescription>Referência funcional para evolução futura de administração de usuários e equipes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Papel</TableHead>
                <TableHead>Perfil frontend</TableHead>
                <TableHead>Permissões associadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CANONICAL_ROLES.map((role) => (
                <TableRow key={role.code}>
                  <TableCell className="font-mono text-sm">{role.code}</TableCell>
                  <TableCell><RoleBadge role={role.frontendProfile} /></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="bg-white">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default PapeisAdmin;
