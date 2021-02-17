import axios from 'axios';

const baseURL = "http://localhost:8080/users";

export default class ItemService {
    static async getAllUsers() {
        return axios.get(baseURL);
    }

    static async removeUser(username) {
        return axios.delete(baseURL + '/' + username);
    }

    static async addUser(user) {
        return axios.post(baseURL, user);
    }
}