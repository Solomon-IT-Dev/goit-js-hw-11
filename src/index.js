import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImageFinder from './js/ImageFinder';

const refs = {
  searchForm: document.getElementById('search-form'),
  imgGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  appSlogan: document.querySelector('.app-slogan'),
};

const imageFinder = new ImageFinder();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSearchClick(e) {
  e.preventDefault();

  resetMarkup();

  const searchName = e.currentTarget.elements.searchQuery.value.trim();
  imageFinder.searchQuery = searchName;

  if (searchName !== '') {
    imageFinder.resetPage();
    const imgDataSet = await imageFinder.fetchImages();

    if (imgDataSet.hits.length > 0) {
      hideSlogan();
    }

    renderImgGallery(imgDataSet);

    if (imgDataSet.hits.length < imgDataSet.totalHits) {
      showLoadBtn();
    }
  }

  if (searchName === '') {
    notifySearchNameAbsence();
    showSlogan();
  }
}

async function onLoadMoreClick() {
  const nextImgDataSet = await imageFinder.fetchImages();
  renderImgGallery(nextImgDataSet);

  if ((imageFinder.page - 1) * 40 >= nextImgDataSet.totalHits) {
    hideLoadBtn();
  }
}

function renderImgGallery(data) {
  const imgCards = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
        <a class="photo-card__item" href="${largeImageURL}">
          <div class="photo-card__tumb">
            <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </div>
          <div class="info">
            <p class="info-item">
              <b class="info-item__param">Likes</b>
              <span class="info-item__num">${likes}</span>
            </p>
            <p class="info-item">
              <b class="info-item__param">Views</b>
              <span class="info-item__num">${views}</span>
            </p>
            <p class="info-item">
              <b class="info-item__param">Comments</b>
              <span class="info-item__num">${comments}</span>
            </p>
            <p class="info-item">
              <b class="info-item__param">Downloads</b>
              <span class="info-item__num">${downloads}</span>
            </p>
          </div>
        </a>
      </div>`,
    )
    .join('');

  refs.imgGallery.insertAdjacentHTML('beforeend', imgCards);

  lightbox.refresh();

  makeSmoothScroll();
}

function resetMarkup() {
  if (refs.imgGallery.childNodes.length !== 0) {
    refs.imgGallery.innerHTML = '';
    hideLoadBtn();
    showSlogan();
  }
}

function hideLoadBtn() {
  refs.loadMoreBtn.classList.add('js-hidden');
}

function showLoadBtn() {
  refs.loadMoreBtn.classList.remove('js-hidden');
}

function hideSlogan() {
  refs.appSlogan.classList.add('js-hidden');
}

function showSlogan() {
  refs.appSlogan.classList.remove('js-hidden');
}

function notifySearchNameAbsence() {
  Notiflix.Notify.info(
    'No, no, no! God, no! To search for pictures you need to specify what you are looking for.',
    {
      position: 'right-bottom',
    },
  );
}

function makeSmoothScroll() {
  if (imageFinder.page - 1 > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.72,
      behavior: 'smooth',
    });
  }
}
