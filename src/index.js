import './sass/main.scss';
import Notiflix from 'notiflix';
import ApiService from './imagesApiService.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
  searchFormButton: document.querySelector('.search-form')
}

const Api = new ApiService();
const lightBox = new SimpleLightbox('.photo-card a');
const inValid = new RegExp('^[_A-z0-9]{1,}$');

refs.loadMoreButton.style.display = 'none';

refs.searchFormButton.addEventListener('submit', search);
refs.loadMoreButton.addEventListener('click', loadMore);

function search(evt) {
  evt.preventDefault();

  Api.resetPage();

  Api.searchQuery = evt.target.elements.searchQuery.value;

  if (inValid.test(Api.searchQuery)){
    Api.getData()
    .then(elem => {
      showNotification(elem);
      return elem;
    })
    .then(renderData);
  refs.gallery.innerHTML = '';
  } else {
    Notiflix.Notify.failure(
      'Sorry, you have to enter correct value',
    );
  }
}

function loadMore() {
  Api.getData()
    .then(data => {
      return data;
    })
    .then(renderData);
  scroll();
}

function showNotification(data) {
  if (data.totalHits > 40) {
    refs.loadMoreButton.style.display = '';
  }

  if (data.totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    refs.loadMoreButton.style.display = 'none';
  }
}

function renderData(data) {
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
  refs.gallery.insertAdjacentHTML('beforeend', hits);
  lightBox.refresh();
}

function scroll() {
  setTimeout(() => {
    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 1000);
}
