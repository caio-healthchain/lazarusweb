import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { auditService } from "@/services/api";
import { toast } from "sonner";

const NewAudit = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.xml') && !selectedFile.name.endsWith('.zip')) {
      toast.error('Por favor, selecione um arquivo XML ou ZIP válido.');
      return;
    }

    setFile(selectedFile);
    await handleUpload(selectedFile);
  };

  const handleUpload = async (uploadFile: File) => {
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const response = await auditService.uploadAuditFile(uploadFile);

      // Trata o caso de sucesso sem conteúdo (204 No Content)
      if (response.status === 204 || !response.data?.data?.id) {
        setUploadSuccess(true);
        toast.success('Arquivo enviado e processado com sucesso!');
        setIsUploading(false);
        return;
      }
      
      // Acessa o ID da auditoria da resposta da API.
      // A estrutura esperada é { success: true, data: { id: '...' } }
      const auditId = response.data?.data?.id;

      if (!auditId) {
        throw new Error("A resposta da API não continha um ID de auditoria válido.");
      }

      setUploadSuccess(true);
      toast.success('Arquivo processado com sucesso! Redirecionando para a auditoria...');

      // Redireciona para a página de detalhes da auditoria após um breve delay
      setTimeout(() => {
        navigate(`/audit/${auditId}`);
        // Desativa o loading apenas após o redirecionamento
        setIsUploading(false); 
      }, 2000);

    } catch (error) {
      console.error('Erro ao enviar arquivo de auditoria:', error);
      toast.error('Erro ao processar o arquivo. Verifique o console para mais detalhes.');
      setIsUploading(false); // Para o loading em caso de erro
      setFile(null); // Limpa o arquivo em caso de erro
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nova Auditoria Médica</h1>
            <p className="text-muted-foreground mt-1">Inicie uma nova auditoria a partir de um arquivo XML TISS.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Importar Guia de Auditoria</CardTitle>
            <CardDescription>
              Faça o upload de um arquivo XML ou ZIP para iniciar o processo de auditoria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <Label htmlFor="xml-upload" className="cursor-pointer">
                <div className="text-sm text-gray-600 mb-2">
                  Arraste um arquivo XML/ZIP ou clique para selecionar
                </div>
                <input
                  id="xml-upload"
                  type="file"
                  accept=".xml,.zip"
                  onChange={handleFileSelect}
                  className="hidden"
                  ref={fileInputRef}
                  disabled={isUploading}
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2" disabled={isUploading}>
                  {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {isUploading ? 'Processando...' : 'Selecionar Arquivo'}
                </Button>
              </Label>
              {file && (
                <div className="mt-4 text-sm text-gray-600">
                  Arquivo selecionado: <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>

            {uploadSuccess && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Sucesso!</AlertTitle>
                <AlertDescription>
                  O arquivo foi processado e a auditoria foi iniciada. Você será redirecionado em breve.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewAudit;
