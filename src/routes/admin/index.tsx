
import {Navigate} from "react-router-dom";
import {AdminNotFound} from "../../pages/admin/AdminNotFound.tsx";
import {AdminHome} from "../../pages/admin/AdminHome.tsx";
import {PermissionAdapter, RouteConfig} from "../../lib";
import {AdminLayout} from "../../layouts/admin/AdminLayout.tsx";
import {AdminDashboard} from "../../pages/admin/AdminDashboard.tsx";
import {AdminAuthLayout} from "../../layouts/admin/AdminAuthLayout.tsx";
import {AdminAuthSignin} from "../../pages/admin/auth/AdminAuthSignin.tsx";
import {AdminAuthSignup} from "../../pages/admin/auth/AdminAuthSignup.tsx";
import {User} from "../../types";


const adminRoutes: RouteConfig[] = [
    {
        path: '/admin',
        element: <AdminLayout/>,
        id: 'admin',
        children: [
            {
                index: true,
                id: 'admin-redirect',
                element: <Navigate to={"/admin/home"}/>
            },
            {
                path: 'home',
                id: 'admin-home',
                element: <AdminHome/>
            },
            {
                path: 'dashboard',
                id: 'admin-dashboard',
                element: <AdminDashboard/>,
                redirectLogic: (adapter: PermissionAdapter<User>) => {
                    return !adapter.can('view', 'dashboard') ? '/auth/signin' : false;
                }
            }
        ]
    },
    {
        path: '/admin/auth',
        element: <AdminAuthLayout/>,  // Usa AuthLayout solo para autenticación
        id: 'admin-auth',
        children: [
            {
                index: true,
                id: 'admin-auth-redirect',
                element: <Navigate to={"/admin/auth/signin"}/>
            },
            {
                path: 'signin',
                id: 'admin-auth-signin',
                element: <AdminAuthSignin/>,
                redirectLogic: (adapter: PermissionAdapter<User>) => {
                    return adapter.can('view', 'admin-dashboard') ? '/home' : false;
                }
            },
            {
                path: 'signup',
                id: 'admin-auth-signup',
                element: <AdminAuthSignup/>,
                redirectLogic: (adapter: PermissionAdapter<User>) => {
                    return adapter.can('view', 'admin-dashboard') ? '/home' : false;
                }
            }
        ]
    },
    {
        path: '/admin/*',
        id: 'notfound',
        element: <AdminNotFound/>
    }
];


export default adminRoutes;
