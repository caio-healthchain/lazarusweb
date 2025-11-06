// Tipos para o Dashboard Gerencial

export interface ExpiringContract {
  id: string;
  operatorName: string;
  contractValue: number;
  expirationDate: string;
  daysUntilExpiration: number;
  status: 'critical' | 'warning' | 'normal';
  contactPerson?: string;
  renewalStatus?: 'pending' | 'in_negotiation' | 'renewed';
}

export interface ProfitableOperator {
  id: string;
  name: string;
  totalRevenue: number;
  profitMargin: number;
  marketShare: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PaymentDelay {
  operatorId: string;
  operatorName: string;
  averagePaymentDays: number;
  pendingAmount: number;
  overdueCount: number;
  status: 'onTime' | 'delayed' | 'critical';
}

export interface UnprofitableProcedure {
  id: string;
  code: string;
  name: string;
  cost: number;
  reimbursement: number;
  loss: number;
  lossPercentage: number;
  frequency: number;
  totalLoss: number;
}

export interface OperationalMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}
