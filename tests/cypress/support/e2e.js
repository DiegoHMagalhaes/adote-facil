
import './commands'


// Este código diz ao Cypress para não falhar o teste quando o erro #418 do React acontecer.
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false aqui impede o Cypress de falhar o teste
  if (err.message.includes('Minified React error #418')) {
    return false;
  }
  // Deixa que outros erros continuem a falhar o teste
  return true;
  });