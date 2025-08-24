/**
 * Testes para HistoriaU3: Edição de Perfil de Usuário
 * Este bloco contém os testes para a funcionalidade de alterar os dados do perfil do usuário.
 */
describe('HistoriaU3: Edição de Perfil de Usuário', () => {

  // Definimos as credenciais de um usuário de teste fixo que usaremos para o login.
  const email = 'usuario.existente@exemplo.com';
  const senha = 'senha123';

  // Esta é uma função auxiliar para gerar uma string aleatória.
  // Usamos isso para criar um novo nome de usuário a cada execução do teste,
  // garantindo que estamos sempre testando uma alteração real.
  function gerarLetras(tamanho) {
    const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
      resultado += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    return resultado;
  }

  // Este é o caso de teste principal para a edição de perfil.
  it('Deve permitir alterar o nome do utilizador e confirmar a alteração no backend', () => {
    // Criamos um novo nome único, combinando "usuario" com 8 letras aleatórias.
    const novoNome = `usuario${gerarLetras(8)}`;

    // --- PARTE 1: FAZ LOGIN E EDITA O NOME ---

    // Usamos um comando customizado de login para simplificar o teste.
    cy.login(email, senha);
    // Visitamos a página de edição de dados do usuário.
    cy.visit('/area_logada/editar_dados');

    // O cy.intercept é uma ferramenta poderosa do Cypress. Aqui, ele fica "escutando"
    // a comunicação entre o site e o servidor. Estamos esperando por uma requisição
    // do tipo PATCH para a rota de 'users' e damos a ela um apelido ('editarUsuario').
    cy.intercept('PATCH', '**/users').as('editarUsuario');

    // Selecionamos o campo de nome, garantindo que ele exista.
    // O { force: true } ajuda a evitar erros se o campo estiver temporariamente desabilitado ou coberto.
    cy.get('input[name="name"]', { timeout: 15000 }).should('exist').as('campoNome');
    cy.get('@campoNome').clear({ force: true }).type(novoNome, { force: true });

    // Clicamos no botão "Salvar" para submeter a alteração.
    cy.get('button[type="submit"]').contains('Salvar').click({ force: true });

    // O cy.wait() pausa o teste até que a requisição que apelidamos de 'editarUsuario' aconteça.
    // Depois, verificamos se o código de status da resposta foi 200, que significa "OK" (sucesso).
    cy.wait('@editarUsuario').its('response.statusCode').should('eq', 200);

    // --- PARTE 2: LOGA NOVAMENTE PARA CONFIRMAR A MUDANÇA NO BACKEND ---
    // Esta segunda parte é crucial para garantir que a alteração foi salva permanentemente no banco de dados.

    // Voltamos para a página de login.
    cy.visit('/login');
    // Agora, interceptamos a requisição de login (POST para /login) para poder inspecionar a resposta.
    cy.intercept('POST', '**/login').as('loginUser');

    // Preenchemos os dados de login novamente.
    cy.get('input[name="email"]', { timeout: 15000 }).type(email, { force: true });
    cy.get('input[name="password"]').type(senha, { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    // Esperamos a requisição de login completar e usamos o .then() para acessar os detalhes da resposta do servidor.
    cy.wait('@loginUser').then(({ response }) => {
      // Este console.log é útil para depuração, pois mostra no console do Cypress o corpo da resposta da API.
      console.log('Corpo da Resposta da API de Login:', response.body);
      
      // Esta é a verificação final e mais importante:
      // Acessamos o corpo da resposta (`response.body.user.name`) e confirmamos
      // que o nome do usuário que o servidor retornou é igual ao `novoNome` que geramos.
      expect(response.body.user.name).to.eq(novoNome);
    });
  });

});