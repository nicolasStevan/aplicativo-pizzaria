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
        
        // Por enquanto, apenas carregar sem validar token para evitar conflitos
        console.log('✅ Carregando usuário sem validação inicial');
        setUser(userData);
        
        // TODO: Validação de token pode ser feita depois se necessário
        // if (userData.token) {
        //   console.log('🔐 Validando token...');
        //   try {
        //     await authService.validateToken(userData.token);
        //     console.log('✅ Token válido, usuário logado automaticamente');
        //     setUser(userData);
        //   } catch (error) {
        //     console.log('❌ Token inválido, removendo usuário');
        //     await AsyncStorage.removeItem(USER_KEY);
        //   }
        // }
      } else {
        console.log('❌ Nenhum usuário encontrado');
      }
    } catch (error) {
      console.log('❌ Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(credentials: SignInProps): Promise<void> {
    console.log('🔑 Fazendo login...', credentials.email);
    const response = await authService.login(credentials);
    console.log('✅ Login realizado:', response.user.name);
    
    const userData: UserProps = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      token: response.token
    };

    console.log('📋 Dados do usuário processados:', userData);
    console.log('🔑 Token processado:', userData.token ? 'SIM' : 'NÃO');
    
    setUser(userData);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    console.log('💾 Usuário salvo no storage');
    
    // Verificar se foi salvo mesmo
    const verification = await AsyncStorage.getItem(USER_KEY);
    console.log('🔍 Verificação: dados salvos =', !!verification);
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      signIn, 
      signOut,
      validateCurrentToken
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