// Funções para abrir e fechar modais
// Um modal é uma janela pop-up que aparece sobre o conteúdo da página.

// Função para abrir um modal específico
function openModal(modalId) {
    // Procura o elemento do modal pelo ID fornecido (exemplo: 'change-password-modal')
    const modal = document.getElementById(modalId);
    if (modal) {
        // Se o modal for encontrado, muda seu estilo para 'block', tornando-o visível na página
        modal.style.display = 'block';
    } else {
        // Se o modal não existir, exibe um aviso no console (ferramenta de desenvolvedor) para ajudar a identificar o erro
        console.error(`Modal com ID ${modalId} não encontrado`);
    }
}

// Função para fechar um modal específico
function closeModal(modalId) {
    // Procura o elemento do modal pelo ID fornecido
    const modal = document.getElementById(modalId);
    if (modal) {
        // Se o modal for encontrado, muda seu estilo para 'none', escondendo-o da página
        modal.style.display = 'none';
    } else {
        // Se o modal não existir, exibe um aviso no console para indicar o problema
        console.error(`Modal com ID ${modalId} não encontrado`);
    }
}

// Manipular o botão Editar/Salvar da tela de empresa
// Este código só roda quando a página inteira estiver carregada
document.addEventListener('DOMContentLoaded', function() {
    // Pega o botão de editar/salvar e o formulário da empresa pelo seus IDs
    const editSaveButton = document.getElementById('edit-save-button');
    const form = document.getElementById('empresa-form');
    // Variável para saber se estamos no modo de edição (true) ou não (false)
    let isEditing = false;

    // Verifica se o botão existe antes de adicionar ações a ele
    if (editSaveButton) {
        // Adiciona uma ação para quando o botão for clicado
        editSaveButton.addEventListener('click', function() {
            if (!isEditing) {
                // Modo Edição: o usuário quer editar os dados
                // Pega todos os campos de entrada (inputs) que estão como 'somente leitura'
                const inputs = form.querySelectorAll('input[readonly]');
                // Remove o 'readonly' de cada campo, permitindo que o usuário edite
                inputs.forEach(input => input.removeAttribute('readonly'));
                // Muda o texto do botão de 'Editar' para 'Salvar'
                editSaveButton.textContent = 'Salvar';
                // Troca a cor do botão (remove azul e adiciona verde)
                editSaveButton.classList.remove('btn-primary');
                editSaveButton.classList.add('btn-success');
                // Atualiza a variável para indicar que estamos no modo de edição
                isEditing = true;
            } else {
                // Modo Salvar: o usuário terminou de editar e quer salvar
                // Envia o formulário para o servidor
                form.submit();
            }
        });
    }

    // Manipular o formulário de alteração de senha
    // Pega o formulário de mudança de senha pelo ID
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        // Adiciona uma ação para quando o formulário for enviado
        changePasswordForm.addEventListener('submit', function(e) {
            // Impede que o formulário seja enviado automaticamente (dá tempo para processar)
            e.preventDefault();
            // Pega o ID do usuário e a nova senha digitada
            const id = document.getElementById('change-password-id').value;
            const password = document.getElementById('new-password').value;
            // Envia os dados ao servidor usando uma requisição POST
            fetch(`/usuarios/update/${id}`, {
                method: 'POST', // Método POST para atualizar dados
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Formato dos dados enviados
                },
                body: new URLSearchParams({ // Organiza os dados para envio
                    'password': password
                })
            })
            .then(response => {
                // Verifica se a resposta do servidor foi um erro
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                // Converte a resposta do servidor para um formato utilizável (JSON)
                return response.json();
            })
            .then(data => {
                // Se o servidor retornou um erro, mostra uma mensagem
                if (data.error) {
                    alert(data.error);
                } else {
                    // Se deu certo, mostra uma mensagem de sucesso, fecha o modal e recarrega a página
                    alert(data.success);
                    closeModal('change-password-modal');
                    location.reload();
                }
            })
            .catch(error => {
                // Se algo deu errado na requisição, avisa o usuário e mostra o erro no console
                console.error('Erro ao alterar senha:', error);
                alert('Ocorreu um erro ao alterar a senha. Verifique o console para detalhes.');
            });
        });
    }
});

// Função para abrir o modal de alteração de senha
function openChangePasswordModal(id) {
    // Coloca o ID do usuário em um campo escondido no formulário
    document.getElementById('change-password-id').value = id;
    // Abre o modal de mudança de senha
    openModal('change-password-modal');
}

// Função para excluir usuário
function deleteUsuario(id) {
    // Pergunta ao usuário se ele realmente quer excluir
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        // Envia uma requisição ao servidor para excluir o usuário
        fetch(`/usuarios/delete/${id}`, { method: 'POST' })
            .then(response => response.json()) // Converte a resposta para JSON
            .then(data => {
                // Se houver erro, mostra uma mensagem
                if (data.error) {
                    alert(data.error);
                } else {
                    // Se deu certo, recarrega a página
                    location.reload();
                }
            })
            .catch(error => console.error('Erro ao excluir usuário:', error)); // Mostra erro no console se falhar
    }
}

