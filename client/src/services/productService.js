import api from "./api.js";

export const getProducts = async () => {
    const response = await api.get("/products");

    return response.data;
};