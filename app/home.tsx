import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useState } from 'react';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState('');

  const handleLogout = async () => {
    console.log('🚪 Fazendo logout...');
    await signOut();
    router.replace('/login');
  };

  const handleOpenTable = () => {
    if(tableNumber.trim() === '') {
      console.log('❌ Número da mesa não pode estar vazio!');
      return;
    }
    
    // Navegar para order.tsx passando os parâmetros
    router.push({
      pathname: '/order',
      params: {
        number: tableNumber,
        order_id: Math.random().toString(36).substr(2, 9) // Gerar um ID temporário
      }
    });
  }

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.welcome}>🍕</Text>

          <Text style={styles.title}> Novo Pedido </Text>
          <TextInput 
            style={styles.input} 
            keyboardType='numeric' 
            placeholder="Digite o número da mesa" 
            value={tableNumber} 
            onChangeText={setTableNumber} 
          />

          <TouchableOpacity style={styles.logoutButton} onPress={handleOpenTable}>
            <Text style={styles.logoutButtonText}>Abrir Mesa</Text>
          </TouchableOpacity>

            {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>🚪 Sair</Text>
            </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </ProtectedRoute>
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
  },
});
