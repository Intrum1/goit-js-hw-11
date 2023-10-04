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

 const refs = {
    form: document.querySelector(".search-form"),
    button: document.querySelector(".load-more"),
 }

let page = 1;

refs.button.addEventListener('click', onLoadMore);

function onLoadMore()

function serviceImage(page = 1) {
    const BASE_URL = 
}