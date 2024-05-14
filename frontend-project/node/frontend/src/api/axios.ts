import axios from "axios";

const token = localStorage.getItem("token");

export const authAxios = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
		...(token ? {"Authorization": `Token ${token}`} : {})
	},
});
