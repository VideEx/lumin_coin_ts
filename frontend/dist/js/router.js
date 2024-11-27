import {Form} from "./components/form.js";
import {Main} from "./components/main.js";
import {Auth} from "./services/auth.js";
import {Income} from "./components/income.js";
import {Expenses} from "./components/expenses.js";
// import {Sidebar} from "./components/sidebar.js";

export class Router {
    constructor() {
        this.sidebar = document.getElementById('sidebar');

        this.content = document.getElementById('content');

        this.pageTitle = document.getElementById('page');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'template/main.html',
                load: () => {
                    new Main();
                    // new Sidebar();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'template/signup.html',
                load: () => {
                    new Form('signup');
                    console.log('sdlskc');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'template/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/logout',
                title: 'Выход',
                template: 'template/login.html',
                load: () => {

                }
            },
            {
                route: '#/all_category',
                title: 'Все категории',
                template: 'template/all_category.html',
                load: () => {

                }
            },
            {
                route: '#/create_category',
                title: 'Создание категории',
                template: 'template/create_new_change.html',
                load: () => {

                }
            },
            {
                route: '#/edit_category',
                title: 'Изменение категории',
                template: 'template/edit_change.html',
                load: () => {

                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'template/income/categories.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/edit_income',
                title: 'Доходы',
                template: 'template/income/edit_category.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/create_income',
                title: 'Доходы',
                template: 'template/income/create_category.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'template/expenses/categories.html',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/edit_expenses',
                title: 'Расходы',
                template: 'template/expenses/edit_category.html',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/create_expenses',
                title: 'Расходы',
                template: 'template/expenses/create_category.html',
                load: () => {
                    new Expenses();
                }
            },
        ]
    };

    async openRoute() {

        const urlRoute = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login'
            return;
        }

        if (urlRoute !== '#/login' && urlRoute !== '#/signup') {
            this.sidebar.classList.remove('d-none');
            this.sidebar.classList.add('d-flex');
            this.content.classList.add('main-category-block');
            this.sidebar.innerHTML =  await fetch('template/sidebar.html').then(response => response.text());
        } else {
            this.sidebar.classList.add('d-none');
            this.content.classList.remove('main-category-block');
        }

        this.content.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.pageTitle.innerText = newRoute.title;
        
        newRoute.load();
    }
}

