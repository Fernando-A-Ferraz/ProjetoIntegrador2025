function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function deleteFornecedor(id) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        fetch(`/fornecedores/delete/${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    location.reload();
                }
            });
    }
}

function deleteProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        fetch(`/produtos/delete/${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    location.reload();
                }
            });
    }
}

function editFornecedor(id) {
    fetch(`/fornecedores/edit/${id}`)
        .then(response => response.json())
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
        });
}

function editProduto(id) {
    fetch(`/produtos/edit/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('edit-produto-id').value = data.id;
            document.getElementById('edit-descricao').value = data.descricao;
            document.getElementById('edit-quantidade').value = data.quantidade;
            document.getElementById('edit-fornecedor_id').value = data.fornecedor_id;
            openModal('edit-produto-modal');
        });
}

function maskCNPJ(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    input.value = value;
}

function maskCEP(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    input.value = value;
}

function maskTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = value;
}

document.addEventListener('DOMContentLoaded', () => {
    // Máscaras para empresa
    const cnpjEmpresa = document.getElementById('cnpj-empresa');
    const cepEmpresa = document.getElementById('cep-empresa');
    const telefoneEmpresa = document.getElementById('telefone-empresa');
    if (cnpjEmpresa) cnpjEmpresa.addEventListener('input', () => maskCNPJ(cnpjEmpresa));
    if (cepEmpresa) cepEmpresa.addEventListener('input', () => maskCEP(cepEmpresa));
    if (telefoneEmpresa) telefoneEmpresa.addEventListener('input', () => maskTelefone(telefoneEmpresa));

    // Máscaras para fornecedor (cadastro)
    const cnpjFornecedor = document.getElementById('cnpj-fornecedor');
    const cepFornecedor = document.getElementById('cep-fornecedor');
    const telefoneFornecedor = document.getElementById('telefone-fornecedor');
    if (cnpjFornecedor) cnpjFornecedor.addEventListener('input', () => maskCNPJ(cnpjFornecedor));
    if (cepFornecedor) cepFornecedor.addEventListener('input', () => maskCEP(cepFornecedor));
    if (telefoneFornecedor) telefoneFornecedor.addEventListener('input', () => maskTelefone(telefoneFornecedor));

    // Máscaras para fornecedor (edição)
    const editCnpjFornecedor = document.getElementById('edit-cnpj-fornecedor');
    const editCepFornecedor = document.getElementById('edit-cep-fornecedor');
    const editTelefoneFornecedor = document.getElementById('edit-telefone-fornecedor');
    if (editCnpjFornecedor) editCnpjFornecedor.addEventListener('input', () => maskCNPJ(editCnpjFornecedor));
    if (editCepFornecedor) editCepFornecedor.addEventListener('input', () => maskCEP(editCepFornecedor));
    if (editTelefoneFornecedor) editTelefoneFornecedor.addEventListener('input', () => maskTelefone(editTelefoneFornecedor));

    // Controle do botão Editar/Salvar na tela de empresa
    const editSaveButton = document.getElementById('edit-save-button');
    const empresaForm = document.getElementById('empresa-form');
    if (editSaveButton && empresaForm) {
        editSaveButton.addEventListener('click', () => {
            if (editSaveButton.textContent === 'Editar') {
                // Tornar campos editáveis
                empresaForm.querySelectorAll('input').forEach(input => input.removeAttribute('readonly'));
                editSaveButton.textContent = 'Salvar';
            } else if (editSaveButton.textContent === 'Salvar') {
                // Enviar o formulário
                empresaForm.submit();
            } else if (editSaveButton.textContent === 'Cadastrar') {
                // Permitir edição para cadastro inicial
                empresaForm.querySelectorAll('input').forEach(input => input.removeAttribute('readonly'));
                editSaveButton.textContent = 'Salvar';
            }
        });
    }
});