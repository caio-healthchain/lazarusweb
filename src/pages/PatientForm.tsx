import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Save, Upload, FileText, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { patientsService, uploadService } from "@/services/api";
import { toast } from "sonner";

interface PatientFormData {
  fullName: string;
  cpf: string;
  rg: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  medicalRecordNumber: string;
  admissionDate: string;
  roomNumber: string;
  responsibleDoctor: string;
  insurancePlan: string;
  insuranceNumber: string;
  insuranceValidity: string;
  accommodationType: string;
}

const PatientForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [xmlParsed, setXmlParsed] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: "",
    cpf: "",
    rg: "",
    birthDate: "",
    gender: "male",
    phone: "",
    email: "",
    address: "",
    medicalRecordNumber: "",
    admissionDate: new Date().toISOString().split('T')[0],
    roomNumber: "",
    responsibleDoctor: "",
    insurancePlan: "",
    insuranceNumber: "",
    insuranceValidity: "",
    accommodationType: "shared",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleXMLUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xml') && !file.name.endsWith('.zip')) {
      toast.error('Por favor, selecione um arquivo XML ou ZIP válido');
      return;
    }

    setXmlFile(file);
    setIsUploading(true);
    setXmlParsed(false);

    try {
      const response = await uploadService.uploadTissXml(file);
      const parsedData = response.data.data;

      if (parsedData) {
        setFormData(prev => ({
          ...prev,
          ...parsedData,
          admissionDate: parsedData.admissionDate ? new Date(parsedData.admissionDate).toISOString().split('T')[0] : prev.admissionDate,
          birthDate: parsedData.birthDate ? new Date(parsedData.birthDate).toISOString().split('T')[0] : prev.birthDate,
          insuranceValidity: parsedData.insuranceValidity ? new Date(parsedData.insuranceValidity).toISOString().split('T')[0] : prev.insuranceValidity,
        }));
        setXmlParsed(true);
        toast.success('XML processado com sucesso! Complete os dados faltantes.');
      } else {
        toast.warning('API processou o XML, mas alguns dados não puderam ser extraídos. Preencha manualmente.');
      }
    } catch (error) {
      console.error('Erro ao processar XML:', error);
      toast.error('Erro ao processar o arquivo XML');
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof PatientFormData)[] = [
      'fullName', 'cpf', 'rg', 'birthDate', 'gender',
      'phone', 'email', 'address', 'medicalRecordNumber'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Campo obrigatório: ${getFieldLabel(field)}`);
        return false;
      }
    }

    // Validar CPF (formato básico)
    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido. Deve conter 11 dígitos.');
      return false;
    }

    // Validar email
    if (!formData.email.includes('@')) {
      toast.error('Email inválido');
      return false;
    }

    return true;
  };

  const getFieldLabel = (field: keyof PatientFormData): string => {
    const labels: Record<keyof PatientFormData, string> = {
      fullName: 'Nome Completo',
      cpf: 'CPF',
      rg: 'RG',
      birthDate: 'Data de Nascimento',
      gender: 'Gênero',
      phone: 'Telefone',
      email: 'Email',
      address: 'Endereço',
      medicalRecordNumber: 'Prontuário',
      admissionDate: 'Data de Internação',
      roomNumber: 'Quarto',
      responsibleDoctor: 'Médico Responsável',
      insurancePlan: 'Plano de Saúde',
      insuranceNumber: 'Número da Carteirinha',
      insuranceValidity: 'Validade do Plano',
      accommodationType: 'Tipo de Acomodação',
    };
    return labels[field];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para envio
      const patientData = {
        fullName: formData.fullName,
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.fullName.split(' ')[0],
        cpf: formData.cpf.replace(/\D/g, ''),
        rg: formData.rg,
        birthDate: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        medicalRecordNumber: formData.medicalRecordNumber,
        admissionDate: formData.admissionDate || new Date().toISOString(),
        roomNumber: formData.roomNumber,
        responsibleDoctor: formData.responsibleDoctor,
        insurancePlan: formData.insurancePlan,
        insuranceNumber: formData.insuranceNumber,
        insuranceValidity: formData.insuranceValidity || new Date().toISOString(),
        accommodationType: formData.accommodationType,
      };

      await patientsService.create(patientData);

      toast.success('Paciente cadastrado com sucesso!');
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao cadastrar paciente:', error);
      toast.error(error.response?.data?.message || 'Erro ao cadastrar paciente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-3xl font-bold text-foreground">Novo Paciente</h1>
            <p className="text-muted-foreground mt-1">Cadastre um novo paciente no sistema</p>
          </div>
        </div>

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Cadastro Manual
            </TabsTrigger>
            <TabsTrigger value="xml" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Importar XML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="xml">
            <Card>
              <CardHeader>
                <CardTitle>Importar Dados de XML TISS</CardTitle>
                <CardDescription>
                  Faça upload de um arquivo XML TISS para preencher automaticamente os dados do paciente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <Label htmlFor="xml-upload" className="cursor-pointer">
                    <div className="text-sm text-gray-600 mb-2">
                      Arraste um arquivo XML ou clique para selecionar
                    </div>
                    <input
                      id="xml-upload"
                      type="file"
                      accept=".xml,.zip"
                      onChange={handleXMLUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2" disabled={isUploading}>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {isUploading ? 'Processando...' : 'Selecionar Arquivo XML'}
                    </Button>
                  </Label>
                  {xmlFile && (
                    <div className="mt-4 text-sm text-gray-600">
                      Arquivo selecionado: <span className="font-medium">{xmlFile.name}</span>
                    </div>
                  )}
                </div>

                {xmlParsed && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>XML Processado!</AlertTitle>
                    <AlertDescription>
                      Verifique e complete os dados no formulário abaixo antes de salvar.
                    </AlertDescription>
                  </Alert>
                )}

                {xmlFile && !xmlParsed && !isUploading && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                      Alguns dados podem não estar disponíveis no XML. Complete manualmente os campos faltantes.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Preencha todos os campos obrigatórios marcados com *
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Formulário (aparece em ambas as abas) */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nome completo do paciente"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rg">RG *</Label>
                <Input
                  id="rg"
                  value={formData.rg}
                  onChange={(e) => handleInputChange('rg', e.target.value)}
                  placeholder="00.000.000-0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Gênero *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Endereço Completo *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, complemento, bairro, cidade - UF"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados de Internação */}
          <Card>
            <CardHeader>
              <CardTitle>Dados de Internação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medicalRecordNumber">Prontuário *</Label>
                <Input
                  id="medicalRecordNumber"
                  value={formData.medicalRecordNumber}
                  onChange={(e) => handleInputChange('medicalRecordNumber', e.target.value)}
                  placeholder="PRN-2024-0000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="admissionDate">Data de Internação</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="roomNumber">Quarto</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  placeholder="302-A"
                />
              </div>

              <div>
                <Label htmlFor="responsibleDoctor">Médico Responsável</Label>
                <Input
                  id="responsibleDoctor"
                  value={formData.responsibleDoctor}
                  onChange={(e) => handleInputChange('responsibleDoctor', e.target.value)}
                  placeholder="Dr. João Silva"
                />
              </div>

              <div>
                <Label htmlFor="accommodationType">Tipo de Acomodação</Label>
                <Select value={formData.accommodationType} onValueChange={(value) => handleInputChange('accommodationType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="shared">Enfermaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Plano de Saúde */}
          <Card>
            <CardHeader>
              <CardTitle>Plano de Saúde</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurancePlan">Convênio</Label>
                <Input
                  id="insurancePlan"
                  value={formData.insurancePlan}
                  onChange={(e) => handleInputChange('insurancePlan', e.target.value)}
                  placeholder="Unimed, Bradesco Saúde, etc."
                />
              </div>

              <div>
                <Label htmlFor="insuranceNumber">Número da Carteirinha</Label>
                <Input
                  id="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                  placeholder="0000000000000000"
                />
              </div>

              <div>
                <Label htmlFor="insuranceValidity">Validade do Plano</Label>
                <Input
                  id="insuranceValidity"
                  type="date"
                  value={formData.insuranceValidity}
                  onChange={(e) => handleInputChange('insuranceValidity', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Paciente
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
