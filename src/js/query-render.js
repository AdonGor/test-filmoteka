import galleryTpl from "../templates/film-card-home.hbs"
import genres from "./genres";
import refs from "./refs"


const apiKey = '030295876ec9637cb436e167c8c73741';
const page = '1';
const baseUrl = 'https://api.themoviedb.org/3';


refs.formRef.addEventListener("submit", queryHandler);


function queryHandler(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const inputValue = form.elements.query.value;
    refs.galleryRef.innerHTML = "";
    form.reset();
    fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${inputValue}&page=${page}`)
        .then(response => response.json())
        .then(({ results }) => {
            updateGalleryMarkup(results)
            showErrorSentence(results)
})
  .catch(error => console.log(error));
}

function updateGalleryMarkup(results) {
 results.map((item) => {
    let newGenres = [];
    item.genre_ids.map((id) => {
      const found = genres.find((item) => item.id === id);
      console.log(found)
      newGenres.push(found.name);
    });
    if (newGenres.length >= 3) {
      const normalizedGenres = newGenres.slice(0, 2);
      normalizedGenres.push("Other");
      item.genre_ids = normalizedGenres.join(', ')
      item.release_date = item.release_date.slice(0, 4);
    } else {
      item.genre_ids = newGenres.join(', ');
      if (item.release_date) item.release_date = item.release_date.slice(0, 4);
    }
    return item;
  });
    const galleryMarkup = galleryTpl(results);
    refs.galleryRef.insertAdjacentHTML("beforeend", galleryMarkup);
}
 
function showErrorSentence(results) {
    if (results.length === 0) {
        refs.errorRef.classList.add('is-shown')
    } else {
         refs.errorRef.classList.remove('is-shown')
    }
}