// Função para editar fornecedor
function editFornecedor(id) {
    // Pede os dados do fornecedor ao servidor
    fetch(`/fornecedores/edit/${id}`)
        .then(response => {
            // Se a resposta tiver problema, avisa
            if (!response.ok) throw new Error('Erro ao buscar fornecedor');
            return response.json(); // Converte os dados para JSON
        })
        .then(data => {
            // Preenche os campos do formulário com os dados do fornecedor
            document.getElementById('edit-fornecedor-id').value = data.id;
            document.getElementById('edit-cnpj-fornecedor').value = data.cnpj;
            document.getElementById('edit-razao_social').value = data.razao_social;
            document.getElementById('edit-nome_fantasia').value = data.nome_fantasia;
            document.getElementById('edit-rua').value = data.rua;
            document.getElementById('edit-numero').value = data.numero;
            document.getElementById('edit-complemento').value = data.complemento || '';
            document.getElementById('edit-cep-fornecedor').value = data.cep;
            document.getElementById('edit-bairro').value = data.bairro;
            document.getElementById('edit-cidade').value = data.cidade;
            document.getElementById('edit-estado').value = data.estado;
            document.getElementById('edit-telefone-fornecedor').value = data.telefone;
            document.getElementById('edit-representante').value = data.representante;
            // Abre o modal para editar o fornecedor
            openModal('edit-fornecedor-modal');
        })
        .catch(error => console.error('Erro ao editar fornecedor:', error)); // Mostra erro no console se falhar
}

// Função para excluir fornecedor
function deleteFornecedor(id) {
    // Pergunta ao usuário se ele quer mesmo excluir
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        // Envia uma requisição ao servidor para excluir o fornecedor
        fetch(`/fornecedores/delete/${id}`, { method: 'POST' })
            .then(response => {
                // Converte a resposta para JSON e guarda o status
                return response.json().then(data => ({
                    status: response.status,
                    data: data
                }));
            })
            .then(result => {
                // Se houver erro (status diferente de 200), avisa
                if (result.status !== 200) {
                    throw new Error(result.data.error || 'Erro desconhecido ao excluir fornecedor');
                }
                // Se deu certo, mostra mensagem e recarrega a página
                alert(result.data.success);
                location.reload();
            })
            .catch(error => {
                // Mostra o erro para o usuário e no console
                alert(error.message);
                console.error('Erro ao excluir fornecedor:', error);
            });
    }
}

// Função para editar produto
function editProduto(id) {
    // Pede os dados do produto ao servidor
    fetch(`/produtos/edit/${id}`)
        .then(response => {
            // Se houver erro na resposta, avisa
            if (!response.ok) throw new Error('Erro ao buscar produto');
            return response.json(); // Converte os dados para JSON
        })
        .then(data => {
            // Preenche os campos do formulário com os dados do produto
            document.getElementById('edit-produto-id').value = data.id;
            document.getElementById('edit-descricao').value = data.descricao;
            document.getElementById('edit-quantidade').value = data.quantidade;
            document.getElementById('edit-fornecedor_id').value = data.fornecedor_id;
            // Abre o modal para editar o produto
            openModal('edit-produto-modal');
        })
        .catch(error => console.error('Erro ao editar produto:', error)); // Mostra erro no console se falhar
}

// Função para excluir produto
function deleteProduto(id) {
    // Pergunta ao usuário se ele quer mesmo excluir
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        // Envia uma requisição ao servidor para excluir o produto
        fetch(`/produtos/delete/${id}`, { method: 'POST' })
            .then(response => {
                // Converte a resposta para JSON e guarda o status
                return response.json().then(data => ({
                    status: response.status,
                    data: data
                }));
            })
            .then(result => {
                // Se houver erro (status diferente de 200), avisa
                if (result.status !== 200) {
                    throw new Error(result.data.error || 'Erro desconhecido ao excluir produto');
                }
                // Se deu certo, mostra mensagem e recarrega a página
                alert(result.data.success);
                location.reload();
            })
            .catch(error => {
                // Mostra o erro para o usuário e no console
                alert(error.message);
                console.error('Erro ao excluir produto:', error);
            });
    }
}

// Fechar modais ao clicar fora
// Esta função fecha qualquer modal aberto se o usuário clicar fora dele
window.onclick = function(event) {
    // Pega todos os elementos da página que têm a classe 'modal'
    const modals = document.getElementsByClassName('modal');
    // Para cada modal, verifica se o clique foi no fundo do modal
    for (let modal of modals) {
        if (event.target === modal) {
            // Se sim, esconde o modal
            modal.style.display = 'none';
        }
    }
};