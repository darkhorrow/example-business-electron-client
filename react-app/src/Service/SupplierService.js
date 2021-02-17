import axios from 'axios';

const baseURL = "http://localhost:8080/suppliers";

export default class SupplierService {
    static async getAllSuppliers() {
        return axios.get(baseURL);
    }

    static async editSupplier(supplier) {
        return axios.put(baseURL + '/' + supplier.name, supplier);
    }

    static async addSupplier(supplier) {
        return axios.post(baseURL, supplier);
    }
}