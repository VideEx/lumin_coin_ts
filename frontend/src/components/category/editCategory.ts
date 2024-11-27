import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";
import {UrlManager} from "../../utilities/url-manager";

import {Categories} from './categories'
import {QueryParamsType} from "../../../types/query-params.type";

export class EditCategory extends Categories {

    category: null | String;

    titleInput: null|HTMLInputElement;

    editBtn: null|HTMLInputElement;

    constructor(category: null | String) {
        super();
        this.category = category;

        this.titleInput = null;
        this.editBtn = null;

        this.init();
    }

    init() {
        this.titleInput = document.getElementById('category-input') as HTMLInputElement;
        this.categoryRegex = /[А-Яа-яЁё]{2,3}/g;
        this.editBtn = document.getElementById('save-btn') as HTMLInputElement;
        let titleValue: String | null = sessionStorage.getItem('title')
        console.log(titleValue);
        // @ts-ignore
        this.titleInput.value = titleValue;
        this.editBtn.onclick = (e) => {
            e.preventDefault();
            sessionStorage.removeItem('title')
            e.preventDefault();
            if (this.validField(this.category)) {
                const queryParams: QueryParamsType = UrlManager.getQueryParams();
                this.editCategory(queryParams.id, titleValue).then();
            }
        }
    };

    // изменение категории
    async editCategory(id: string, value: String|null) {

        const response = await CustomHttp.request(`${config.host}/categories/${this.category}/${id}`, 'PUT', {
            title: value,
        });

        location.href = `/#/${this.category}`
    };
}