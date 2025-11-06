import { 
  ExpiringContract, 
  ProfitableOperator, 
  PaymentDelay, 
  UnprofitableProcedure 
} from '@/types/managerial';

export const mockExpiringContracts: ExpiringContract[] = [
  {
    id: '1',
    operatorName: 'Unimed São Paulo',
    contractValue: 2450000,
    expirationDate: '2025-12-15',
    daysUntilExpiration: 39,
    status: 'warning',
    contactPerson: 'Maria Silva',
    renewalStatus: 'in_negotiation'
  },
  {
    id: '2',
    operatorName: 'Bradesco Saúde',
    contractValue: 1850000,
    expirationDate: '2025-11-28',
    daysUntilExpiration: 22,
    status: 'critical',
    contactPerson: 'João Santos',
    renewalStatus: 'pending'
  },
  {
    id: '3',
    operatorName: 'SulAmérica',
    contractValue: 3200000,
    expirationDate: '2026-01-20',
    daysUntilExpiration: 75,
    status: 'normal',
    contactPerson: 'Ana Costa',
    renewalStatus: 'pending'
  },
  {
    id: '4',
    operatorName: 'Amil',
    contractValue: 1650000,
    expirationDate: '2025-12-05',
    daysUntilExpiration: 29,
    status: 'critical',
    contactPerson: 'Carlos Mendes',
    renewalStatus: 'pending'
  },
  {
    id: '5',
    operatorName: 'NotreDame Intermédica',
    contractValue: 2100000,
    expirationDate: '2026-02-10',
    daysUntilExpiration: 96,
    status: 'normal',
    contactPerson: 'Fernanda Lima',
    renewalStatus: 'renewed'
  }
];

export const mockProfitableOperators: ProfitableOperator[] = [
  {
    id: '1',
    name: 'SulAmérica',
    totalRevenue: 4850000,
    profitMargin: 28.5,
    marketShare: 24.2,
    trend: 'up'
  },
  {
    id: '2',
    name: 'Unimed São Paulo',
    totalRevenue: 4320000,
    profitMargin: 25.8,
    marketShare: 21.6,
    trend: 'up'
  },
  {
    id: '3',
    name: 'Bradesco Saúde',
    totalRevenue: 3890000,
    profitMargin: 22.3,
    marketShare: 19.4,
    trend: 'stable'
  },
  {
    id: '4',
    name: 'NotreDame Intermédica',
    totalRevenue: 3450000,
    profitMargin: 21.7,
    marketShare: 17.2,
    trend: 'up'
  },
  {
    id: '5',
    name: 'Amil',
    totalRevenue: 2680000,
    profitMargin: 18.9,
    marketShare: 13.4,
    trend: 'down'
  }
];

export const mockPaymentDelays: PaymentDelay[] = [
  {
    operatorId: '1',
    operatorName: 'Bradesco Saúde',
    averagePaymentDays: 78,
    pendingAmount: 850000,
    overdueCount: 23,
    status: 'critical'
  },
  {
    operatorId: '2',
    operatorName: 'Amil',
    averagePaymentDays: 65,
    pendingAmount: 620000,
    overdueCount: 18,
    status: 'critical'
  },
  {
    operatorId: '3',
    operatorName: 'Porto Seguro Saúde',
    averagePaymentDays: 52,
    pendingAmount: 380000,
    overdueCount: 12,
    status: 'delayed'
  },
  {
    operatorId: '4',
    operatorName: 'Unimed São Paulo',
    averagePaymentDays: 38,
    pendingAmount: 290000,
    overdueCount: 8,
    status: 'delayed'
  },
  {
    operatorId: '5',
    operatorName: 'SulAmérica',
    averagePaymentDays: 28,
    pendingAmount: 150000,
    overdueCount: 4,
    status: 'onTime'
  }
];

export const mockUnprofitableProcedures: UnprofitableProcedure[] = [
  {
    id: '1',
    code: '31101012',
    name: 'Artroplastia Total de Quadril',
    cost: 45000,
    reimbursement: 32000,
    loss: 13000,
    lossPercentage: 28.9,
    frequency: 12,
    totalLoss: 156000
  },
  {
    id: '2',
    code: '30611016',
    name: 'Cirurgia Cardíaca com CEC',
    cost: 68000,
    reimbursement: 52000,
    loss: 16000,
    lossPercentage: 23.5,
    frequency: 8,
    totalLoss: 128000
  },
  {
    id: '3',
    code: '31301010',
    name: 'Neurocirurgia Complexa',
    cost: 52000,
    reimbursement: 41000,
    loss: 11000,
    lossPercentage: 21.2,
    frequency: 10,
    totalLoss: 110000
  },
  {
    id: '4',
    code: '40801020',
    name: 'Transplante Renal',
    cost: 95000,
    reimbursement: 78000,
    loss: 17000,
    lossPercentage: 17.9,
    frequency: 5,
    totalLoss: 85000
  },
  {
    id: '5',
    code: '30715016',
    name: 'Cirurgia Oncológica Complexa',
    cost: 58000,
    reimbursement: 48000,
    loss: 10000,
    lossPercentage: 17.2,
    frequency: 7,
    totalLoss: 70000
  }
];
