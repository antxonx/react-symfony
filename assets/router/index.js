import routes from './routes.json';

export default class Router {
    constructor(baseUrl = "") {
        this.baseUrl = baseUrl;
        this.routes = routes;;
    }

    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }

    get(name) {
        if(!this.routes[name]) {
            throw new Error(`La ruta ${this.baseUrl}/${name} no existe`);
        }
        return this.baseUrl + this.routes[name];
    }
}