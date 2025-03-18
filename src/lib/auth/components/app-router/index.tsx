import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/protected-route";
import Unauthorized from "../../components/unauthorized";
import {RouteConfig} from "../../types";

interface AppRouterProps {
    routes: RouteConfig[];
}

const renderRoutes = (routes: RouteConfig[]) => {
    return routes.map(({ path, element, redirectLogic, children, id, index }) => (
        index ? (
            // Si es una ruta `index`, no debe tener `path`
            <Route
                key={id || "index"}
                index
                element={
                    <ProtectedRoute redirectLogic={redirectLogic}>
                        {element}
                    </ProtectedRoute>
                }
            />
        ) : (
            // Rutas normales con `path`
            <Route
                key={id || path}
                path={path}
                element={
                    <ProtectedRoute redirectLogic={redirectLogic}>
                        {element}
                    </ProtectedRoute>
                }
            >
                {/* Renderizar rutas anidadas si existen */}
                {children && renderRoutes(children)}
            </Route>
        )
    ));
};

const AppRouter: React.FC<AppRouterProps> = ({routes}) => {
    const hasUnauthorizedRoute = routes.some(route => route.path === "/unauthorized");
    return (
        <Router>
            <Routes>
                {renderRoutes(routes)}
                {!hasUnauthorizedRoute && (
                    <Route path="/unauthorized" element={<Unauthorized />} />
                )}
            </Routes>
        </Router>
    );
};

export default AppRouter;
