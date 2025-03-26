describe('Testes de Login', () => {
    beforeEach(() => {
        cy.visit('https://projeto-integrador2025-seven.vercel.app/');
      });
    
      it('Deve falhar ao fazer login com senha inválida', () => {
        cy.visit('https://projeto-integrador2025-seven.vercel.app/'); 
        cy.get('#username').type('admin');
        cy.get('#password').type('admin123'); 
        cy.get('.btn').click();
        cy.contains('Usuário ou senha incorretos.'); 
      });
  
    it('Deve fazer login com admin/admin com sucesso', () => {
 
      cy.get('#username').type('admin')
        cy.get('#password').type('admin')
        cy.get('.btn').click()
        cy.url().should('include', '/usuarios'); 
    cy.contains('Menu'); 
        
 });



 it('Deve cadastrar um novo usuário após login com admin', () => {

    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('.btn').click();

    
    cy.get('.mb-3').click(); 
    cy.get('#usuario-modal > .modal-content > form > .row > :nth-child(1) > .form-control').type('Fernando')
    cy.get(':nth-child(2) > .form-control').type('123456')
    cy.get(':nth-child(3) > .btn').click();                       
    cy.contains('Usuário cadastrado com sucesso!'); 

  it('Deve fazer login com o novo usuário', () => {
    cy.get('#username').type('Fernando');
    cy.get('#password').type('123456');
    cy.get('.btn').click();
    cy.url().should('include', '/usuarios');
 몸

    cy.contains('Menu');
  });

});


it('Deve enviar mensagem de erro, nome de usuario ja cadastrado', () => {

    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('.btn').click();

    
    cy.get('.mb-3').click(); 
    cy.get('#usuario-modal > .modal-content > form > .row > :nth-child(1) > .form-control').type('Fernando')
    cy.get(':nth-child(2) > .form-control').type('123456')
    cy.get(':nth-child(3) > .btn').click();                       
           cy.contains('Nome de usuário já existe.'); 

  
  
});

it('Deve excluir o usuário Fernando', () => {
   
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('.btn').click();
    cy.url().should('include', '/usuarios');
    cy.contains('Menu'); 
    cy.get(':nth-child(5) > [data-label="Ações"] > .btn-delete').click();
  

  });


 

});
