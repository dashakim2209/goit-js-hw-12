import { fetchImages, incrementPage, resetPage } from './js/pixabay-api.js';
import {
  clearGallery,
  renderGallery,
  lightbox,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('#load-more');
const gallery = document.querySelector('.gallery');
let query = '';
let totalHits = 0;
let loadedImages = 0;
const limit = 15;
const totalPages = Math.ceil(totalHits / limit);

loadMoreBtn.style.display = 'none';

form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
    });
    return;
  }

  loader.classList.remove('hidden');
  clearGallery();
  resetPage();
  loadedImages = 0;

  try {
    const { images, totalHits: total } = await fetchImages(query);
    totalHits = total;
    loadedImages += images.length;

    if (images.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message: 'Sorry, no images match your search query.',
      });
    } else {
      renderGallery(images);
      loadMoreBtn.style.display = loadedImages >= totalHits ? 'none' : 'block';
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
    console.error('Error fetching images:', error);
  } finally {
    loader.classList.add('hidden');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  loader.classList.remove('hidden');
  incrementPage();

  try {
    const { images } = await fetchImages(query);

    loadedImages += images.length;

    if (images.length > 0) {
      renderGallery(images);
    }

    if (loadedImages > totalPages) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    loader.classList.add('hidden');
  }

  const cardHeight = gallery.firstElementChild
    ? gallery.firstElementChild.getBoundingClientRect().height
    : 0;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
});
