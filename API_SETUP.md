# Configuração de API - Pizzaria App

## 📡 Configuração HTTP

O projeto está configurado para usar **Axios** para fazer requisições HTTP para o seu servidor backend.

### 🔧 Configurações

- **Base URL**: `http://192.168.1.174:3333`
- **Timeout**: 10 segundos
- **Headers padrão**: `Content-Type: application/json`

### 🚀 Como usar

#### 1. Serviço de API Genérico

```typescript
import { apiService } from './services/api';

// GET request
const data = await apiService.get('/endpoint');

// POST request
const response = await apiService.post('/endpoint', { data });

// PUT request
const updated = await apiService.put('/endpoint', { data });

// DELETE request
await apiService.delete('/endpoint');
```

#### 2. Serviço de Autenticação

```typescript
import { authService } from './services/authService';

// Login
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'senha123'
});

// Logout
await authService.logout();
```

### 📋 Endpoints Esperados

O app espera que sua API tenha os seguintes endpoints:

#### Autenticação
- `POST /login` - Login do usuário
  ```json
  // Request
  {
    "email": "user@example.com",
    "password": "senha123"
  }
  
  // Response
  {
    "user": {
      "id": "1",
      "name": "João Silva",
      "email": "user@example.com"
    },
    "token": "jwt_token_aqui"
  }
  ```

- `POST /logout` - Logout (opcional)
- `GET /validate-token` - Validar token (opcional)

> **Nota:** O registro de usuários deve ser feito via web/admin. O app mobile apenas faz login com usuários já existentes.

### 🔐 Autenticação Automática

O sistema inclui interceptors que:
- ✅ Adicionam automaticamente o token JWT nas requisições
- ✅ Fazem log de todas as requisições
- ✅ Tratam erros de forma centralizada
- ✅ Persistem dados de usuário no AsyncStorage

### 🚨 Tratamento de Erros

O sistema trata automaticamente erros comuns:
- **Erro de rede**: "Erro de conexão. Verifique sua internet..."
- **401**: "Credenciais inválidas..."
- **409**: "Este email já está em uso..."
- **500**: "Erro interno do servidor..."

### 📝 Logs

Todas as requisições são logadas no console para debug:
```
🌐 Fazendo requisição para: POST /login
✅ Resposta recebida: 200 - /login
🔐 Login bem-sucedido! {id: "1", name: "João", email: "joao@example.com"}
```

### ⚙️ Configuração do Backend

Certifique-se de que seu servidor backend:
1. Está rodando na porta 3333
2. Aceita requisições do IP do app (CORS configurado)
3. Retorna os dados no formato JSON esperado
4. Usa autenticação JWT se necessário

### 🛠️ Para alterar o IP/Porta

Edite o arquivo `services/api.ts`:
```typescript
const API_BASE_URL = 'http://SEU_IP:SUA_PORTA';
```
