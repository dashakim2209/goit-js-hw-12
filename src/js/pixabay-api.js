import axios from 'axios';

const API_KEY = '46118287-c5ba04b36aad3afec959570e4';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;
const limit = 30;

export async function fetchImages(query) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true`;

  try {
    const response = await axios.get(url);
    return {
      images: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    throw new Error('Network response was not ok');
  }
}

export function incrementPage() {
  currentPage += 1;
}

export function resetPage() {
  currentPage = 1;
}
