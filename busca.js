// Variáveis globais
var posts = [];

// Função para carregar os posts do Local Storage
function carregarPosts() {
  if (localStorage.getItem('posts')) {
    posts = JSON.parse(localStorage.getItem('posts'));
  }
}

// Função para exibir os resultados da busca
function exibirResultados(textoBusca) {
  var container = document.getElementById('posts');
  container.innerHTML = '';

  var resultados = posts.filter(function(post) {
    return post.titulo.toLowerCase().includes(textoBusca.toLowerCase()) || post.conteudo.toLowerCase().includes(textoBusca.toLowerCase());
  });

  if (resultados.length > 0) {
    resultados.forEach(function(post) {
      var divPost = document.createElement('div');
      divPost.className = 'post';

      var titulo = document.createElement('h2');
      titulo.innerText = post.titulo;

      var data = document.createElement('p');
      data.innerText = post.data;

      var imagem = document.createElement('img');
      imagem.src = post.imagem;
      imagem.alt = 'Imagem';

      var conteudo = document.createElement('p');
      conteudo.innerText = post.conteudo;

      divPost.appendChild(titulo);
      divPost.appendChild(data);
      divPost.appendChild(imagem);
      divPost.appendChild(conteudo);

      container.appendChild(divPost);
    });
  } else {
    var mensagem = document.createElement('p');
    mensagem.innerText = 'Nenhum resultado encontrado.';
    container.appendChild(mensagem);
  }
}

// Função para obter o texto de busca da URL
function obterTextoBusca() {
  var urlParams = new URLSearchParams(window.location.search);
  var textoBusca = urlParams.get('search');

  return textoBusca ? textoBusca : '';
}

// Carregar os posts do Local Storage
carregarPosts();

// Obter o texto de busca da URL e exibir os resultados
var textoBusca = obterTextoBusca();
exibirResultados(textoBusca);
