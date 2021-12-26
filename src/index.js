import './sass/main.scss';
import Notiflix from 'notiflix';
import ApiService from './imagesApiService.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const Api = new ApiService();

const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.style.display = 'none';
const searchFormButton = document.querySelector('.search-form')

searchFormButton.addEventListener('submit', search);
loadMoreButton.addEventListener('click', loadMore);


function search(evt) {
  evt.preventDefault();

  Api.resetPage();

  Api.searchQuery = evt.target.elements.searchQuery.value;

  Api.getData().then(elem => {
        showNotification(elem);
        return elem;
      })
      .then(renderData);
  gallery.innerHTML = '';
}

function loadMore() {
  Api
    .getData()
    .then(data => {
      return data;
    })
    .then(renderData);
  scroll();
}

function showNotification(data) {
  if (data.totalHits > 40) {
    loadMoreButton.style.display  = ""
  }

  if (data.totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    loadMoreButton.style.display  = "none"
  }
}

function renderData(data) {
  const lightBox = new SimpleLightbox('.photo-card a');

  const hits = data.hits
    .map(elem => {
      return `<div class='photo-card'>
              <a href='${elem.largeImageURL}'>
                <img src='${elem.webformatURL}' alt='${elem.tags}' loading='lazy' />
                <div class='info'>
                  <p class='info-item'>
                    <b>Likes</b>
                    <span>${elem.likes}</span>
                  </p>
                  <p class='info-item'>
                    <b>Views</b>
                    <span>${elem.views}</b>
                  </p>
                  <p class='info-item'>
                    <b>Comments</b>
                    <span>${elem.comments}</span>
                  </p>
                  <p class='info-item'>
                    <b>Downloads</b>
                    <span>${elem.downloads}</span>
                  </p>
                </div>
                </a>
              </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', hits);
  lightBox.refresh();
}

function scroll() {
  setTimeout(() => {
    const { height: cardHeight } = gallery
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 1000);
}