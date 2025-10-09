/**
 * Parser de XML TISS para extrair dados de pacientes
 * Suporta múltiplos formatos de XML TISS (guias de internação, consultas, etc.)
 */

interface ParsedPatientData {
  fullName?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  medicalRecordNumber?: string;
  admissionDate?: string;
  roomNumber?: string;
  responsibleDoctor?: string;
  insurancePlan?: string;
  insuranceNumber?: string;
  insuranceValidity?: string;
  accommodationType?: string;
}

/**
 * Extrai texto de um nó XML
 */
const getTextContent = (xml: Document, tagName: string, namespace?: string): string | null => {
  try {
    const prefix = namespace || 'ans';
    const elements = xml.getElementsByTagNameNS('*', tagName);
    
    if (elements.length > 0) {
      return elements[0].textContent?.trim() || null;
    }
    
    // Fallback sem namespace
    const elementsNoNS = xml.getElementsByTagName(tagName);
    if (elementsNoNS.length > 0) {
      return elementsNoNS[0].textContent?.trim() || null;
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao extrair ${tagName}:`, error);
    return null;
  }
};

/**
 * Converte data do formato YYYY-MM-DD para formato do input date
 */
const parseDate = (dateStr: string | null): string | undefined => {
  if (!dateStr) return undefined;
  
  try {
    // Se já está no formato correto (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Tentar outros formatos comuns
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (error) {
    console.error('Erro ao parsear data:', error);
  }
  
  return undefined;
};

/**
 * Gera um prontuário único baseado no timestamp
 */
const generateMedicalRecordNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const timestamp = now.getTime().toString().slice(-6);
  return `PRN-${year}-${timestamp}`;
};

/**
 * Extrai dados de beneficiário do XML TISS
 */
const extractBeneficiaryData = (xml: Document): Partial<ParsedPatientData> => {
  const data: Partial<ParsedPatientData> = {};
  
  // Número da carteirinha (sempre presente nos XMLs TISS)
  const numeroCarteira = getTextContent(xml, 'numeroCarteira');
  if (numeroCarteira) {
    data.insuranceNumber = numeroCarteira;
  }
  
  // Nome do beneficiário (pode não estar presente em todos os XMLs)
  const nomeBeneficiario = getTextContent(xml, 'nomeBeneficiario');
  if (nomeBeneficiario) {
    data.fullName = nomeBeneficiario;
  }
  
  // CPF do beneficiário
  const cpfBeneficiario = getTextContent(xml, 'numeroDocumento') || 
                          getTextContent(xml, 'cpf') ||
                          getTextContent(xml, 'cpfBeneficiario');
  if (cpfBeneficiario) {
    data.cpf = cpfBeneficiario.replace(/\D/g, '');
  }
  
  // Data de nascimento
  const dataNascimento = getTextContent(xml, 'dataNascimento');
  if (dataNascimento) {
    data.birthDate = parseDate(dataNascimento);
  }
  
  // Sexo/Gênero
  const sexo = getTextContent(xml, 'sexo');
  if (sexo) {
    // Mapear códigos TISS para valores do sistema
    const genderMap: Record<string, string> = {
      'M': 'male',
      'F': 'female',
      '1': 'male',
      '2': 'female',
    };
    data.gender = genderMap[sexo.toUpperCase()] || 'other';
  }
  
  return data;
};

/**
 * Extrai dados de internação do XML TISS
 */
const extractAdmissionData = (xml: Document): Partial<ParsedPatientData> => {
  const data: Partial<ParsedPatientData> = {};
  
  // Data de início do faturamento (geralmente é a data de internação)
  const dataInicio = getTextContent(xml, 'dataInicioFaturamento') ||
                     getTextContent(xml, 'dataInternacao') ||
                     getTextContent(xml, 'dataAtendimento');
  if (dataInicio) {
    data.admissionDate = parseDate(dataInicio);
  }
  
  // Número da guia pode ser usado como prontuário temporário
  const numeroGuia = getTextContent(xml, 'numeroGuiaPrestador') ||
                     getTextContent(xml, 'numeroGuiaOperadora');
  if (numeroGuia) {
    data.medicalRecordNumber = `PRN-${numeroGuia}`;
  }
  
  // Tipo de acomodação
  const tipoAcomodacao = getTextContent(xml, 'tipoAcomodacao') ||
                         getTextContent(xml, 'regimeInternacao');
  if (tipoAcomodacao) {
    // Mapear códigos TISS
    // 1 = Apartamento, 2 = Quarto, 3 = Enfermaria
    const accommodationMap: Record<string, string> = {
      '1': 'apartment',
      '2': 'apartment',
      '3': 'shared',
      'apartamento': 'apartment',
      'enfermaria': 'shared',
    };
    data.accommodationType = accommodationMap[tipoAcomodacao.toLowerCase()] || 'shared';
  }
  
  return data;
};

/**
 * Extrai dados do prestador/médico responsável
 */
const extractDoctorData = (xml: Document): Partial<ParsedPatientData> => {
  const data: Partial<ParsedPatientData> = {};
  
  // Nome do profissional
  const nomeProf = getTextContent(xml, 'nomeProf') ||
                   getTextContent(xml, 'nomeProfissional') ||
                   getTextContent(xml, 'nomeExecutante');
  if (nomeProf) {
    data.responsibleDoctor = nomeProf;
  }
  
  return data;
};

/**
 * Extrai dados da operadora/plano de saúde
 */
const extractInsuranceData = (xml: Document): Partial<ParsedPatientData> => {
  const data: Partial<ParsedPatientData> = {};
  
  // Registro ANS da operadora
  const registroANS = getTextContent(xml, 'registroANS');
  
  // Mapear alguns códigos ANS conhecidos para nomes de operadoras
  const insuranceMap: Record<string, string> = {
    '407780': 'Unimed',
    '326305': 'Bradesco Saúde',
    '359661': 'SulAmérica',
    '417173': 'Amil',
  };
  
  if (registroANS && insuranceMap[registroANS]) {
    data.insurancePlan = insuranceMap[registroANS];
  }
  
  // Data de validade da senha/autorização
  const dataValidade = getTextContent(xml, 'dataValidadeSenha') ||
                       getTextContent(xml, 'dataValidadeCarteira');
  if (dataValidade) {
    data.insuranceValidity = parseDate(dataValidade);
  }
  
  return data;
};

/**
 * Função principal para parsear XML TISS e extrair dados do paciente
 */
export const parseXMLToPatient = (xmlString: string): ParsedPatientData | null => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Verificar se há erros de parsing
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      console.error('Erro ao parsear XML:', parserError[0].textContent);
      return null;
    }
    
    // Extrair dados de diferentes seções do XML
    const beneficiaryData = extractBeneficiaryData(xmlDoc);
    const admissionData = extractAdmissionData(xmlDoc);
    const doctorData = extractDoctorData(xmlDoc);
    const insuranceData = extractInsuranceData(xmlDoc);
    
    // Combinar todos os dados extraídos
    const parsedData: ParsedPatientData = {
      ...beneficiaryData,
      ...admissionData,
      ...doctorData,
      ...insuranceData,
    };
    
    // Gerar prontuário se não foi extraído
    if (!parsedData.medicalRecordNumber) {
      parsedData.medicalRecordNumber = generateMedicalRecordNumber();
    }
    
    // Definir data de internação como hoje se não foi extraída
    if (!parsedData.admissionDate) {
      parsedData.admissionDate = new Date().toISOString().split('T')[0];
    }
    
    // Log dos dados extraídos para debug
    console.log('Dados extraídos do XML:', parsedData);
    
    return parsedData;
  } catch (error) {
    console.error('Erro ao processar XML:', error);
    return null;
  }
};

/**
 * Valida se um XML é um arquivo TISS válido
 */
export const isValidTISSXML = (xmlString: string): boolean => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Verificar se há erros de parsing
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      return false;
    }
    
    // Verificar se contém elementos típicos de XML TISS
    const hasGuia = xmlDoc.getElementsByTagName('guiaResumoInternacao').length > 0 ||
                    xmlDoc.getElementsByTagName('guiaConsulta').length > 0 ||
                    xmlDoc.getElementsByTagName('guiaSP_SADT').length > 0;
    
    const hasBeneficiario = xmlDoc.getElementsByTagName('dadosBeneficiario').length > 0;
    
    return hasGuia || hasBeneficiario;
  } catch (error) {
    return false;
  }
};

/**
 * Extrai múltiplos pacientes de um XML TISS que contenha lote de guias
 */
export const parseXMLToMultiplePatients = (xmlString: string): ParsedPatientData[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    const patients: ParsedPatientData[] = [];
    
    // Buscar todas as guias no XML
    const guias = xmlDoc.getElementsByTagName('guiaResumoInternacao');
    
    for (let i = 0; i < guias.length; i++) {
      const guia = guias[i];
      const guiaString = new XMLSerializer().serializeToString(guia);
      const patientData = parseXMLToPatient(guiaString);
      
      if (patientData && patientData.insuranceNumber) {
        // Adicionar apenas se tiver pelo menos o número da carteirinha
        patients.push(patientData);
      }
    }
    
    return patients;
  } catch (error) {
    console.error('Erro ao extrair múltiplos pacientes:', error);
    return [];
  }
};

