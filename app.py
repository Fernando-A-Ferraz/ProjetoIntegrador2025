from flask import Flask, render_template, request, redirect, url_for, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Carregar variáveis de ambiente
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Tela principal (Empresa)
@app.route('/', methods=['GET', 'POST'])
def empresa():
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

# Tela de fornecedores
@app.route('/fornecedores', methods=['GET', 'POST'])
def fornecedores():
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
    
    # Ordenar fornecedores pelo ID em ordem crescente
    fornecedores_data = supabase.table('fornecedor').select('id, nome_fantasia, telefone, representante').order('id', desc=False).execute().data
    return render_template('fornecedores.html', fornecedores=fornecedores_data)

# Excluir fornecedor
@app.route('/fornecedores/delete/<int:id>', methods=['POST'])
def delete_fornecedor(id):
    produtos = supabase.table('produto').select('id').eq('fornecedor_id', id).execute().data
    if produtos:
        return jsonify({'error': 'Não é possível excluir fornecedor com produtos vinculados'}), 400
    supabase.table('fornecedor').delete().eq('id', id).execute()
    return jsonify({'success': 'Fornecedor excluído com sucesso'})

# Dados do fornecedor para edição
@app.route('/fornecedores/edit/<int:id>', methods=['GET'])
def get_fornecedor(id):
    fornecedor = supabase.table('fornecedor').select('*').eq('id', id).execute().data[0]
    return jsonify(fornecedor)

# Tela de produtos
@app.route('/produtos', methods=['GET', 'POST'])
def produtos():
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
    
    # Ordenar produtos pelo ID em ordem crescente
    produtos_data = supabase.table('produto').select('id, descricao, quantidade, fornecedor(nome_fantasia)').order('id', desc=False).execute().data
    fornecedores = supabase.table('fornecedor').select('id, nome_fantasia').execute().data
    return render_template('produtos.html', produtos=produtos_data, fornecedores=fornecedores)

# Excluir produto
@app.route('/produtos/delete/<int:id>', methods=['POST'])
def delete_produto(id):
    produto = supabase.table('produto').select('quantidade').eq('id', id).execute().data[0]
    if produto['quantidade'] > 0:
        return jsonify({'error': 'Não é possível excluir produto com quantidade maior que 0'}), 400
    supabase.table('produto').delete().eq('id', id).execute()
    return jsonify({'success': 'Produto excluído com sucesso'})

# Dados do produto para edição
@app.route('/produtos/edit/<int:id>', methods=['GET'])
def get_produto(id):
    produto = supabase.table('produto').select('id, descricao, quantidade, fornecedor_id').eq('id', id).execute().data[0]
    return jsonify(produto)

if __name__ == '__main__':
    app.run(debug=True)