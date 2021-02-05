import decode from 'jwt-decode';

export default class Auth {
    static isLoggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = localStorage.getItem('token'); // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }
    
    static isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
            // Checking if token is expired. N
            return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }
}