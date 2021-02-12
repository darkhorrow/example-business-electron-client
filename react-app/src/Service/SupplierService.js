import axios from 'axios';

const baseURL = "http://localhost:8080/suppliers";

export default class SupplierService {
    static async getAllSuppliers() {
        return axios.get(baseURL);
    }
}