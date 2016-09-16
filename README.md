# Sample Project

## O que isso faz?
É apenas um projeto html (quase) *vazio*. Tem a estrutura inicial de um projeto, e as tasks do gulp para fazer build.

## Quais as opções de build?
As mais interessantes são:
* `gulp dev`: Inicia um servidor local, monitora alterações nos arquivos.
* `gulp dist`: Cria um build minificado e concatenado.

## Qual a stack?
* ES2015: Usa o Babel para *traduzir* seu código para o JS "antigo"
* SASS
* Bootstrap: A versão 'sass' do Bootstrap. Assim você pode sobreescrever as variaveis do Bootstrap.
* Font Awesome

(coloquei esses dois últimos pq eu sempre uso)

## Por onde começo?
1. Faça checkout do projeto
* Instale as dependências:
  * `npm install`
  * `bower install`
* Execute `gulp dev`
* Faça algumas alterações no `src/index.html` e veja o navegador atualizar assim que você salvar o arquivo...

## TODO
* Adicionar suporte ao Material Design (talvez uma outra branch/fork?)
* Adicionar uma task para mover as fontes (awesome) e renomear o caminho delas dentro dos css
* Criar um arquivo `src/variables.scss` e fazer os includes necessários para sobreescrever o bootstrap
