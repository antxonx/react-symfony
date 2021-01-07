import routes from './routes.json';

interface RoutesI {
    [name: string]: string
};

export default class Router {

    protected baseUrl: string;

    protected routes: RoutesI;
    
    constructor(baseUrl = "") {
        this.baseUrl = baseUrl;
        this.routes = routes;
    }

    setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    get(name: string) {
        if(!this.routes[name]) {
            throw new Error(`La ruta ${this.baseUrl}/${name} no existe`);
        }
        return this.baseUrl + this.routes[name];
    }
}