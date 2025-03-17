# README - Como Executar o Projeto de Cadastro no Seu Computador (Windows)

Olá! Bem-vinda ao **ProjetoIntegrador2025**! Este é um sistema web que ajuda a gerenciar dados de uma empresa, fornecedores, produtos e usuários. Este guia foi feito para você, que está começando e nunca programou antes. Vou te guiar passo a passo para configurar tudo no seu computador com Windows. Vamos lá com calma!

## O que você precisa
- Um computador com **Windows** (qualquer versão recente, como Windows 10 ou 11).
- **Conexão com a internet** (para baixar ferramentas e o projeto).
- Paciência e atenção para seguir as instruções!

## Passo 1: Instalar o Python
O projeto usa uma linguagem chamada Python. Vamos instalá-la primeiro.

1. **Baixe o Python:**
   - Abra o navegador (ex.: Google Chrome ou Edge).
   - Vá para o site oficial do Python: [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - Clique no botão amarelo que diz "Download Python 3.x.x" (o número pode variar, como 3.11 ou 3.12).

2. **Instale o Python:**
   - Depois de baixar, abra o arquivo (ex.: `python-3.x.x.exe`).
   - Uma janela de instalação vai aparecer.
   - **Muito importante:** Marque a caixinha que diz **"Add Python 3.x to PATH"** (isso permite usar o Python em qualquer lugar no seu computador).
   - Clique em **"Install Now"** e aguarde a instalação terminar.
   - Quando terminar, clique em **"Close"**.

3. **Verifique se o Python foi instalado:**
   - Pressione as teclas **Win + R** no teclado (o símbolo do Windows + R).
   - Digite `cmd` e pressione Enter. Isso abre o "Prompt de Comando" (uma tela preta com texto).
   - No Prompt de Comando, digite:
   ```
    python --version
   ```
- Pressione Enter. Você deve ver algo como `Python 3.x.x`. Se aparecer, o Python está instalado! Se der erro, repita o passo 2 e certifique-se de marcar "Add Python 3.x to PATH".

## Passo 2: Instalar o Visual Studio Code (VS Code)
O VS Code é um programa que facilita editar os arquivos do projeto. Vamos instalá-lo.

1. **Baixe o VS Code:**
- Abra o navegador novamente.
- Vá para o site: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Clique no botão verde que diz **"Download"** (escolha a versão para Windows).

2. **Instale o VS Code:**
- Abra o arquivo baixado (ex.: `VSCodeUserSetup-x64-x.x.x.exe`).
- Clique em **"Next"** várias vezes e depois em **"Install"**. Quando terminar, clique em **"Finish"**.
- O VS Code vai abrir automaticamente. Se não abrir, procure por "Visual Studio Code" no menu Iniciar e clique para abri-lo.

## Passo 3: Clonar o Projeto do GitHub
Como você é colaboradora do projeto no GitHub, vamos baixar o código usando o Git.

1. **Instalar o Git (se ainda não tiver):**
- Abra o navegador.
- Vá para: [https://git-scm.com/download/win](https://git-scm.com/download/win)
- Clique em **"Download"** para a versão para Windows.
- Abra o arquivo baixado (ex.: `Git-x.x.x-64-bit.exe`).
- Clique em **"Next"** várias vezes e depois em **"Install"**. Quando terminar, clique em **"Finish"**.

2. **Clonar o repositório:**
- Abra o VS Code.
- Clique em **"Terminal"** no menu superior e escolha **"New Terminal"** (uma janela preta vai aparecer na parte inferior).
- No terminal, digite o comando abaixo para clonar o repositório:

```
git clone https://github.com/Fernando-A-Ferraz/ProjetoIntegrador2025.git
```
- Pressione Enter. Isso vai criar uma pasta chamada `ProjetoIntegrador2025` na sua máquina, geralmente em `C:\Users\SeuNome\`.

3. **Abrir o projeto no VS Code:**
- No VS Code, clique em **"File"** > **"Open Folder"**.
- Vá até a pasta onde o projeto foi clonado (ex.: `C:\Users\SeuNome\ProjetoIntegrador2025`) e clique em **"Select Folder"**.

## Passo 4: Instalar Dependências
O projeto precisa de algumas ferramentas extras. Vamos instalá-las diretamente.

1. **Instale as dependências:**
- No terminal do VS Code (ainda na pasta do projeto), digite:

```
pip install -r requirements.txt
```

- Pressione Enter e aguarde. Isso baixa todas as ferramentas necessárias (como Flask, Supabase e python-dotenv) listadas no arquivo `requirements.txt`.

## Passo 5: Configurar o Supabase
O projeto usa um banco de dados chamado Supabase para armazenar os dados.

1. **Crie uma conta no Supabase:**
- Acesse [https://supabase.com/](https://supabase.com/) e clique em **"Start your project"**.
- Faça login ou crie uma conta (use seu e-mail e senha).

2. **Crie um novo projeto:**
- No painel do Supabase, clique em **"New Project"**.
- Escolha um nome (ex.: `ProjetoCadastro`) e uma senha segura. Clique em **"Create new project"**.

3. **Obtenha as credenciais:**
- No painel do Supabase, vá para **"Settings"** > **"API"**.
- Copie o **URL** e a **anon key** (chave anônima).
- Crie um arquivo chamado `.env` na pasta do projeto (ex.: `C:\Users\SeuNome\ProjetoIntegrador2025\.env`) usando o VS Code.
- Abra o `.env` e cole o seguinte, substituindo os valores:

```
SUPABASE_URL=sua_url_aqui
SUPABASE_KEY=sua_chave_anonima_aqui
```

- **Nota:**  Não compartilhe esse arquivo `.env` com ninguém!
- Salve o arquivo.

4. **Execute as migrations (criar tabelas no Supabase):**
- No painel do Supabase, vá para **"SQL Editor"** (no menu à esquerda).
- Copie e cole o script SQL abaixo no editor.
- Clique em **"Run"** para criar as tabelas e inserir os dados iniciais.
- Verifique se não há erros no resultado (deve aparecer uma mensagem de sucesso).

### Migrations SQL para Supabase
Copie e cole este código no "SQL Editor" do Supabase:

```sql
-- Tabela empresa
CREATE TABLE empresa (
id SERIAL PRIMARY KEY,
cnpj VARCHAR(18),
razao_social VARCHAR(255),
nome_fantasia VARCHAR(255),
rua VARCHAR(255),
numero VARCHAR(10),
complemento VARCHAR(255),
cep VARCHAR(9),
bairro VARCHAR(255),
cidade VARCHAR(255),
estado VARCHAR(2),
telefone VARCHAR(15)
);

-- Tabela fornecedor
CREATE TABLE fornecedor (
id SERIAL PRIMARY KEY,
cnpj VARCHAR(18),
razao_social VARCHAR(255),
nome_fantasia VARCHAR(255),
rua VARCHAR(255),
numero VARCHAR(10),
complemento VARCHAR(255),
cep VARCHAR(9),
bairro VARCHAR(255),
cidade VARCHAR(255),
estado VARCHAR(2),
telefone VARCHAR(15),
representante VARCHAR(255)
);

-- Tabela produto
CREATE TABLE produto (
id SERIAL PRIMARY KEY,
descricao VARCHAR(255),
quantidade INT,
fornecedor_id INT REFERENCES fornecedor(id)
);

-- Tabela usuarios
CREATE TABLE usuarios (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role VARCHAR(20) NOT NULL DEFAULT 'user'
);

-- Inserir usuário admin
INSERT INTO usuarios (username, password, role)
VALUES ('admin', 'admin', 'admin');
```

- Nota: As senhas estão em texto puro por simplicidade. Em um ambiente real, isso deve ser criptografado (ex.: usando bcrypt).

## Passo 6: Executar o Projeto

- Execute o projeto:
- No terminal do VS Code (ainda na pasta do projeto), digite:

```
python app.py
```

- Pressione Enter. Você verá mensagens aparecendo, e o projeto vai começar a rodar.
- Acesse o sistema:
- Abra o navegador e digite: http://127.0.0.1:5000/login
- Faça login com:
- Usuário: admin
- Senha: admin
- Você será redirecionado para a tela de gerenciamento de usuários.

## Passo 7: Usar o Sistema

- Como Admin: Você pode adicionar novos usuários (exceto outro admin), alterar senhas e excluir usuários (exceto o admin).
- Como Usuário Normal: Crie outros usuários (ex.: user1/senha123) e faça login com eles para acessar as telas de Empresa, Fornecedores e Produtos.
- Para sair, clique em "Sair" no menu.

## Passo 8: Parar o Projeto

- Quando quiser parar, volte ao terminal e pressione Ctrl + C. Isso fechará o servidor.