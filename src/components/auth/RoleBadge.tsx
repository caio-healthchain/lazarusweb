import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/config/auth';
import { PROFILE_LABELS, UserProfile } from '@/store/rbacStore';
import { cn } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  tenant_admin: 'Administrador do Tenant',
  diretor: 'Diretor',
  medico: 'Médico',
  enfermeiro: 'Enfermeiro',
  analista: 'Analista',
  auditor: 'Auditor',
  gerencial: 'Gerencial',
};

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
  diretor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  medico: 'bg-blue-50 text-blue-700 border-blue-200',
  enfermeiro: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  analista: 'bg-amber-50 text-amber-700 border-amber-200',
  auditor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  gerencial: 'bg-pink-50 text-pink-700 border-pink-200',
};

interface RoleBadgeProps {
  role: UserRole | UserProfile | string;
  label?: string;
  className?: string;
}

const RoleBadge = ({ role, label, className }: RoleBadgeProps) => {
  const key = role.toLowerCase();
  const profileLabel = PROFILE_LABELS[key as UserProfile];

  return (
    <Badge variant="outline" className={cn(ROLE_STYLES[key] || 'bg-slate-50 text-slate-700 border-slate-200', className)}>
      {label || profileLabel || ROLE_LABELS[key] || role}
    </Badge>
  );
};

export default RoleBadge;
