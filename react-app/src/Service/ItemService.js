import axios from 'axios';

const baseURL = "http://localhost:8080/items";

export default class ItemService {
    static async getAllItems() {
        return axios.get(baseURL);
    }

    static async editItem(item) {
        return axios.put(baseURL + '/' + item.code, item);
    }

    static async removeItem(code) {
        return axios.delete(baseURL + '/' + code);
    }

    static async addItem(item) {
        return axios.post(baseURL, item);
    }
}