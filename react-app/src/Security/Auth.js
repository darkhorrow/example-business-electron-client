import decode from 'jwt-decode';

export default class Auth {
    static isLoggedIn() {
        const token = sessionStorage.getItem('token');
        return !!token && !this.isTokenExpired(token);
    }

    static getRole() {
        const role = sessionStorage.getItem('role');
        return Auth.isLoggedIn() ? role : null;
    }
    
    static isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
            return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }
}