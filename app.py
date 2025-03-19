# Importa bibliotecas necessárias para o funcionamento do aplicativo
from flask import Flask, render_template, request, redirect, url_for, jsonify, session, flash
from supabase import create_client, Client  # Para conectar ao Supabase (banco de dados)
from dotenv import load_dotenv  # Para carregar variáveis de ambiente de um arquivo .env
import os  # Para acessar variáveis de ambiente do sistema

# Cria o aplicativo Flask (o "esqueleto" da aplicação web)
app = Flask(__name__)
# Define uma chave secreta para proteger as sessões (como um "segredo" para manter o login seguro)
app.secret_key = os.getenv("SECRET_KEY", "sua_chave_secreta_aqui")  # Pega do ambiente ou usa um valor padrão

# Carrega variáveis sensíveis (como URL e chave do Supabase) de um arquivo .env
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")  # URL do banco de dados Supabase
supabase_key = os.getenv("SUPABASE_KEY")  # Chave de acesso ao Supabase
# Cria uma conexão com o Supabase para poder fazer consultas e alterações no banco
supabase: Client = create_client(supabase_url, supabase_key)

# Função que verifica se o usuário está logado (um "porteiro" para certas páginas)
def login_required(f):
    def wrapper(*args, **kwargs):
        # Se não houver usuário na sessão (ou seja, não está logado)
        if 'user' not in session:
            flash('Você precisa estar logado para acessar essa página.', 'error')  # Mostra mensagem de erro
            return redirect(url_for('login'))  # Redireciona para a página de login
        # Se estiver logado, deixa a pessoa entrar na página
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__  # Mantém o nome da função original
    return wrapper

# Função que verifica se o usuário é administrador (outro "porteiro", mas mais exigente)
def admin_required(f):
    def wrapper(*args, **kwargs):
        # Se não está logado ou não é admin
        if 'user' not in session or session['user']['role'] != 'admin':
            flash('Acesso restrito a administradores.', 'error')  # Mostra mensagem de erro
            return redirect(url_for('login'))  # Redireciona para o login
        # Se for admin, permite o acesso
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__  # Mantém o nome da função original
    return wrapper

# Rota para a página de login (onde o usuário entra no sistema)
@app.route('/login', methods=['GET', 'POST'])  # Aceita requisições GET (ver a página) e POST (enviar dados)
def login():
    if request.method == 'POST':  # Se o usuário enviou o formulário de login
        username = request.form['username']  # Pega o nome de usuário do formulário
        password = request.form['password']  # Pega a senha do formulário
        # Consulta o banco de dados para ver se o usuário e senha estão corretos
        user = supabase.table('usuarios').select('*').eq('username', username).eq('password', password).execute().data
        if user:  # Se encontrou o usuário
            session['user'] = user[0]  # Salva os dados do usuário na sessão (mantém ele logado)
            flash('Login realizado com sucesso!', 'success')  # Mostra mensagem de sucesso
            if user[0]['role'] == 'admin':  # Se for administrador
                return redirect(url_for('usuarios'))  # Vai para a página de usuários
            return redirect(url_for('empresa'))  # Se for usuário normal, vai para a página da empresa
        flash('Usuário ou senha incorretos.', 'error')  # Se não encontrou, mostra erro
    return render_template('login.html')  # Mostra a página de login

# Rota para sair do sistema (logout)
@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove o usuário da sessão (desloga)
    flash('Você foi deslogado.', 'success')  # Mostra mensagem de sucesso
    return redirect(url_for('login'))  # Volta para a página de login

# Página de gerenciamento de usuários (só para admins)
@app.route('/usuarios', methods=['GET', 'POST'])
@admin_required  # Só deixa admins entrarem
def usuarios():
    if request.method == 'POST':  # Se o admin enviou um formulário para criar um usuário
        data = {  # Coleta os dados do novo usuário
            "username": request.form['username'],
            "password": request.form['password'],
            "role": 'user'  # Todos os novos usuários são normais, não admins
        }
        # Verifica se o nome de usuário já existe no banco
        existing_user = supabase.table('usuarios').select('id').eq('username', data['username']).execute().data
        if existing_user:  # Se já existe
            flash('Nome de usuário já existe.', 'error')  # Mostra erro
        else:  # Se não existe
            supabase.table('usuarios').insert(data).execute()  # Cadastra o novo usuário no banco
            flash('Usuário cadastrado com sucesso!', 'success')  # Mostra sucesso
        return redirect(url_for('usuarios'))  # Recarrega a página
    
    # Pega todos os usuários do banco, ordenados por ID
    usuarios_data = supabase.table('usuarios').select('*').order('id', desc=False).execute().data
    return render_template('usuarios.html', usuarios=usuarios_data)  # Mostra a página com a lista de usuários

