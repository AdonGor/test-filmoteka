import refs from './refs';
import genres from "./genresJSON";
import filmsGalleryTemplate from '../templates/film-card-home.hbs'; //нужно ли hbs и важен ли порядок импорта?
import onload from './paginator';
const apiKey = 'ec5df708eed17b8995d93050bcd1f4b2';
let page = 1;
const baseUrl = 'https://api.themoviedb.org/3';

fetching();

window.onload = function(){

  var paginationPage = parseInt($('.cdp').attr('actpage'), 10);
    $('.cdp_i').on('click', function(){

      var go = $(this).attr('href').replace('#!', '');
      if (go === '+1') {
        paginationPage++;
        fetching(plusOne());

      } else if (go === '-1') {
        paginationPage--;
        fetching(minusOne());
      }else{
        paginationPage = parseInt(go, 10);
      }
      $('.cdp').attr('actpage', paginationPage);
      paginationPage
      page = String(paginationPage);
      fetching();
    });
};

function fetching() {
  fetch(`${baseUrl}/trending/movie/day?&page=${page}&api_key=${apiKey}`)
  .then(response => response.json())
  .then(({ results}) => updateGalleryMarkup(results))
  .then(data => console.log(data))
  .catch(error => console.log(error));
  
function updateGalleryMarkup(results) {
    results.map((item) => {
       let newGenres = [];
       item.genre_ids.map((id) => {
         const found = genres.find((item) => item.id === id);
   
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
       const galleryMarkup = filmsGalleryTemplate(results);
       refs.galleryRef.insertAdjacentHTML("beforeend", galleryMarkup);
       refs.galleryRef.innerHTML = galleryMarkup;
  }
}

function plusOne() {
  page = page + 1;
}

function minusOne() {
  page = page - 1;
}

