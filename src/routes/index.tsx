import appRoutes from "./app";
import adminRoutes from "./admin";
import {RouteConfig} from "../lib";

const routes: RouteConfig[] = [
    ...appRoutes,
    ...adminRoutes
];

export default routes;
