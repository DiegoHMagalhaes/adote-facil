/**
 * Testes para HistoriaU1: Cadastro de Usuário
 * Este bloco agrupa todos os testes relacionados à funcionalidade de cadastro de um novo usuário.
 */
describe('HistoriaU1: Cadastro de Usuário', () => {

  // O beforeEach é executado antes de cada teste ('it') dentro deste 'describe'.
  // Aqui, garantimos que cada teste comece na página de cadastro.
  beforeEach(() => {
    cy.visit('/cadastro');
  });

  // Este é o caso de teste para o cenário principal e de sucesso.
  it('Cenário Principal: Deve permitir o cadastro com dados válidos', () => {
    // Para evitar erros de "e-mail já cadastrado" em testes futuros,
    // criamos um e-mail único usando a data e hora atual (timestamp).
    const emailUnico = `teste.${Date.now()}@exemplo.com`;

    // Usamos cy.get() para selecionar os elementos do formulário pelo atributo 'name'
    // e .type() para preencher cada campo com os dados necessários.
    cy.get('input[name="name"]').type('user');
    cy.get('input[name="email"]').type(emailUnico);
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha123');

    // Selecionamos o botão de submissão e simulamos um clique.
    cy.get('button[type="submit"]').click();

    // Esta é a verificação (assertion). Checamos se, após o cadastro,
    // a URL do navegador inclui '/login', o que indica que fomos redirecionados com sucesso.
    cy.url().should('include', '/login');
  });
});

/**
 * Testes para HistoriaU2: Autenticação de Usuário
 * Este bloco agrupa os testes para a funcionalidade de login.
 */
describe('HistoriaU2: Autenticação de Usuário', () => {

  // Antes de cada teste de autenticação, navegamos para a página de login.
  beforeEach(() => {
    cy.visit('/login');
  });

  // Teste para o cenário de login bem-sucedido.
  it('Cenário Principal: Deve permitir o login com credenciais válidas', () => {
    // Preenchemos o formulário com credenciais de um usuário que sabemos que existe.
    cy.get('input[name="email"]').type('usuario.existente@exemplo.com');
    cy.get('input[name="password"]').type('senha123');

    // Clicamos no botão para logar.
    cy.get('button[type="submit"]').click();

    // Verificamos se o usuário foi redirecionado para a área logada.
    cy.url().should('include', '/area_logada/animais_disponiveis');

    // Para ter mais certeza, verificamos também se o título principal (h1) da página
    // contém o texto esperado e está visível, confirmando que a página correta carregou.
    cy.get('h1').contains('Animais disponíveis para adoção').should('be.visible');
  });

  // Teste para o cenário alternativo (A1), onde o login falha.
  it('Cenário A1: Deve exibir erro com credenciais inválidas', () => {
    // Preenchemos com um e-mail válido, mas uma senha incorreta de propósito.
    cy.get('input[name="email"]').type('usuario.existente@exemplo.com');
    cy.get('input[name="password"]').type('senhaErrada');

    // Clicamos no botão para tentar logar.
    cy.get('button[type="submit"]').click();

    // O comando cy.on('window:alert', ...) "escuta" por um evento de alerta do navegador.
    // Quando um alerta aparece, ele captura o texto da mensagem.
    cy.on('window:alert', (text) => {
      // Verificamos se o texto do alerta contém a mensagem de erro esperada.
      expect(text).to.contains('Erro ao logar');
    });
  });
});