# Rota para mudar a senha de um usuário (só admins)
@app.route('/usuarios/update/<int:id>', methods=['POST'])
@admin_required
def update_usuario(id):  # O "id" é o número do usuário a ser alterado
    try:  # Tenta fazer a alteração
        new_password = request.form['password']  # Pega a nova senha do formulário
        # Atualiza a senha no banco de dados
        supabase.table('usuarios').update({'password': new_password}).eq('id', id).execute()
        return jsonify({'success': 'Senha atualizada com sucesso!'})  # Responde com sucesso em JSON
    except Exception as e:  # Se der erro
        return jsonify({'error': str(e)}), 400  # Responde com o erro em JSON

# Rota para excluir um usuário (só admins)
@app.route('/usuarios/delete/<int:id>', methods=['POST'])
@admin_required
def delete_usuario(id):
    # Verifica se o usuário a ser excluído é o "admin"
    user = supabase.table('usuarios').select('username').eq('id', id).execute().data[0]
    if user['username'] == 'admin':  # Se for o admin
        return jsonify({'error': 'Não é possível excluir o usuário admin.'}), 400  # Não deixa excluir
    # Se não for o admin, exclui o usuário do banco
    supabase.table('usuarios').delete().eq('id', id).execute()
    return jsonify({'success': 'Usuário excluído com sucesso'})  # Responde com sucesso

# Página principal (dados da empresa, só para usuários normais)
@app.route('/', methods=['GET', 'POST'])
@login_required
def empresa():
    if session['user']['role'] == 'admin':  # Se for admin
        flash('Acesso restrito a usuários normais.', 'error')  # Mostra erro
        return redirect(url_for('usuarios'))  # Redireciona para a página de usuários
    # Pega os dados da empresa do banco (só 1 registro)
    empresa_data = supabase.table('empresa').select('*').limit(1).execute().data
    if request.method == 'POST':  # Se o usuário enviou o formulário
        data = {  # Coleta os dados da empresa
            "cnpj": request.form['cnpj'],
            "razao_social": request.form['razao_social'],
            "nome_fantasia": request.form['nome_fantasia'],
            "rua": request.form['rua'],
            "numero": request.form['numero'],
            "complemento": request.form['complemento'],
            "cep": request.form['cep'],
            "bairro": request.form['bairro'],
            "cidade": request.form['cidade'],
            "estado": request.form['estado'],
            "telefone": request.form['telefone']
        }
        if empresa_data:  # Se já existe um registro
            supabase.table('empresa').update(data).eq('id', empresa_data[0]['id']).execute()  # Atualiza
        else:  # Se não existe
            supabase.table('empresa').insert(data).execute()  # Cria novo
        return redirect(url_for('empresa'))  # Recarrega a página
    # Mostra a página com os dados da empresa (ou nada, se não houver)
    return render_template('empresa.html', empresa=empresa_data[0] if empresa_data else None)

# Página de fornecedores (só para usuários normais)
@app.route('/fornecedores', methods=['GET', 'POST'])
@login_required
def fornecedores():
    if session['user']['role'] == 'admin':  # Se for admin
        flash('Acesso restrito a usuários normais.', 'error')  # Mostra erro
        return redirect(url_for('usuarios'))  # Redireciona
    if request.method == 'POST':  # Se enviou o formulário
        data = {  # Coleta os dados do fornecedor
            "cnpj": request.form['cnpj'],
            "razao_social": request.form['razao_social'],
            "nome_fantasia": request.form['nome_fantasia'],
            "rua": request.form['rua'],
            "numero": request.form['numero'],
            "complemento": request.form['complemento'],
            "cep": request.form['cep'],
            "bairro": request.form['bairro'],
            "cidade": request.form['cidade'],
            "estado": request.form['estado'],
            "telefone": request.form['telefone'],
            "representante": request.form['representante']
        }
        if 'id' in request.form:  # Se tem ID, é uma atualização
            supabase.table('fornecedor').update(data).eq('id', request.form['id']).execute()
        else:  # Se não tem ID, é uma inserção
            supabase.table('fornecedor').insert(data).execute()
        return redirect(url_for('fornecedores'))  # Recarrega a página
    
    # Pega os fornecedores do banco (apenas alguns campos)
    fornecedores_data = supabase.table('fornecedor').select('id, nome_fantasia, telefone, representante').order('id', desc=False).execute().data
    return render_template('fornecedores.html', fornecedores=fornecedores_data)  # Mostra a lista

