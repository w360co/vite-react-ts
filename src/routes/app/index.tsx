import {PermissionAdapter, RouteConfig} from "../../lib";
import {AppLayout} from "../../layouts/app/AppLayout.tsx";
import {Navigate} from "react-router-dom";
import {AppHome} from "../../pages/app/AppHome.tsx";
import {AppDashboard} from "../../pages/app/AppDashboard.tsx";
import {User} from "../../store/reducers/authSlice.ts";
import {AppAuthLayout} from "../../layouts/app/AppAuthLayout.tsx";
import {AppAuthSignin} from "../../pages/app/auth/AppAuthSignin.tsx";
import {AppAuthSignup} from "../../pages/app/auth/AppAuthSignup.tsx";
import {AppNotFound} from "../../pages/app/AppNotFound.tsx";

const appRoutes: RouteConfig[] = [
    {
        path: '/',
        element: <AppLayout/>,
        id: 'app',
        children: [
            {
                index: true,
                id: 'app-redirect',
                element: <Navigate to={"/home"}/>
            },
            {
                path: 'home',
                id: 'app-home',
                element: <AppHome/>
            },
            {
                path: 'dashboard',
                id: 'app-dashboard',
                element: <AppDashboard/>,
                redirectLogic: (adapter: PermissionAdapter<User>) => {
                    return !adapter.can('view', 'profile') ? '/auth/signin' : false;
                }
            }
        ]
    },
    {
        path: '/auth',
        element: <AppAuthLayout/>,  // Usa AuthLayout solo para autenticación
        id: 'app-auth',
        children: [
            {
                index: true,
                id: 'app-auth-redirect',
                element: <Navigate to={"/app/auth/signin"}/>
            },
            {
                path: 'signin',
                id: 'app-auth-signin',
                element: <AppAuthSignin/>,
                redirectLogic: (adapter: PermissionAdapter<User>) => {
                    return adapter.can('view', 'app-dashboard') ? '/home' : false;
                }
            },
            {
                path: 'signup',
                id: 'app-auth-signup',
                element: <AppAuthSignup/>,
                redirectLogic: (adapter: PermissionAdapter<User>) => {
                    return adapter.can('view', 'app-dashboard') ? '/home' : false;
                }
            }
        ]
    },
    {
        path: '*',
        id: 'notfound',
        element: <AppNotFound/>
    }
];


export default appRoutes;
