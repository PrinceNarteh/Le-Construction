import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem("token");
const role_id = localStorage.getItem("role_id");
const httpClient = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
    roleid: role_id,
  },
});

export default httpClient;
