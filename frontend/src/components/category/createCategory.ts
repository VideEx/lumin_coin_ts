import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";

import {Categories} from './categories'
import {DefaultResponseType} from "../../../types/default-response.type";
import {CategoriesAllResponseType} from "../../../types/category.types";

export class CreateCategory extends Categories {
    category: null | string;
    submit: null | HTMLInputElement;
    categoryTitle: null | string;

    constructor(category: null | string) {
        super();
        this.category = category;
        this.submit = null;
        this.categoryTitle = null;
        this.init();
    }

    init() {

        this.categoryRegex = /[А-Яа-яЁё]{2,3}/g;

        this.submit = document.getElementById('create-category-btn') as HTMLInputElement;

        this.submit.onclick = (e) => {
            e.preventDefault();
            if (this.validField(this.category)) {
                this.createCategory(this.category).then();
            }
        };
    };

    // создание категории
    async createCategory(category: null | string): Promise<void> {
        try {

            // @ts-ignore
            const response: DefaultResponseType | CategoriesAllResponseType = await CustomHttp.request(`${config.host}/categories/${category}`, 'POST', {
                title: (this.categoryTitle as String),
            });

            if (response) {
                if (response as DefaultResponseType) {
                    console.log('Что-то пошло не по плану!')
                }
            }

            location.href = `/#/${this.category}`
        } catch (error) {
            alert('Такая категория уже создана, измените название!')
            console.log(error)
        }
    }

}