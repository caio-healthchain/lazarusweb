import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Calendar,
  User,
  Paperclip,
  Image,
  FileImage,
  File
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  category: 'exames' | 'receitas' | 'relatorios' | 'cirurgia' | 'outros';
  size: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

interface AnexosTabProps {
  patient?: any;
}

export function AnexosTab({ patient }: AnexosTabProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Exame_Sangue_Pre_Operatorio.pdf',
      type: 'pdf',
      category: 'exames',
      size: '2.1 MB',
      uploadedAt: new Date('2024-01-15T08:30:00'),
      uploadedBy: 'Dr. Silva',
      description: 'Exames laboratoriais pré-operatórios'
    },
    {
      id: '2',
      name: 'Tomografia_Abdomen.dcm',
      type: 'image',
      category: 'exames',
      size: '45.8 MB',
      uploadedAt: new Date('2024-01-14T14:20:00'),
      uploadedBy: 'Radiologia',
      description: 'Tomografia computadorizada do abdômen'
    },
    {
      id: '3',
      name: 'Receita_Pos_Cirurgica.pdf',
      type: 'pdf',
      category: 'receitas',
      size: '1.2 MB',
      uploadedAt: new Date('2024-01-16T16:45:00'),
      uploadedBy: 'Dr. Santos',
      description: 'Medicações pós-operatórias'
    },
    {
      id: '4',
      name: 'Relatorio_Cirurgia.docx',
      type: 'document',
      category: 'cirurgia',
      size: '856 KB',
      uploadedAt: new Date('2024-01-15T18:30:00'),
      uploadedBy: 'Dr. Oliveira',
      description: 'Relatório detalhado do procedimento cirúrgico'
    },
    {
      id: '5',
      name: 'Termo_Consentimento.pdf',
      type: 'pdf',
      category: 'outros',
      size: '980 KB',
      uploadedAt: new Date('2024-01-13T10:15:00'),
      uploadedBy: 'Secretaria',
      description: 'Termo de consentimento informado'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-destructive" />;
      case 'image': return <FileImage className="h-5 w-5 text-accent" />;
      case 'document': return <File className="h-5 w-5 text-primary" />;
      default: return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exames': return 'secondary';
      case 'receitas': return 'success';
      case 'relatorios': return 'warning';
      case 'cirurgia': return 'destructive';
      case 'outros': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'exames': return 'Exames';
      case 'receitas': return 'Receitas';
      case 'relatorios': return 'Relatórios';
      case 'cirurgia': return 'Cirurgia';
      case 'outros': return 'Outros';
      default: return category;
    }
  };

  const filteredDocuments = selectedCategory === 'todos' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const categories = [
    { value: 'todos', label: 'Todos os Documentos' },
    { value: 'exames', label: 'Exames' },
    { value: 'receitas', label: 'Receitas' },
    { value: 'relatorios', label: 'Relatórios' },
    { value: 'cirurgia', label: 'Cirurgia' },
    { value: 'outros', label: 'Outros' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-primary" />
                Documentos e Anexos do Paciente
              </CardTitle>
              <CardDescription>
                Todos os documentos, exames e relatórios relacionados ao paciente
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Documento
              </Button>
              <Badge variant="secondary">
                {filteredDocuments.length} documento(s)
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros por Categoria */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.type)}
                    <Badge variant={getCategoryColor(doc.category) as any} className="text-xs">
                      {getCategoryLabel(doc.category)}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-card-foreground line-clamp-2">
                    {doc.name}
                  </h3>
                  {doc.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {doc.uploadedAt.toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {doc.uploadedBy}
                  </div>
                  <div className="font-medium">
                    Tamanho: {doc.size}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Paperclip className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Não há documentos na categoria selecionada.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}