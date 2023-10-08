
import axios from '/src/extra';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  list: document.querySelector(".gallery"),
  loadMore: document.querySelector(".load-more"),
};

let page = 1;
const apiKey = '39817690-1f31b393aea19fded90cb6900';
const perPage = 40;
let currentSearchQuery = '';

Notiflix.Notify.init({
  width: '300px',
  position: 'right-top',
});

refs.loadMore.addEventListener("click", handleLoadMoreClick);

async function fetchImages(searchQuery, page = 1) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

function displayImages(images) {
  const imageElements = images.map(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    card.appendChild(img);
    card.appendChild(info);

    return card;
  });

  refs.list.innerHTML = ''; // Очистить галерею перед добавлением новых изображений
  refs.list.append(...imageElements);

  // После добавления изображений вызываем метод refresh() для SimpleLightbox
  const lightbox = new SimpleLightbox('.gallery img');
  lightbox.refresh();
}

async function handleSubmit(event) {
  event.preventDefault();
  const searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  if (searchQuery !== currentSearchQuery) {
    refs.list.innerHTML = '';
    page = 1;
    currentSearchQuery = searchQuery;
  }

  const images = await fetchImages(searchQuery, page);
  if (images.length > 0) {
    displayImages(images);
    page++;
    refs.loadMore.style.display = 'block';
  } else {
    refs.list.innerHTML = '<p class="no-results">Sorry, there are no images matching your search query. Please try again.</p>';
    refs.loadMore.style.display = 'none';
  }
}

function handleLoadMoreClick() {
  fetchImages(currentSearchQuery, page)
    .then((images) => {
      if (images.length > 0) {
        displayImages(images);
        page++;

        window.scrollBy({
          top: window.innerHeight,
          behavior: 'smooth',
        });
      } else {
        refs.loadMore.style.display = 'none';
        Notiflix.Notify.info("Sorry, there are no more images to load.");
      }
    })
    .catch((error) => console.error(error));
}

document.getElementById('search-form').addEventListener('submit', handleSubmit);