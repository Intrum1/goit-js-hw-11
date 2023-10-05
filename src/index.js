/* Your API key: 39817690-1f31b393aea19fded90cb6900
q 	str 	A URL encoded search term. If omitted, all images are returned. This value may not exceed 100 characters.
Example: "yellow+flower" 

1. отримаємо рефси
2. створюємо змінну де будемо відсклідковувати поточну сторінку на яку робимо запит
3. вішаємо обробник подій на кнопку
4. робимо функцію для запиту (передаємо поточну сторінку)
5. робимо запит на сервер, завантажуємо данні, показуємо на сайті і перевіряємо, якщо це не остання сторінка - то показуємо кнопку
6. створюємо ф-цію обробник на завантаження додаткового контенту (обовʼязково робимо інкремент сторінки) -> викликаємо функцію для запиту, завантажуємо данні, показуємо на сайті (як тільки натискається кнопка - одразу блокуємо її, а коли отримали відповідь - можемо розблокувати, тобто блок finally)
*/

//  const refs = {
//     form: document.querySelector(".search-form"),
//     button: document.querySelector(".load-more"),
//  }

// let page = 1;

// refs.button.addEventListener('click', onLoadMore);

// function onLoadMore()

// function serviceImage(page = 1) {
//     const BASE_URL = 
// }



// ...
// import { fetchImages } from './extra.js';


import axios from 'axios';
import SimpleLightbox from "simplelightbox"; // Импорт SimpleLightbox
import "simplelightbox/dist/simple-lightbox.min.css"; // Дополнительный импорт стилей

// Функция для выполнения HTTP-запроса


async function fetchImages(searchQuery, page = 1) {
    const apiKey = '39817690-1f31b393aea19fded90cb6900';
    const perPage = 40;
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Извлекаем только нужные свойства из каждого объекта изображения
        const images = data.hits.map(image => ({
            webformatURL: image.webformatURL,
            largeImageURL: image.largeImageURL,
            tags: image.tags,
            likes: image.likes,
            views: image.views,
            comments: image.comments,
            downloads: image.downloads,
        }));

        return images;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
let currentSearchQuery = '';


// Функция для отображения изображений в галерее
function displayImages(images) {
    images.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('photo-card');

        // Оборачиваем изображение в ссылку для SimpleLightbox
        const imageLink = document.createElement('a');
        imageLink.href = image.largeImageURL;
        imageLink.setAttribute('data-lightbox', 'image');

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.loading = 'lazy';

        imageLink.appendChild(img); // Добавляем изображение в ссылку
        card.appendChild(imageLink); // Добавляем ссылку с изображением в карточку

        // ...

        gallery.appendChild(card);
    });

    // После добавления изображений вызываем метод refresh() для SimpleLightbox
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}
    
// Функция для обработки отправки формы
async function handleSubmit(event) {
    event.preventDefault();
    const searchQuery = event.target.searchQuery.value.trim();

    if (searchQuery === '') {
        return;
    }

    if (searchQuery !== currentSearchQuery) {
        gallery.innerHTML = ''; // Очистить галерею при новом поиске
        page = 1;
        currentSearchQuery = searchQuery;
    }

    const images = await fetchImages(searchQuery, page);
    if (images.length > 0) {
        displayImages(images);
        page++;
        loadMoreButton.style.display = 'block';
    } else {
        // Если изображения не найдены, показать сообщение
        gallery.innerHTML = '<p class="no-results">Sorry, there are no images matching your search query. Please try again.</p>';
        loadMoreButton.style.display = 'none';
    }
}

// Обработчик отправки формы поиска
searchForm.addEventListener('submit', handleSubmit);

// Функция для обработки клика на кнопку "Load more"
async function handleLoadMoreClick() {
    const images = await fetchImages(currentSearchQuery, page);
    if (images.length > 0) {
        displayImages(images);
        page++;
    } else {
        // Если изображения закончились, скрыть кнопку и вывести сообщение
        loadMoreButton.style.display = 'none';
        gallery.insertAdjacentHTML('beforeend', '<p class="no-results">We\'re sorry, but you\'ve reached the end of search results.</p>');
    }
}

// Обработчик отправки формы поиска
searchForm.addEventListener('submit', handleSubmit);

// Функция для обработки клика на кнопку "Load more"
loadMoreButton.addEventListener('click', handleLoadMoreClick);

