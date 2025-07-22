import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      console.log('🔄 Verificação completa:', { isAuthenticated });
      setTimeout(() => {
        if (isAuthenticated) {
          console.log('➡️ Redirecionando para /home');
          router.replace('/home');
        } else {
          console.log('➡️ Redirecionando para /login');
          router.replace('/login');
        }
      }, 100);
    }
  }, [isLoading, isAuthenticated, router]);

  // Tela de loading enquanto verifica autenticação
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🍕</Text>
      <Text style={styles.title}>Pizzaria App</Text>
      <ActivityIndicator 
        size="large" 
        color="#fff" 
        style={styles.spinner}
      />
      <Text style={styles.text}>
        {isLoading ? 'Verificando login...' : 'Redirecionando...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E53E3E',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  spinner: {
    marginVertical: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
});
