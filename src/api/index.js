import axios from "axios";

const api = axios.create({ //create : tạo
  baseURL: "https://localhost/laravel8/laravel8/public/api",
});

const imageUrl = "https://localhost/laravel8/laravel8/public/upload/blog/image/"
const imageUserUrl = "https://localhost/laravel8/laravel8/public/upload/user/avatar/"

export { api, imageUrl, imageUserUrl };
