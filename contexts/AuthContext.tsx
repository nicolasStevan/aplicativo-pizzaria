import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

type AuthContextType = {
  user: UserProps;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => Promise<void>;
  validateCurrentToken: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
}

type SignInProps = {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_KEY = '@pizzaria_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps>({
    id: '',
    name: '',
    email: '',
    token: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user.token;

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      console.log('🔍 Verificando usuário armazenado...');
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('👤 Usuário encontrado:', userData.email);
        
        if (userData.token) {
          console.log('🔐 Validando token...');
          try {
            // Validar o token com a API
            await authService.validateToken(userData.token);
            console.log('✅ Token válido, usuário logado automaticamente');
            setUser(userData);
          } catch (error) {
            console.log('❌ Token inválido, removendo usuário');
            await AsyncStorage.removeItem(USER_KEY);
            // Reset user state
            setUser({
              id: '',
              name: '',
              email: '',
              token: ''
            });
          }
        } else {
          console.log('❌ Usuário sem token válido');
          await AsyncStorage.removeItem(USER_KEY);
        }
      } else {
        console.log('❌ Nenhum usuário encontrado');
      }
    } catch (error) {
      console.log('❌ Erro ao carregar usuário:', error);
      // Em caso de erro, limpar dados possivelmente corrompidos
      await AsyncStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(credentials: SignInProps): Promise<void> {
    try {
      console.log('🔑 Fazendo login...', credentials.email);
      const response = await authService.login(credentials);
      console.log('✅ Response completa da API:', JSON.stringify(response, null, 2));
      
      // O token está DENTRO do objeto user, conforme sua resposta da API
      const token = response.user.token;
      
      if (!token) {
        console.error('❌ Token não encontrado na resposta:', response);
        throw new Error('Token não recebido. Tente novamente.');
      }
      
      console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');
      
      const userData: UserProps = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        token: token
      };

      console.log('📋 Dados do usuário processados:', userData);
      console.log('🔑 Token processado:', userData.token ? 'SIM' : 'NÃO');
      
      setUser(userData);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      console.log('💾 Usuário salvo no storage');
      
      // Verificar se foi salvo mesmo
      const verification = await AsyncStorage.getItem(USER_KEY);
      const savedData = verification ? JSON.parse(verification) : null;
      console.log('🔍 Verificação: dados salvos =', !!verification);
      console.log('🔍 Token salvo:', savedData?.token ? 'SIM' : 'NÃO');
      
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  async function signOut(): Promise<void> {
    console.log('🚪 Fazendo logout...');
    setUser({
      id: '',
      name: '',
      email: '',
      token: ''
    });
    await AsyncStorage.removeItem(USER_KEY);
    console.log('✅ Logout concluído');
  }

  async function validateCurrentToken(): Promise<boolean> {
    if (!user.token) {
      console.log('❌ Nenhum token para validar');
      return false;
    }

    try {
      console.log('🔍 Validando token atual...');
      await authService.validateToken(user.token);
      console.log('✅ Token atual é válido');
      return true;
    } catch (error) {
      console.log('❌ Token atual é inválido, fazendo logout automático');
      await signOut();
      return false;
    }
  }

  async function refreshUserData(): Promise<void> {
    if (!user.token) {
      console.log('❌ Nenhum token para atualizar dados do usuário');
      return;
    }

    try {
      console.log('🔄 Atualizando dados do usuário...');
      const response = await authService.validateToken(user.token);
      
      const updatedUserData: UserProps = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        token: response.user.token // Usar o token da resposta
      };

      setUser(updatedUserData);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUserData));
      console.log('✅ Dados do usuário atualizados');
    } catch (error) {
      console.log('❌ Erro ao atualizar dados do usuário, fazendo logout automático');
      await signOut();
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      signIn, 
      signOut,
      validateCurrentToken,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}