const background = document.getElementById('modal-background');
const modalContainer = document.getElementById('modal-container');
function backgroundClickHandler() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

background.addEventListener('click', backgroundClickHandler);

function createModal(data) {
  //innerHTML = adiciona um texto html ao elemento recuperado pela Tag
  document.body.style.overflow = 'hidden';
  modalContainer.innerHTML = ` 
   <h2 id="movie-title">${data.Title} - ${data.Year}</h2>
        <section id="modal-body">
          <img id="movie-poster"
            src=${data.Poster}
            alt="Poster do filme">
          <div id="movie-info">
            <h3 id="movie-plot">${data.Plot}</h3>
            <div id="movie-cast">
              <h4>Elênco:</h4>
              <h5>${data.Actors}</h5>
            </div>
            <div id="movie-genre">
              <h4>Gênero:</h4>
              <h5>${data.Genre}</h5>
            </div>
          </div>
        </section>
        <section id="modal-footer">
          <button id="add-to-list" onclick='{addToList(${JSON.stringify(
            data
          ).replace("'", '`')})}'>Adicionar à lista</button>
        </section> 
  `; //JSON.stringify -> converte um objeto em string * .replace() encontra uma string dentro do objeto e substitui pela string desejada;
}
