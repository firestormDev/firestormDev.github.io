var posts = [];

function openDialog() {
  document.getElementById('dialog').style.display = 'block';
}

function closeDialog() {
  document.getElementById('dialog').style.display = 'none';
  clearFields();
}

function clearFields() {
  document.getElementById('titulo').value = '';
  document.getElementById('data').value = '';
  document.getElementById('imagem').value = '';
  document.getElementById('conteudo').value = '';
}

function salvarPostagem() {
  var titulo = document.getElementById('titulo').value;
  var data = document.getElementById('data').value;
  var imagemInput = document.getElementById('imagem');
  var conteudo = document.getElementById('conteudo').value;

  if (!titulo || !data || !imagemInput.files[0] || !conteudo) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  var imagemFile = imagemInput.files[0];
  var reader = new FileReader();

  reader.onload = function(event) {
    var imagemURL = event.target.result;

    var postagem = {
      titulo: titulo,
      data: data,
      imagem: imagemURL,
      conteudo: conteudo
    };

    posts.push(postagem);
    adicionarPostagemNaTabela(postagem);

    closeDialog();
  };

  reader.readAsDataURL(imagemFile);
}

function adicionarPostagemNaTabela(postagem) {
  var tabela = document.getElementById('posts');
  var linha = tabela.insertRow();

  // Cria as células da linha
  var tituloCell = linha.insertCell();
  var dataCell = linha.insertCell();
  var imagemCell = linha.insertCell();
  var conteudoCell = linha.insertCell();
  var acoesCell = linha.insertCell();

  // Define o conteúdo das células
  tituloCell.innerText = postagem.titulo;
  dataCell.innerText = postagem.data;

  var imagemElement = document.createElement('img');
  imagemElement.src = postagem.imagem;
  imagemElement.alt = 'Imagem';
  imagemElement.className = 'post-image';
  imagemCell.appendChild(imagemElement);

  conteudoCell.innerText = postagem.conteudo;

  var editarButton = document.createElement('button');
  editarButton.innerText = 'Editar';
  editarButton.onclick = function() {
    editarPostagem(postagem);
  };
  acoesCell.appendChild(editarButton);

  var deletarButton = document.createElement('button');
  deletarButton.innerText = 'Deletar';
  deletarButton.onclick = function() {
    deletarPostagem(postagem);
  };
  acoesCell.appendChild(deletarButton);

  // Salva a postagem no Local Storage
  localStorage.setItem('posts', JSON.stringify(posts));
}

function editarPostagem(postagem) {
  document.getElementById('titulo').value = postagem.titulo;
  document.getElementById('data').value = postagem.data;
  document.getElementById('conteudo').value = postagem.conteudo;

  openDialog();

  var salvarButton = document.getElementById('dialog').querySelector('button');
  salvarButton.innerText = 'Atualizar';
  salvarButton.onclick = function() {
    postagem.titulo = document.getElementById('titulo').value;
    postagem.data = document.getElementById('data').value;
    postagem.conteudo = document.getElementById('conteudo').value;

    // Atualiza as células da tabela
    var tabela = document.getElementById('posts');
    var linhas = tabela.rows;

    for (var i = 1; i < linhas.length; i++) {
      var linha = linhas[i];
      var primeiraCelula = linha.cells[0];

      if (primeiraCelula.innerText === postagem.titulo) {
        var dataCell = linha.cells[1];
        var conteudoCell = linha.cells[3];

        dataCell.innerText = postagem.data;
        conteudoCell.innerText = postagem.conteudo;
        break;
      }
    }

    closeDialog();

    // Salva as alterações no Local Storage
    localStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = window.location.href;
  };
}

function deletarPostagem(postagem) {
  var confirmacao = confirm('Tem certeza que deseja deletar essa postagem?');

  if (confirmacao) {
    var tabela = document.getElementById('posts');
    var linhas = tabela.rows;

    for (var i = 1; i < linhas.length; i++) {
      var linha = linhas[i];
      var primeiraCelula = linha.cells[0];

      if (primeiraCelula.innerText === postagem.titulo) {
        tabela.deleteRow(i);
        break;
      }
    }

    // Remove a postagem do array de posts
    var index = posts.indexOf(postagem);
    if (index !== -1) {
      posts.splice(index, 1);
    }

    // Salva as alterações no Local Storage
    localStorage.setItem('posts', JSON.stringify(posts));
  }
}

// Carrega as postagens do Local Storage
if (localStorage.getItem('posts')) {
  posts = JSON.parse(localStorage.getItem('posts'));
  popularTabela();
}

// Função para popular a tabela com as postagens existentes
function popularTabela() {
  var tabela = document.getElementById('posts');
  var tbody = tabela.getElementsByTagName('tbody')[0];

  for (var i = 0; i < posts.length; i++) {
    var postagem = posts[i];
    adicionarPostagemNaTabela(postagem);
  }
}

function buscarPostagens() {
  var texto = document.getElementById('search-input').value.toLowerCase();
  var resultados = [];

  // Verifica se há algum texto de busca
  if (texto.trim() !== '') {
    // Filtra os posts pelo título ou conteúdo
    resultados = posts.filter(function(post) {
      return post.titulo.toLowerCase().includes(texto) || post.conteudo.toLowerCase().includes(texto);
    });
  } else {
    resultados = posts;
  }

  // Redireciona para a página de resultados da busca
  var url = 'resultados.html?search=' + encodeURIComponent(texto);
  window.location.href = url;
}



