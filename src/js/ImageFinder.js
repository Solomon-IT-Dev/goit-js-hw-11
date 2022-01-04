import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '24992333-26303cf37c585c2123ccaf94d';

export default class ImageFinder {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    try {
      const imagesSet = await axios
        .get(
          `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`,
        )
        .then(response => {
          const data = response.data;

          if (data.hits.length === 0) {
            this.notifyIncorrectQuery();
          }
          if (this.page * 40 >= data.totalHits && data.hits.length !== 0) {
            this.notifyEndOfGallery();
          }
          if (this.page === 1 && data.totalHits !== 0) {
            this.showAmountOfHits(data.totalHits);
          }

          this.incrementPage();
          return data;
        });
      return imagesSet;
    } catch (error) {
      this.notifyQueryError(error);
      console.log(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  notifyIncorrectQuery() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        position: 'right-bottom',
      },
    );
  }

  notifyEndOfGallery() {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.", {
      position: 'right-bottom',
    });
  }

  showAmountOfHits(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {
      position: 'right-bottom',
    });
  }

  notifyQueryError(error) {
    Notiflix.Notify.failure(
      `Oops! Something went wrong. You caught the following error: ${error.message}.`,
      {
        position: 'right-bottom',
      },
    );
  }
}
