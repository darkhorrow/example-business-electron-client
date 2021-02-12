import axios from 'axios';

const baseURL = "http://localhost:8080/price-reductions";

export default class PriceReductionService {
    static async getAllPriceReduction() {
        return axios.get(baseURL);
    }
}