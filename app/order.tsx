import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import type { OrderParams } from "../types/navigation";

export default function Order() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<OrderParams>();

  const handleBackToHome = () => {
    router.push('/home');
  };

  const handleLogout = async () => {
    console.log('🚪 Fazendo logout...');
    await signOut();
    router.replace('/login');
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.welcome}>📋</Text>
          <Text style={styles.title}>Detalhes do Pedido</Text>
          <Text style={styles.subtitle}>Mesa: {params.number}</Text>
          <Text style={styles.subtitle}>ID: {params.order_id}</Text>
          
          {/* Área para detalhes do pedido - em branco por enquanto */}
          <View style={styles.ordersContainer}>
            <Text style={styles.ordersText}>
              Detalhes do pedido da mesa {params.number} aparecerão aqui...
            </Text>
            <Text style={styles.ordersSubText}>
              ID do pedido: {params.order_id}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
              <Text style={styles.buttonText}>🏠 Voltar ao Início</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>🚪 Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  ordersContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 40,
    minWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ordersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  ordersSubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 15,
  },
  homeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});