// Testes para a funcionalidade de Edição de Perfil de Usuário
describe('HistoriaU3: Edição de Perfil de Usuário', () => {

  // Credenciais do usuário de teste para o login
  const email = 'usuario.existente@exemplo.com';
  const senha = 'senha123';

  // Função auxiliar que gera letras aleatórias para criar nomes de usuário únicos
  function gerarLetras(tamanho) {
    const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
      resultado += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    return resultado;
  }

  it('Deve permitir alterar o nome do utilizador e confirmar a alteração no backend', () => {
    // Gera um novo nome único para garantir que a alteração seja real a cada teste
    const novoNome = `usuario${gerarLetras(8)}`;

    // --- ETAPA 1: Fazer login e editar o nome ---

    cy.login(email, senha); // Comando customizado de login
    cy.visit('/area_logada/editar_dados');

    // Intercepta a chamada PATCH para a API de usuários para validar a resposta do servidor
    cy.intercept('PATCH', '**/users').as('editarUsuario');

    // Seleciona o campo, limpa e insere o novo nome
    cy.get('input[name="name"]', { timeout: 15000 })
      .clear({ force: true })
      .type(novoNome, { force: true });

    cy.get('button[type="submit"]').contains('Salvar').click({ force: true });

    // Aguarda a requisição de edição e verifica se o status da resposta foi 200 (Sucesso)
    cy.wait('@editarUsuario').its('response.statusCode').should('eq', 200);

    // --- ETAPA 2: Fazer login novamente para validar a persistência dos dados ---

    cy.visit('/login');

    // Intercepta a resposta do login para verificar se os dados do usuário foram atualizados
    cy.intercept('POST', '**/login').as('loginUser');

    cy.get('input[name="email"]', { timeout: 15000 }).type(email, { force: true });
    cy.get('input[name="password"]').type(senha, { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    // Após o login, verifica se o nome retornado pela API é o nome que acabamos de salvar
    cy.wait('@loginUser').then(({ response }) => {
      // Opcional: log no console do Cypress para depuração
      console.log('Corpo da Resposta da API de Login:', response.body);

      // Verificação final: o nome do usuário no backend deve ser igual ao novo nome
      expect(response.body.user.name).to.eq(novoNome);
    });
  });
});
