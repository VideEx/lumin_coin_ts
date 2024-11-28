import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";

import {Categories} from './categories'
import {CategoriesAllResponseType} from "../../../types/category.types";
import {DefaultResponseType} from "../../../types/default-response.type";

export class GetCategories extends Categories {
    category: null | String;
    categoriesList: Promise<CategoriesAllResponseType[] | void>;

    categoriesBlock: null | HTMLElement;

    constructor(category: null | String) {
        super();
        this.category = category;
        this.categoriesList = Categories.getCategories(this.category);
        this.categoriesBlock = null;
        this.init();
    }

    init() {
        this.categoriesBlock = document.getElementById('categories') as HTMLElement;

        this.categoriesList.then(item => {
            item?.forEach(categoryItem => {
                let card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('id', categoryItem.id.toString());

                let cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                let title = document.createElement('h5');
                title.classList.add('card-title');
                title.innerText = categoryItem.title;
                let confirmLink = document.createElement('button');
                confirmLink.classList.add('btn');
                confirmLink.classList.add('btn-primary');
                confirmLink.classList.add('me-1');
                confirmLink.innerText = 'Редактировать';
                let deleteLink = document.createElement('button');
                deleteLink.setAttribute('data-bs-toggle', 'modal');
                deleteLink.setAttribute('data-bs-target', '#modal');
                deleteLink.classList.add('btn');
                deleteLink.classList.add('btn-danger');
                deleteLink.innerText = 'Удалить';

                cardBody.appendChild(title);
                cardBody.appendChild(confirmLink);
                cardBody.appendChild(deleteLink);
                card.appendChild(cardBody);
                this.categoriesBlock?.prepend(card);

                deleteLink.onclick = () => {
                    console.log('sjdnk');
                    this.showDeleteModal(card.id);
                };

                confirmLink.onclick = () => {
                    location.href = `/#/edit_${this.category}?id=${card.id}`
                    sessionStorage.setItem('title', categoryItem.title)
                };
            })
        });
    }

    // Работа с модальным окном при удалении категории
    showDeleteModal(id: String | null): void {
        let deleteBtn = document.getElementById('delete-category') as HTMLElement;

        deleteBtn.onclick = () => {
            this.deleteCategory(id);
        }
    }


    // удаление категории
    async deleteCategory(categoryId: String | null): Promise<void> {

        // @ts-ignore
        const response: CategoriesAllResponseType|DefaultResponseType = await CustomHttp.request(`${config.host}/categories/${this.category}/${categoryId}`, 'DELETE');

        if (response as CategoriesAllResponseType) {

            if (response as DefaultResponseType) {
                console.log('Что-то пошло не по плану!')
            }
        }
        location.reload();
    }
}