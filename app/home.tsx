import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOut, validateCurrentToken } = useAuth();
  const router = useRouter();

  console.log('🏠 Home renderizada:');
  console.log('   - user.name:', user.name);
  console.log('   - user.email:', user.email);
  console.log('   - user.token:', user.token ? 'EXISTE' : 'NÃO EXISTE');
  console.log('   - user completo:', user);

  const handleLogout = async () => {
    console.log('🚪 Fazendo logout manual...');
    await signOut();
    router.replace('/login');
  };

  const handleForceLogout = async () => {
    console.log('🔄 Forçando logout e limpeza...');
    await signOut();
    // Força redirecionamento
    setTimeout(() => {
      router.replace('/login');
    }, 100);
  };

  const handleValidateToken = async () => {
    console.log('🔍 Testando validação de token...');
    const isValid = await validateCurrentToken();
    if (isValid) {
      Alert.alert('✅ Token Válido', 'Seu token está funcionando perfeitamente!');
    } else {
      Alert.alert('❌ Token Inválido', 'Você será redirecionado para o login.');
      router.push('/login');
    }
  };

  if (!user.token) {
    console.log('❌ Home: Nenhum token, retornando tela de erro');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.welcome}>🍕</Text>
          <Text style={styles.title}>Sem token...</Text>
          <Text style={styles.subtitle}>Você precisa fazer login novamente</Text>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleForceLogout}
          >
            <Text style={styles.logoutButtonText}>🔓 Ir para Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>🍕</Text>
        <Text style={styles.title}>Olá, {user.name}!</Text>
        <Text style={styles.subtitle}>Bem-vindo ao Amigo Pizza!</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.validateButton} onPress={handleValidateToken}>
            <Text style={styles.validateButtonText}>🔍 Validar Token</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 15,
  },
  validateButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
