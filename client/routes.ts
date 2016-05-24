import 'reflect-metadata';
import 'zone.js/dist/zone';
import {DashboardComponent} from './components/dashboard.component';
import {UserComponent} from './components/user.component';

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
    }
];