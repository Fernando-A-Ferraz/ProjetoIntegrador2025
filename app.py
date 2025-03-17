from flask import Flask, render_template, request, redirect, url_for, jsonify, session, flash
from supabase import create_client, Client
from dotenv import load_dotenv
import os

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "sua_chave_secreta_aqui")  # Necessário para sessões

# Carregar variáveis de ambiente
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Middleware para verificar se o usuário está logado e tem permissão
def login_required(f):
    def wrapper(*args, **kwargs):
        if 'user' not in session:
            flash('Você precisa estar logado para acessar essa página.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

def admin_required(f):
    def wrapper(*args, **kwargs):
        if 'user' not in session or session['user']['role'] != 'admin':
            flash('Acesso restrito a administradores.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

# Rota de Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = supabase.table('usuarios').select('*').eq('username', username).eq('password', password).execute().data
        if user:
            session['user'] = user[0]
            flash('Login realizado com sucesso!', 'success')
            if user[0]['role'] == 'admin':
                return redirect(url_for('usuarios'))
            return redirect(url_for('empresa'))
        flash('Usuário ou senha incorretos.', 'error')
    return render_template('login.html')

# Rota de Logout
@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('Você foi deslogado.', 'success')
    return redirect(url_for('login'))

# Tela de Usuários (somente admin)
@app.route('/usuarios', methods=['GET', 'POST'])
@admin_required
def usuarios():
    if request.method == 'POST':
        data = {
            "username": request.form['username'],
            "password": request.form['password'],
            "role": 'user'  # Apenas admin pode criar usuários, e todos serão 'user'
        }
        # Verificar se o username já existe
        existing_user = supabase.table('usuarios').select('id').eq('username', data['username']).execute().data
        if existing_user:
            flash('Nome de usuário já existe.', 'error')
        else:
            supabase.table('usuarios').insert(data).execute()
            flash('Usuário cadastrado com sucesso!', 'success')
        return redirect(url_for('usuarios'))
    
    usuarios_data = supabase.table('usuarios').select('*').order('id', desc=False).execute().data
    return render_template('usuarios.html', usuarios=usuarios_data)

# Alterar Senha de Usuário
@app.route('/usuarios/update/<int:id>', methods=['POST'])
@admin_required
def update_usuario(id):
    try:
        new_password = request.form['password']
        supabase.table('usuarios').update({'password': new_password}).eq('id', id).execute()
        return jsonify({'success': 'Senha atualizada com sucesso!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Excluir Usuário
@app.route('/usuarios/delete/<int:id>', methods=['POST'])
@admin_required
def delete_usuario(id):
    # Não permitir excluir o admin
    user = supabase.table('usuarios').select('username').eq('id', id).execute().data[0]
    if user['username'] == 'admin':
        return jsonify({'error': 'Não é possível excluir o usuário admin.'}), 400
    supabase.table('usuarios').delete().eq('id', id).execute()
    return jsonify({'success': 'Usuário excluído com sucesso'})

# Tela principal (Empresa) - Apenas para usuários normais
@app.route('/', methods=['GET', 'POST'])
@login_required
def empresa():
    if session['user']['role'] == 'admin':
        flash('Acesso restrito a usuários normais.', 'error')
        return redirect(url_for('usuarios'))
    empresa_data = supabase.table('empresa').select('*').limit(1).execute().data
    if request.method == 'POST':
        data = {
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
        if empresa_data:
            supabase.table('empresa').update(data).eq('id', empresa_data[0]['id']).execute()
        else:
            supabase.table('empresa').insert(data).execute()
        return redirect(url_for('empresa'))
    return render_template('empresa.html', empresa=empresa_data[0] if empresa_data else None)

# Tela de fornecedores - Apenas para usuários normais
@app.route('/fornecedores', methods=['GET', 'POST'])
@login_required
def fornecedores():
    if session['user']['role'] == 'admin':
        flash('Acesso restrito a usuários normais.', 'error')
        return redirect(url_for('usuarios'))
    if request.method == 'POST':
        data = {
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
        if 'id' in request.form:  # Atualização
            supabase.table('fornecedor').update(data).eq('id', request.form['id']).execute()
        else:  # Inserção
            supabase.table('fornecedor').insert(data).execute()
        return redirect(url_for('fornecedores'))
    
    fornecedores_data = supabase.table('fornecedor').select('id, nome_fantasia, telefone, representante').order('id', desc=False).execute().data
    return render_template('fornecedores.html', fornecedores=fornecedores_data)

# Excluir fornecedor
@app.route('/fornecedores/delete/<int:id>', methods=['POST'])
@login_required
def delete_fornecedor(id):
    if session['user']['role'] == 'admin':
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403
    produtos = supabase.table('produto').select('id').eq('fornecedor_id', id).execute().data
    if produtos:
        return jsonify({'error': 'Não é possível excluir fornecedor com produtos vinculados'}), 400
    supabase.table('fornecedor').delete().eq('id', id).execute()
    return jsonify({'success': 'Fornecedor excluído com sucesso'})

# Dados do fornecedor para edição
@app.route('/fornecedores/edit/<int:id>', methods=['GET'])
@login_required
def get_fornecedor(id):
    if session['user']['role'] == 'admin':
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403
    fornecedor = supabase.table('fornecedor').select('*').eq('id', id).execute().data[0]
    return jsonify(fornecedor)

# Tela de produtos - Apenas para usuários normais
@app.route('/produtos', methods=['GET', 'POST'])
@login_required
def produtos():
    if session['user']['role'] == 'admin':
        flash('Acesso restrito a usuários normais.', 'error')
        return redirect(url_for('usuarios'))
    if request.method == 'POST':
        data = {
            "descricao": request.form['descricao'],
            "quantidade": int(request.form['quantidade']),
            "fornecedor_id": int(request.form['fornecedor_id'])
        }
        if 'id' in request.form:  # Atualização
            supabase.table('produto').update(data).eq('id', request.form['id']).execute()
        else:  # Inserção
            supabase.table('produto').insert(data).execute()
        return redirect(url_for('produtos'))
    
    produtos_data = supabase.table('produto').select('id, descricao, quantidade, fornecedor(nome_fantasia)').order('id', desc=False).execute().data
    fornecedores = supabase.table('fornecedor').select('id, nome_fantasia').execute().data
    return render_template('produtos.html', produtos=produtos_data, fornecedores=fornecedores)

# Excluir produto
@app.route('/produtos/delete/<int:id>', methods=['POST'])
@login_required
def delete_produto(id):
    if session['user']['role'] == 'admin':
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403
    produto = supabase.table('produto').select('quantidade').eq('id', id).execute().data[0]
    if produto['quantidade'] > 0:
        return jsonify({'error': 'Não é possível excluir produto com quantidade maior que 0'}), 400
    supabase.table('produto').delete().eq('id', id).execute()
    return jsonify({'success': 'Produto excluído com sucesso'})

# Dados do produto para edição
@app.route('/produtos/edit/<int:id>', methods=['GET'])
@login_required
def get_produto(id):
    if session['user']['role'] == 'admin':
        return jsonify({'error': 'Acesso restrito a usuários normais.'}), 403
    produto = supabase.table('produto').select('id, descricao, quantidade, fornecedor_id').eq('id', id).execute().data[0]
    return jsonify(produto)

# Removido o app.run() para o Vercel
if __name__ == '__main__':
 app.run(debug=True, port=5000)