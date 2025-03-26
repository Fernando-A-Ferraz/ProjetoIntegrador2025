describe('Testes de Cadastro de Fornecedores', () => {
    // Configura o estado inicial antes de cada teste
    beforeEach(() => {
      cy.visit('https://projeto-integrador2025-seven.vercel.app/');
      cy.get('#username').type('Fernando.A');
      cy.get('#password').type('969596');
      cy.get('.btn').click();
      cy.contains('Logado como: Fernando.A (user)', { timeout: 10000 }); // Verifica login com timeout maior
    });
  
    it('Deve validar o login do usuário', () => {
      // Como o login já está no beforeEach, apenas verificamos o estado
      cy.url().should('not.include', '/login'); // Garante que saiu da página de login
      cy.contains('Logado como: Fernando.A (user)');
    });
  
    it('Deve cadastrar um novo fornecedor com sucesso', () => {
      // Navegação para fornecedores
      cy.get(':nth-child(2) > .nav-link').click(); // Ajuste para um seletor mais específico, se possível
      cy.get('.mb-3').click(); // Abre o modal
      cy.get('#fornecedor-modal').should('be.visible'); // Verifica se o modal abriu
  
      // Dados do fornecedor
      const fornecedor = {
        cnpj: '12345678901234',
        nomeFantasia: 'Fornecedor Teste',
        razaoSocial: 'Fornecedor Teste Ltda',
        endereco: 'Rua Teste',
        numero: '123',
        complemento: 'Loja 01',
        cep: '12345678',
        bairro: 'Bairro Teste',
        cidade: 'Cidade Teste',
        estado: 'SP',
        telefone: '11999999999',
        contato: 'Master Chife',
      };
  
      // Preenche o formulário
      cy.get('#cnpj-fornecedor').type(fornecedor.cnpj);
      cy.get('#fornecedor-modal .row :nth-child(2) .form-control').type(fornecedor.nomeFantasia);
      cy.get('#fornecedor-modal .row :nth-child(3) .form-control').type(fornecedor.razaoSocial);
      cy.get('#fornecedor-modal .row :nth-child(4) .form-control').type(fornecedor.endereco);
      cy.get('#fornecedor-modal .row :nth-child(5) .form-control').type(fornecedor.numero);
      cy.get('#fornecedor-modal .row :nth-child(6) .form-control').type(fornecedor.complemento);
      cy.get('#cep-fornecedor').type(fornecedor.cep);
      cy.get('#fornecedor-modal .row :nth-child(8) .form-control').type(fornecedor.bairro);
      cy.get('#fornecedor-modal .row :nth-child(9) .form-control').type(fornecedor.cidade);
      cy.get('#fornecedor-modal .row :nth-child(10) .form-control').type(fornecedor.estado);
      cy.get('#telefone-fornecedor').type(fornecedor.telefone);
      cy.get('#fornecedor-modal .row :nth-child(12) .form-control').type(fornecedor.contato);
      cy.get(':nth-child(13) > .btn').click();
  
      // Verificações
      cy.url().should('include', '/fornecedores');
      cy.contains(fornecedor.razaoSocial).should('be.visible'); // Verifica o fornecedor na lista
      cy.contains('Fornecedores');
    });

    it('Deve excluir o fornecedor Fornecedor Teste Ltda', () => {
   
        it('Deve excluir o fornecedor Fornecedor Teste Ltda', () => {
            // Navega para a página de fornecedores
           cy.get(':nth-child(5) > [data-label="Ações"] > .btn-delete').click();
            cy.url().should('include', '/fornecedores');
            cy.contains('Fornecedores');
   
            cy.contains('Fornecedor Teste Ltda').should('not.exist');
        });
    
      });


  });