# Rota para excluir fornecedor
@app.route('/fornecedores/delete/<int:id>', methods=['POST'])
@login_required
def delete_fornecedor(id):
    if session['user']['role'] == 'admin':  # Se for admin
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403  # Não deixa
    # Verifica se o fornecedor tem produtos vinculados
    produtos = supabase.table('produto').select('id').eq('fornecedor_id', id).execute().data
    if produtos:  # Se tiver produtos
        return jsonify({'error': 'Não é possível excluir fornecedor com produtos vinculados'}), 400  # Não deixa excluir
    supabase.table('fornecedor').delete().eq('id', id).execute()  # Exclui o fornecedor
    return jsonify({'success': 'Fornecedor excluído com sucesso'})  # Responde com sucesso

# Rota para pegar dados de um fornecedor (para edição)
@app.route('/fornecedores/edit/<int:id>', methods=['GET'])
@login_required
def get_fornecedor(id):
    if session['user']['role'] == 'admin':  # Se for admin
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403  # Não deixa
    # Pega os dados do fornecedor no banco
    fornecedor = supabase.table('fornecedor').select('*').eq('id', id).execute().data[0]
    return jsonify(fornecedor)  # Retorna os dados em JSON

# Página de produtos (só para usuários normais)
@app.route('/produtos', methods=['GET', 'POST'])
@login_required
def produtos():
    if session['user']['role'] == 'admin':  # Se for admin
        flash('Acesso restrito a usuários normais.', 'error')  # Mostra erro
        return redirect(url_for('usuarios'))  # Redireciona
    if request.method == 'POST':  # Se enviou o formulário
        data = {  # Coleta os dados do produto
            "descricao": request.form['descricao'],
            "quantidade": int(request.form['quantidade']),  # Converte para número
            "fornecedor_id": int(request.form['fornecedor_id'])  # Converte para número
        }
        if 'id' in request.form:  # Se tem ID, atualiza
            supabase.table('produto').update(data).eq('id', request.form['id']).execute()
        else:  # Se não tem ID, cria novo
            supabase.table('produto').insert(data).execute()
        return redirect(url_for('produtos'))  # Recarrega a página
    
    # Pega os produtos e fornecedores do banco
    produtos_data = supabase.table('produto').select('id, descricao, quantidade, fornecedor(nome_fantasia)').order('id', desc=False).execute().data
    fornecedores = supabase.table('fornecedor').select('id, nome_fantasia').execute().data
    return render_template('produtos.html', produtos=produtos_data, fornecedores=fornecedores)  # Mostra a página

# Rota para excluir produto
@app.route('/produtos/delete/<int:id>', methods=['POST'])
@login_required
def delete_produto(id):
    if session['user']['role'] == 'admin':  # Se for admin
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403  # Não deixa
    # Verifica a quantidade do produto
    produto = supabase.table('produto').select('quantidade').eq('id', id).execute().data[0]
    if produto['quantidade'] > 0:  # Se tiver quantidade maior que 0
        return jsonify({'error': 'Não é possível excluir produto com quantidade maior que 0'}), 400  # Não deixa
    supabase.table('produto').delete().eq('id', id).execute()  # Exclui o produto
    return jsonify({'success': 'Produto excluído com sucesso'})  # Responde com sucesso

# Rota para pegar dados de um produto (para edição)
@app.route('/produtos/edit/<int:id>', methods=['GET'])
@login_required
def get_produto(id):
    if session['user']['role'] == 'admin':  # Se for admin
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403  # Não deixa
    # Pega os dados do produto no banco
    produto = supabase.table('produto').select('id, descricao, quantidade, fornecedor_id').eq('id', id).execute().data[0]
    return jsonify(produto)  # Retorna os dados em JSON

# Inicia o aplicativo localmente (removido para o Vercel em produção)
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Roda o app em modo de teste na porta 5000