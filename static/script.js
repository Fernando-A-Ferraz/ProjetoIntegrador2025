// Funções para abrir e fechar modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error(`Modal com ID ${modalId} não encontrado`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`Modal com ID ${modalId} não encontrado`);
    }
}

// Manipular o botão Editar/Salvar da tela de empresa
document.addEventListener('DOMContentLoaded', function() {
    const editSaveButton = document.getElementById('edit-save-button');
    const form = document.getElementById('empresa-form');
    let isEditing = false;

    if (editSaveButton) {
        editSaveButton.addEventListener('click', function() {
            if (!isEditing) {
                // Modo Edição
                const inputs = form.querySelectorAll('input[readonly]');
                inputs.forEach(input => input.removeAttribute('readonly'));
                editSaveButton.textContent = 'Salvar';
                editSaveButton.classList.remove('btn-primary');
                editSaveButton.classList.add('btn-success');
                isEditing = true;
            } else {
                // Modo Salvar
                form.submit();
            }
        });
    }

    // Manipular o formulário de alteração de senha
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('change-password-id').value;
            const password = document.getElementById('new-password').value;
            fetch(`/usuarios/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'password': password
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.success);
                    closeModal('change-password-modal');
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Erro ao alterar senha:', error);
                alert('Ocorreu um erro ao alterar a senha. Verifique o console para detalhes.');
            });
        });
    }
});

// Função para abrir o modal de alteração de senha
function openChangePasswordModal(id) {
    document.getElementById('change-password-id').value = id;
    openModal('change-password-modal');
}

// Função para excluir usuário
function deleteUsuario(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        fetch(`/usuarios/delete/${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    location.reload();
                }
            })
            .catch(error => console.error('Erro ao excluir usuário:', error));
    }
}

// Editar Fornecedor
function editFornecedor(id) {
    fetch(`/fornecedores/edit/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar fornecedor');
            return response.json();
        })
        .then(data => {
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
            openModal('edit-fornecedor-modal');
        })
        .catch(error => console.error('Erro ao editar fornecedor:', error));
}

// Excluir Fornecedor
function deleteFornecedor(id) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        fetch(`/fornecedores/delete/${id}`, { method: 'POST' })
            .then(response => {
                return response.json().then(data => ({
                    status: response.status,
                    data: data
                }));
            })
            .then(result => {
                if (result.status !== 200) {
                    throw new Error(result.data.error || 'Erro desconhecido ao excluir fornecedor');
                }
                alert(result.data.success);
                location.reload();
            })
            .catch(error => {
                alert(error.message);
                console.error('Erro ao excluir fornecedor:', error);
            });
    }
}

// Editar Produto
function editProduto(id) {
    fetch(`/produtos/edit/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar produto');
            return response.json();
        })
        .then(data => {
            document.getElementById('edit-produto-id').value = data.id;
            document.getElementById('edit-descricao').value = data.descricao;
            document.getElementById('edit-quantidade').value = data.quantidade;
            document.getElementById('edit-fornecedor_id').value = data.fornecedor_id;
            openModal('edit-produto-modal');
        })
        .catch(error => console.error('Erro ao editar produto:', error));
}

// Excluir Produto
function deleteProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        fetch(`/produtos/delete/${id}`, { method: 'POST' })
            .then(response => {
                return response.json().then(data => ({
                    status: response.status,
                    data: data
                }));
            })
            .then(result => {
                if (result.status !== 200) {
                    throw new Error(result.data.error || 'Erro desconhecido ao excluir produto');
                }
                alert(result.data.success);
                location.reload();
            })
            .catch(error => {
                alert(error.message);
                console.error('Erro ao excluir produto:', error);
            });
    }
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
};