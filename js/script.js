const buttonSearch = document.getElementById('buttonSearch');
const overlay = document.getElementById('modal-overlay');
const movieName = document.getElementById('movie-name');
const movieYear = document.getElementById('movie-year');
const movieListContainer = document.getElementById('movie-list');
const blockSearchVisible = document.getElementById('blockButtons');
const buttonSearch2 = document.getElementById('buttonSearch2');
const buttonClose = document.getElementById('button-close');
const body = document.getElementsByTagName('body');

let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

function alert(icon, message) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon: icon,
    title: message,
  });
}
function SwalAlert(
  icon,
  title,
  text,
  timer,
  buttonConfirm,
  butonCancel,
  timerProgressBar
) {
  swal.fire({
    icon: icon,
    title: title,
    text: text,
    timer: timer,
    showConfirmButton: buttonConfirm,
    showCancelButton: butonCancel,
    timerProgressBar: timerProgressBar,
  });
}

async function clickButtonSearch() {
  try {
    let url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
    const response = await fetch(url); // Faz uma requisição para API na url, aguarda a resposta e coloca essa resposta na variavel response.
    const data = await response.json(); //pega somente os dados que a API respondeu, sem informações irrelevantes. await = coloca uma espera na requisição.
    //'assincrono' espera resolver o processo e joga o resultado na variavel data.
    console.log('data: ', data);
    if (data.Error) {
      throw new Error('Filme não encontrado!');
    }
    createModal(data);
    overlay.classList.add('open');
  } catch (error) {
    SwalAlert('error', 'Erro', error.message, 2500, false, false, true);
    // alert('error', error.message);
  }
}
function movieNameParameterGenerator() {
  if (movieName.value === '') {
    throw new Error('O nome do filme deve ser informado!');
  }
  return movieName.value.split(' ').join('+');
}
function movieYearParameterGenerator() {
  if (movieYear.value === '') {
    return '';
  }
  if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
    throw new Error('O ano do filme é inválido!');
  }
  return `&y=${movieYear.value}`;
}

function addToList(data) {
  if (isFilmAlreadyOnTheList(data.imdbID)) {
    SwalAlert(
      'error',
      'Erro',
      'O filme já está na lista',
      2500,
      false,
      false,
      true
    );
    return;
  }
  movieList.push(data); //adiciona um item ao vetor
  updateLocalStorage(); //salva os itens na memoria do navegador
  updateUI(data); //chama a função que adiciona o poster ao HTML
  overlay.classList.remove('open'); //remove a classe open e fecha o overlay
  SwalAlert(
    'success',
    'Sucesso!',
    'Filme adicionado a lista!',
    2500,
    false,
    false,
    true
  );
}

function updateUI(data) {
  //adiciona o poster ao HTML
  movieListContainer.innerHTML += `<article id='movie-card-${data.imdbID}'>
    <img src=${data.Poster} alt="Poster do ${data.Title}">
    <button class="remove-button" onclick='{removeFilmFromList("${data.imdbID}")}'><i class="bi bi-trash"></i>Remover</button>
  </article>`;
}

function isFilmAlreadyOnTheList(imdbId) {
  //Verifica se o filme já existe na lista
  function isThisIdFromThisMovie(movie) {
    return movie.imdbID === imdbId;
  }
  return movieList.find(isThisIdFromThisMovie);
}

function removeFilmFromList(imdbId) {
  movieList = movieList.filter((movie) => movie.imdbID !== imdbId); //filtra os itens diferentes do id do filme e joga essa nova lista na matriz
  document.getElementById(`movie-card-${imdbId}`).remove();
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem('movieList', JSON.stringify(movieList));
}

movieList.forEach(updateUI);
buttonSearch.addEventListener('click', clickButtonSearch);

buttonSearch2.addEventListener('click', () => {
  buttonSearch2.classList.add('ativo');
  blockSearchVisible.classList.add('ativo');
  document.getElementById('movie-name').focus();
});

buttonClose.addEventListener('click', () => {
  buttonSearch2.classList.remove('ativo');
  blockSearchVisible.classList.remove('ativo');
});
