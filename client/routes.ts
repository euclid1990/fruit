import 'reflect-metadata';
import 'zone.js/dist/zone';
import {DashboardComponent} from './components/dashboard.component';
import {UserComponent, UserDetailComponent} from './components/user.component';
import {RegisterComponent, LoginComponent, LogoutComponent} from './components/auth.component';

export interface Route {
    path: string,
    name: string,
    component: any,
    useAsDefault?: boolean
}

export const Routes: Route[] = [
    {
        path: '/',
        name: 'Dashboard',
        component: DashboardComponent,
        useAsDefault: true
    },
    {
        path: '/user',
        name: 'User',
        component: UserComponent
    },
    {
        path: '/user/:id',
        name: 'UserDetail',
        component: UserDetailComponent
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterComponent
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    },
    {
        path: '/logout',
        name: 'Logout',
        component: LogoutComponent
    }
];