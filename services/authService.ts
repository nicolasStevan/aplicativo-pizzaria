import { apiService } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
  };
}

export const authService = {
  // Login do usuário
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log('🌐 Enviando login para API:', data.email);
    console.log('🔗 URL da requisição: http://192.168.1.174:3333/login');
    const response = await apiService.post('/login', data);
    console.log('✅ Resposta da API recebida');
    console.log('🔑 Login realizado com sucesso:', response.user.name);
    return response;
  },

  // Logout (se houver endpoint específico)
  logout: async (): Promise<void> => {
    try {
      console.log('🚪 Fazendo logout...');
      await apiService.post('/logout');
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      // Não vamos lançar o erro aqui, pois o logout local ainda deve acontecer
    }
  },

  // Validar token e obter dados do usuário (similar ao /me do Next.js)
  validateToken: async (token: string): Promise<AuthResponse> => {
    console.log('🔍 Validando token...');
    try {
      // Tentar primeiro o endpoint /me (padrão mais comum)
      const response = await apiService.get('/me');
      console.log('✅ Token válido - endpoint /me');
      return {
        user: {
          ...response,
          token: token // Adicionar o token aos dados do usuário
        }
      };
    } catch (error) {
      // Se /me não existir, tentar /validate-token
      try {
        const response = await apiService.get('/validate-token');
        console.log('✅ Token válido - endpoint /validate-token');
        
        // Se a resposta já tiver o token no user, usar como está
        if (response.user && response.user.token) {
          return response;
        }
        
        // Se não, adicionar o token atual
        return {
          user: {
            ...response.user || response,
            token: token
          }
        };
      } catch (secondError) {
        console.error('❌ Token inválido em ambos endpoints');
        throw new Error('Token inválido');
      }
    }
  },
};
