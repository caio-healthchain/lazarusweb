import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BookOpenCheck,
  DatabaseZap,
  GitBranch,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tags,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  CanonicalItem,
  CodeSystem,
  CreateCanonicalItemRequest,
  CreateCodeSystemRequest,
  ItemCategory,
  ItemGranularity,
  RecordStatus,
  TerminologyKind,
  categoryLabels,
  granularityLabels,
  statusLabels,
  terminologyKindLabels,
  terminologyService,
} from '@/services/terminologyService';

const CATEGORY_OPTIONS = Object.keys(categoryLabels) as ItemCategory[];
const GRANULARITY_OPTIONS = Object.keys(granularityLabels) as ItemGranularity[];
const STATUS_OPTIONS = Object.keys(statusLabels) as RecordStatus[];
const KIND_OPTIONS = Object.keys(terminologyKindLabels) as TerminologyKind[];

const statusBadgeClass: Record<RecordStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-slate-50 text-slate-600 border-slate-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  RETIRED: 'bg-rose-50 text-rose-700 border-rose-200',
};

const initialItemForm: CreateCanonicalItemRequest = {
  name: '',
  category: 'PROCEDURE',
  granularity: 'ITEM',
  status: 'ACTIVE',
  description: '',
};

const initialCodeSystemForm: CreateCodeSystemRequest = {
  slug: '',
  name: '',
  version: '',
  kind: 'NATIONAL',
  authority: '',
  description: '',
  status: 'ACTIVE',
};

const normalizeSlug = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const metricFormatter = new Intl.NumberFormat('pt-BR');

