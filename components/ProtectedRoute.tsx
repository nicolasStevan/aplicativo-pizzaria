import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🔒 Rota protegida: usuário não autenticado, redirecionando para login');
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Se ainda está carregando, mostra loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E53E3E" />
      </View>
    );
  }

  // Se não está autenticado, não renderiza nada (vai redirecionar)
  if (!isAuthenticated || !user.token) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E53E3E" />
      </View>
    );
  }

  // Se chegou até aqui, está autenticado
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});
