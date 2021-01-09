import { Router as Routing } from 'symfony-ts-router';
import routes from '@scripts/router/routes.json';
import apiRoutes from '@scripts/router/fos_js_routes.json';

interface RoutesI {
    [ name: string ]: string;
};
export class Router {

    protected baseUrl: string;

    protected routes: RoutesI;

    protected apiRoutes: Routing;

    constructor (baseUrl = "") {
        this.baseUrl = baseUrl;
        this.routes = routes;
        this.apiRoutes = new Routing();
        this.apiRoutes.setRoutingData(apiRoutes as any);
    }

    setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.apiRoutes.setBaseUrl(baseUrl);
    }

    get(name: string) {
        if (!this.routes[ name ]) {
            throw new Error(`La ruta ${this.baseUrl}/${name} no existe`);
        }
        return this.baseUrl + this.routes[ name ];
    }

    apiGet(name: string): string {
        return this.apiRoutes.generate(name);
    }
}