# Engenharia de Software  
## Trabalho Prático – Questão 3  

**Integrantes:** Diego, Laura e Ana Clara  

---

# Especificação de Requisitos  

## Histórias de Usuário  

### HistoriaU1: Autenticação de Usuário  
**Como** um usuário cadastrado,  
**quero** realizar login no sistema,  
**para** acessar a área logada e visualizar funcionalidades restritas.  

### HistoriaU2: Cadastro de Usuário  
**Como** um visitante,  
**quero** me cadastrar no sistema com meus dados,  
**para** poder realizar login e utilizar as funcionalidades de usuário.  

### HistoriaU3: Edição de Perfil de Usuário  
**Como** um usuário autenticado,  
**quero** editar meus dados de perfil,  
**para** manter minhas informações sempre atualizadas.  

---

## Cenários de Teste  

### HistoriaU1: Autenticação de Usuário  
- **Cenário Principal (Login válido)**  
  - Dado que o usuário acessa a página de login  
  - Quando ele insere credenciais corretas  
  - Então deve ser redirecionado para a área logada e visualizar os animais disponíveis.  

- **Cenário Alternativo A1 (Login inválido)**  
  - Dado que o usuário acessa a página de login  
  - Quando ele insere senha incorreta  
  - Então o sistema deve exibir uma mensagem de erro.  

---

### HistoriaU2: Cadastro de Usuário  
- **Cenário Principal (Cadastro válido)**  
  - Dado que o usuário acessa a página de cadastro  
  - Quando ele informa nome, e-mail único e senha válida  
  - Então deve conseguir se cadastrar e ser redirecionado para a página de login.  

- **Cenário Alternativo A1 (Cadastro inválido - dados incorretos)**  
  - Dado que o usuário acessa a página de cadastro  
  - Quando ele informa e-mail já existente ou senhas diferentes  
  - Então o sistema deve impedir o cadastro e exibir mensagem de erro.  

---

### HistoriaU3: Edição de Perfil de Usuário  
- **Cenário Principal (Edição bem-sucedida)**  
  - Dado que o usuário está autenticado e acessa a página de edição de perfil  
  - Quando altera seu nome e salva  
  - Então o sistema deve atualizar os dados no backend e refletir a alteração no login seguinte.  

- **Cenário Alternativo A1 (Erro ao salvar alteração)**  
  - Dado que o usuário acessa a página de edição  
  - Quando ocorre falha no servidor ao salvar a alteração  
  - Então o sistema deve notificar o erro e manter os dados originais.  