const Terminologies = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<CanonicalItem[]>([]);
  const [codeSystems, setCodeSystems] = useState<CodeSystem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RecordStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [savingItem, setSavingItem] = useState(false);
  const [savingCodeSystem, setSavingCodeSystem] = useState(false);
  const [savingAlias, setSavingAlias] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<CreateCanonicalItemRequest>(initialItemForm);
  const [codeSystemForm, setCodeSystemForm] = useState<CreateCodeSystemRequest>(initialCodeSystemForm);
  const [aliasForm, setAliasForm] = useState({ alias: '', source: 'Guia XML', confidence: '0.85' });

  const selectedItem = useMemo(
    () => items.find(item => item.id === selectedItemId) || items[0],
    [items, selectedItemId]
  );

  const activeSystems = useMemo(
    () => codeSystems.filter(system => system.status === 'ACTIVE').length,
    [codeSystems]
  );

  const aliasCount = useMemo(
    () => items.reduce((total, item) => total + item.aliases.length, 0),
    [items]
  );

  const loadTerminologies = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        q: searchTerm || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        category: categoryFilter === 'ALL' ? undefined : categoryFilter,
      };

      const [nextItems, nextCodeSystems] = await Promise.all([
        searchTerm ? terminologyService.searchCanonicalItems(searchTerm) : terminologyService.listCanonicalItems(params),
        terminologyService.listCodeSystems({ status: statusFilter === 'ALL' ? undefined : statusFilter }),
      ]);

      const filteredItems = searchTerm
        ? nextItems.filter(item => {
            const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
            const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
            return matchesStatus && matchesCategory;
          })
        : nextItems;

      setItems(filteredItems);
      setCodeSystems(nextCodeSystems);
      setSelectedItemId(current => filteredItems.some(item => item.id === current) ? current : filteredItems[0]?.id || '');
    } catch (loadError) {
      console.error('Erro ao carregar terminologias:', loadError);
      setError('Não foi possível carregar os dados de Terminologia. Verifique a URL do serviço e o contexto do hospital ativo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerminologies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadTerminologies();
  };

  const handleCreateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!itemForm.name.trim()) {
      toast({ title: 'Informe o nome canônico', description: 'O item precisa de uma descrição oficial para ser criado.' });
      return;
    }

    setSavingItem(true);
    try {
      const created = await terminologyService.createCanonicalItem({
        ...itemForm,
        name: itemForm.name.trim(),
        description: itemForm.description?.trim() || undefined,
      });
      setItems(current => [created, ...current]);
      setSelectedItemId(created.id);
      setItemForm(initialItemForm);
      toast({ title: 'Item canônico criado', description: `${created.name} foi adicionado ao catálogo.` });
    } catch (saveError) {
      console.error('Erro ao criar item canônico:', saveError);
      toast({ title: 'Erro ao criar item', description: 'Valide os campos e tente novamente.', variant: 'destructive' });
    } finally {
      setSavingItem(false);
    }
  };

  const handleCreateCodeSystem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!codeSystemForm.name.trim() || !codeSystemForm.version.trim()) {
      toast({ title: 'Dados obrigatórios', description: 'Nome e versão são necessários para cadastrar o sistema de códigos.' });
      return;
    }

    setSavingCodeSystem(true);
    try {
      const slug = codeSystemForm.slug.trim() || normalizeSlug(`${codeSystemForm.name}-${codeSystemForm.version}`);
      const created = await terminologyService.createCodeSystem({
        ...codeSystemForm,
        slug,
        name: codeSystemForm.name.trim(),
        version: codeSystemForm.version.trim(),
        authority: codeSystemForm.authority?.trim() || undefined,
        description: codeSystemForm.description?.trim() || undefined,
      });
      setCodeSystems(current => [created, ...current]);
      setCodeSystemForm(initialCodeSystemForm);
      toast({ title: 'Sistema de códigos criado', description: `${created.name} ${created.version} foi registrado.` });
    } catch (saveError) {
      console.error('Erro ao criar sistema de códigos:', saveError);
      toast({ title: 'Erro ao criar sistema', description: 'Valide os campos e tente novamente.', variant: 'destructive' });
    } finally {
      setSavingCodeSystem(false);
    }
  };

  const handleAddAlias = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItem || !aliasForm.alias.trim()) {
      toast({ title: 'Selecione um item e informe o alias', description: 'O alias representa uma variação textual encontrada nas guias ou contas.' });
      return;
    }

    setSavingAlias(true);
    try {
      const updated = await terminologyService.addAlias(selectedItem.id, {
        alias: aliasForm.alias.trim(),
        source: aliasForm.source.trim() || undefined,
        status: 'ACTIVE',
        confidence: Number(aliasForm.confidence) || 0.85,
      });
      setItems(current => current.map(item => item.id === updated.id ? updated : item));
      setAliasForm({ alias: '', source: 'Guia XML', confidence: '0.85' });
      toast({ title: 'Alias registrado', description: 'A variação foi associada ao item canônico selecionado.' });
    } catch (saveError) {
      console.error('Erro ao adicionar alias:', saveError);
      toast({ title: 'Erro ao adicionar alias', description: 'Não foi possível enriquecer o item selecionado.', variant: 'destructive' });
    } finally {
      setSavingAlias(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
              <Sparkles className="h-4 w-4" />
              PRD-001 · Terminologia & Catálogo
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Administração de Terminologias</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Governança tenant-aware para sistemas de códigos, itens canônicos e aliases usados na auditoria de guias,
              contas fechadas e validações contratuais. A tela já está preparada para consumir o <strong>ms-core-terminologies</strong>
              por variável de ambiente.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
              {terminologyService.isDemoMode() ? 'Modo demo ativo' : 'Integração real ativa'}
            </Badge>
            <Button variant="outline" onClick={loadTerminologies} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Atualizar
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Falha na integração de Terminologia</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Itens canônicos</CardDescription>
              <CardTitle className="text-2xl">{metricFormatter.format(items.length)}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500">Unidades normalizadas para auditoria e conciliação.</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sistemas ativos</CardDescription>
              <CardTitle className="text-2xl">{metricFormatter.format(activeSystems)}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500">TUSS, CBHPM, internos e catálogos de operadora.</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Aliases mapeados</CardDescription>
              <CardTitle className="text-2xl">{metricFormatter.format(aliasCount)}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500">Variações textuais vindas de XML, conta e contrato.</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Base URL</CardDescription>
              <CardTitle className="truncate text-sm">{terminologyService.getBaseUrl()}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500">Configure por <code>VITE_TERMINOLOGY_API_BASE_URL</code>.</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-600" />
              Busca operacional
            </CardTitle>
            <CardDescription>
              Pesquise por nome canônico, alias, código ou descrição e refine por categoria e status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]" onSubmit={handleSearch}>
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Ex.: apendicectomia, 31101192, OPME..."
              />
              <select
                value={categoryFilter}
                onChange={event => setCategoryFilter(event.target.value as ItemCategory | 'ALL')}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="ALL">Todas categorias</option>
                {CATEGORY_OPTIONS.map(category => <option key={category} value={category}>{categoryLabels[category]}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={event => setStatusFilter(event.target.value as RecordStatus | 'ALL')}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="ALL">Todos status</option>
                {STATUS_OPTIONS.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
              </select>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5 text-purple-600" />
                  Catálogo canônico
                </CardTitle>
                <CardDescription>
                  Itens normalizados que conectam guias, procedimentos, materiais, pacotes, contratos e regras de auditoria.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed py-12 text-slate-500">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando terminologias...
                  </div>
                ) : items.length === 0 ? (
                  <div className="rounded-lg border border-dashed py-12 text-center text-sm text-slate-500">
                    Nenhum item canônico encontrado para os filtros informados.
                  </div>
                ) : (
                  items.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItemId(item.id)}
                      className={`w-full rounded-xl border bg-white p-4 text-left transition hover:border-purple-300 hover:shadow-sm ${selectedItem?.id === item.id ? 'border-purple-400 ring-2 ring-purple-100' : 'border-slate-200'}`}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-950">{item.name}</h3>
                            <Badge variant="outline" className={statusBadgeClass[item.status]}>{statusLabels[item.status]}</Badge>
                            <Badge variant="secondary">{categoryLabels[item.category]}</Badge>
                            <Badge variant="outline">{granularityLabels[item.granularity]}</Badge>
                          </div>
                          {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
                        </div>
                        <div className="flex gap-2 text-xs text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2 py-1">{item.codes.length} códigos</span>
                          <span className="rounded-full bg-slate-100 px-2 py-1">{item.aliases.length} aliases</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DatabaseZap className="h-5 w-5 text-purple-600" />
                  Sistemas de códigos
                </CardTitle>
                <CardDescription>
                  Bases oficiais, comerciais, internas e por operadora disponíveis para relacionamento com o catálogo canônico.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {codeSystems.map(system => (
                  <div key={system.id} className="rounded-xl border bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-950">{system.name}</h3>
                        <p className="text-xs text-slate-500">{system.slug} · versão {system.version}</p>
                      </div>
                      <Badge variant="outline" className={statusBadgeClass[system.status]}>{statusLabels[system.status]}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{system.description || 'Sem descrição cadastrada.'}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge variant="secondary">{terminologyKindLabels[system.kind]}</Badge>
                      {system.authority && <Badge variant="outline">{system.authority}</Badge>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-600" />
                  Novo item canônico
                </CardTitle>
                <CardDescription>Cadastre a unidade de significado que será usada para conciliar códigos e aliases.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCreateItem}>
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Nome canônico</Label>
                    <Input id="item-name" value={itemForm.name} onChange={event => setItemForm({ ...itemForm, name: event.target.value })} placeholder="Ex.: Colecistectomia videolaparoscópica" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <select value={itemForm.category} onChange={event => setItemForm({ ...itemForm, category: event.target.value as ItemCategory })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        {CATEGORY_OPTIONS.map(category => <option key={category} value={category}>{categoryLabels[category]}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Granularidade</Label>
                      <select value={itemForm.granularity} onChange={event => setItemForm({ ...itemForm, granularity: event.target.value as ItemGranularity })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        {GRANULARITY_OPTIONS.map(granularity => <option key={granularity} value={granularity}>{granularityLabels[granularity]}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea value={itemForm.description} onChange={event => setItemForm({ ...itemForm, description: event.target.value })} placeholder="Explique o uso operacional e a fronteira semântica do item." />
                  </div>
                  <Button className="w-full" type="submit" disabled={savingItem}>
                    {savingItem ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Criar item
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-purple-600" />
                  Enriquecer item selecionado
                </CardTitle>
                <CardDescription>{selectedItem ? selectedItem.name : 'Selecione um item canônico para adicionar aliases.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItem && (
                  <div className="rounded-lg bg-slate-100 p-3 text-sm">
                    <p className="font-medium text-slate-900">Aliases atuais</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedItem.aliases.length ? selectedItem.aliases.map(alias => (
                        <Badge key={alias.id} variant="outline" className="bg-white">{alias.alias}</Badge>
                      )) : <span className="text-xs text-slate-500">Nenhum alias cadastrado.</span>}
                    </div>
                  </div>
                )}
                <form className="space-y-3" onSubmit={handleAddAlias}>
                  <div className="space-y-2">
                    <Label>Alias ou descrição alternativa</Label>
                    <Input value={aliasForm.alias} onChange={event => setAliasForm({ ...aliasForm, alias: event.target.value })} placeholder="Ex.: retirada da vesícula por vídeo" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fonte</Label>
                      <Input value={aliasForm.source} onChange={event => setAliasForm({ ...aliasForm, source: event.target.value })} placeholder="Guia XML" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confiança</Label>
                      <Input type="number" min="0" max="1" step="0.01" value={aliasForm.confidence} onChange={event => setAliasForm({ ...aliasForm, confidence: event.target.value })} />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" type="submit" disabled={savingAlias || !selectedItem}>
                    {savingAlias ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitBranch className="mr-2 h-4 w-4" />}
                    Adicionar alias
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Novo sistema de códigos
                </CardTitle>
                <CardDescription>Registre uma base oficial, comercial, interna, de hospital ou operadora.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleCreateCodeSystem}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input value={codeSystemForm.name} onChange={event => setCodeSystemForm({ ...codeSystemForm, name: event.target.value })} placeholder="TUSS" />
                    </div>
                    <div className="space-y-2">
                      <Label>Versão</Label>
                      <Input value={codeSystemForm.version} onChange={event => setCodeSystemForm({ ...codeSystemForm, version: event.target.value })} placeholder="2025.01" />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input value={codeSystemForm.slug} onChange={event => setCodeSystemForm({ ...codeSystemForm, slug: normalizeSlug(event.target.value) })} placeholder="gerado automaticamente" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <select value={codeSystemForm.kind} onChange={event => setCodeSystemForm({ ...codeSystemForm, kind: event.target.value as TerminologyKind })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        {KIND_OPTIONS.map(kind => <option key={kind} value={kind}>{terminologyKindLabels[kind]}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Autoridade</Label>
                    <Input value={codeSystemForm.authority} onChange={event => setCodeSystemForm({ ...codeSystemForm, authority: event.target.value })} placeholder="ANS, AMB, hospital, operadora..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea value={codeSystemForm.description} onChange={event => setCodeSystemForm({ ...codeSystemForm, description: event.target.value })} placeholder="Contexto de uso e governança da terminologia." />
                  </div>
                  <Separator />
                  <Button className="w-full" type="submit" disabled={savingCodeSystem}>
                    {savingCodeSystem ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Criar sistema
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminologies;
