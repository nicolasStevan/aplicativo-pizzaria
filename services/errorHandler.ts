// Tipos de erro da API
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Função para tratar erros da API e retornar mensagens amigáveis
export const handleApiError = (error: any): string => {
  console.error('🔍 Analisando erro da API:', error);

  // Erro de rede/conexão
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Tempo limite de conexão esgotado. Verifique sua internet.';
    }
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      return 'Erro de conexão. Verifique se o servidor está funcionando.';
    }
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }

  // Erro com resposta do servidor
  const status = error.response?.status;
  const data = error.response?.data;

  switch (status) {
    case 400:
      return data?.message || 'Dados inválidos. Verifique as informações enviadas.';
    case 401:
      return data?.message || 'Credenciais inválidas. Verifique seu email e senha.';
    case 403:
      return data?.message || 'Acesso negado. Você não tem permissão para esta ação.';
    case 404:
      return data?.message || 'Recurso não encontrado no servidor.';
    case 409:
      return data?.message || 'Conflito. Este email já está em uso.';
    case 422:
      return data?.message || 'Dados inválidos. Verifique os campos obrigatórios.';
    case 429:
      return data?.message || 'Muitas tentativas. Aguarde um momento antes de tentar novamente.';
    case 500:
      return data?.message || 'Erro interno do servidor. Tente novamente mais tarde.';
    case 503:
      return data?.message || 'Serviço temporariamente indisponível. Tente mais tarde.';
    default:
      return data?.message || 'Erro inesperado. Tente novamente.';
  }
};

// Função auxiliar para verificar se é erro de conexão
export const isNetworkError = (error: any): boolean => {
  return !error.response && (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('Network Error') ||
    error.code === 'ECONNABORTED'
  );
};

// Função auxiliar para verificar se é erro de autenticação
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401 || error.response?.status === 403;
};
