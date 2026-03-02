import axios from "axios";

/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE
|--------------------------------------------------------------------------
| Central API connection for entire frontend
| Change BASE URL only when deploying
|
| Local Development → http://localhost:5000
| Production → your deployed backend URL
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;