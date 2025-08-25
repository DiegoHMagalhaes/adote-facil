// Testes para a funcionalidade de Cadastro de Usuário
describe('HistoriaU1: Cadastro de Usuário', () => {

  // Acessa a página de cadastro antes de cada teste
  beforeEach(() => {
    cy.visit('/cadastro');
  });

  it('Cenário Principal: Deve permitir o cadastro com dados válidos', () => {
    // Gera um e-mail único para evitar conflitos durante a execução dos testes
    const emailUnico = `teste.${Date.now()}@exemplo.com`;

    cy.get('input[name="name"]').type('user');
    cy.get('input[name="email"]').type(emailUnico);
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha123');
    cy.get('button[type="submit"]').click();

    // Verifica se o usuário foi redirecionado para a página de login após o sucesso
    cy.url().should('include', '/login');
  });

  it('Cenário A1.1: Deve exibir erro ao tentar cadastrar com e-mail já existente', () => {
    // Usa um e-mail que se assume já existir na base de dados
    const emailJaExistente = 'usuario.existente@exemplo.com';

    cy.get('input[name="name"]').type('Outro Usuario');
    cy.get('input[name="email"]').type(emailJaExistente);
    cy.get('input[name="password"]').type('senhaValida123');
    cy.get('input[name="confirmPassword"]').type('senhaValida123');
    cy.get('button[type="submit"]').click();

    // Garante que o usuário permaneceu na página de cadastro
    cy.url().should('not.include', '/login');

    // **IMPORTANTE**: Adapte o seletor e o texto para a sua aplicação
    cy.get('.error-message-geral')
      .should('be.visible')
      .and('contain', 'Este e-mail já está em uso.');
  });

  it('Cenário A1.2: Deve exibir erro quando as senhas informadas são diferentes', () => {
    const emailUnico = `teste.senhas.${Date.now()}@exemplo.com`;

    cy.get('input[name="name"]').type('user');
    cy.get('input[name="email"]').type(emailUnico);
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha-diferente-456'); // Senha divergente
    cy.get('button[type="submit"]').click();

    // Garante que o usuário não foi redirecionado
    cy.url().should('not.include', '/login');

    // **IMPORTANTE**: Adapte o seletor e o texto para a sua aplicação
    cy.get('.error-message-password')
      .should('be.visible')
      .and('contain', 'As senhas não coincidem.');
  });
});

// Testes para a funcionalidade de Autenticação de Usuário
describe('HistoriaU2: Autenticação de Usuário', () => {

  // Acessa a página de login antes de cada teste
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Cenário Principal: Deve permitir o login com credenciais válidas', () => {
    cy.get('input[name="email"]').type('usuario.existente@exemplo.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    // Verifica se o login redirecionou para a página correta
    cy.url().should('include', '/area_logada/animais_disponiveis');
    cy.get('h1').contains('Animais disponíveis para adoção').should('be.visible');
  });

  it('Cenário A1: Deve exibir erro com credenciais inválidas', () => {
    cy.get('input[name="email"]').type('usuario.existente@exemplo.com');
    cy.get('input[name="password"]').type('senhaErrada');
    cy.get('button[type="submit"]').click();

    // Verifica o texto de um alerta do navegador após a tentativa de login
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Erro ao logar');
    });
  });
});
