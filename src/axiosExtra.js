import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '39817690-1f31b393aea19fded90cb6900',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  },
});
export default axiosInstance;