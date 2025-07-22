import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base da API
// Detecta automaticamente o melhor IP baseado no ambiente
const getBaseURL = () => {
  // Se estiver em desenvolvimento, use o IP da sua máquina
  // Para produção, você mudaria para a URL do servidor real
  return 'http://192.168.1.174:3333';
};

const API_BASE_URL = getBaseURL();

// Criar instância do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token automaticamente nas requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const storedUser = await AsyncStorage.getItem('@pizzaria_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta recebida: ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta da API:', error);
    
    // Tratar diferentes tipos de erro
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Status do erro:', error.response.status);
      console.error('Dados do erro:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Nenhuma resposta recebida:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('Erro na configuração:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funções auxiliares para diferentes tipos de requisição
export const apiService = {
  // GET
  get: async (endpoint: string, config?: any) => {
    const response = await api.get(endpoint, config);
    return response.data;
  },

  // POST
  post: async (endpoint: string, data?: any) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  // PUT
  put: async (endpoint: string, data?: any) => {
    const response = await api.put(endpoint, data);
    return response.data;
  },

  // DELETE
  delete: async (endpoint: string) => {
    const response = await api.delete(endpoint);
    return response.data;
  },
};

export default api;
