import {Balance} from "../../services/balance";
import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CategoriesAllResponseType} from "../../../types/category.types";
import {OperationResponseType} from "../../../types/operations-response.type";

export class Categories {
    categoryField: HTMLInputElement | null;
    categoryValueError: HTMLElement | null;
    categoryRegexError: HTMLElement | null;

    public categoryTitle: String|null;

    categoryRegex: RegExp|null;

    constructor() {
        this.categoryField = null;
        this.categoryValueError = null;
        this.categoryRegexError = null;

        this.categoryTitle = null;

        this.categoryRegex = /[А-Яа-яЁё]{2,3}/g;

    }
    // Валидация полей
    validField(category: String | null): boolean |  void {
        this.categoryField = document.getElementById('category-input') as HTMLInputElement;
        this.categoryValueError = document.getElementById('valueError');
        this.categoryRegexError = document.getElementById('regexError');

        if (this.categoryValueError && this.categoryRegexError) {
            this.categoryValueError.classList.remove('d-block');
            this.categoryRegexError.classList.remove('d-block');
        }

        if (this.categoryField!.value) {
            this.categoryTitle = this.categoryField.value;
            return true;
        }
        if (!this.categoryField.value && this.categoryValueError) {
            this.categoryValueError.classList.remove('d-none');
            this.categoryValueError.classList.add('d-block');
            return true;
        }
        if (this.categoryRegexError && this.categoryField.value.match(this.categoryRegex as RegExp)) {
            this.categoryRegexError.classList.remove('d-none');
            this.categoryRegexError.classList.add('d-block');
            return true;
        }
    }

    // получение категории
    static async getCategories(category: String | null): Promise<any> {
        try {
            // @ts-ignore
            const result: DefaultResponseType|CategoriesAllResponseType = await CustomHttp.request(`${config.host}/categories/${category}`)

            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }

            // @ts-ignore
            return result;
        } catch (error) {
            console.log('Ошибка')
        }
    }

}