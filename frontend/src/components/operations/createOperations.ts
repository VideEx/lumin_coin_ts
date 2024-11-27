import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";
import {Balance} from '../../services/balance';

import {Operations} from './operations';
import {Categories} from '../category/categories';
import {CategoriesAllResponseType} from "../../../types/category.types";
import {DefaultResponseType} from "../../../types/default-response.type";
import {OperationResponseType} from "../../../types/operations-response.type";
import {OperationDataType} from "../../../types/operations-data.type";

export class CreateOperations extends Operations{
    typeSelect: HTMLInputElement | null;
    categorySelect: HTMLInputElement | null;
    countInput: HTMLInputElement | null;
    dateInput: HTMLInputElement | null;
    commentInput: HTMLInputElement | null;
    createButton: HTMLInputElement | null;

    period: String | null;
    type: String | null;
    count: String | null;
    categoryId: String | null;
    date: String | null;
    comment: String | null;
    amount: String | null;
    currentIdCategory: String | null;

    categoryRegex: RegExp;

    categoryValueError: HTMLElement | null;
    categoryRegexError: HTMLElement | null;
    category: Promise<[CategoriesAllResponseType] | void> | null;

    constructor() {
        super();
        this.period = 'all';

        this.type = null;
        this.categoryId = null;
        this.count = null;
        this.date = null;
        this.comment = null;

        this.amount = null;

        this.currentIdCategory = null;

        this.typeSelect = document.getElementById('inputType') as HTMLInputElement;
        this.categorySelect = document.getElementById('inputCategory') as HTMLInputElement;
        this.countInput = document.getElementById('inputCount') as HTMLInputElement;
        this.dateInput = document.getElementById('inputDate') as HTMLInputElement;
        this.commentInput = document.getElementById('inputComment') as HTMLInputElement;
        this.createButton = document.getElementById('createOperation') as HTMLInputElement;

        this.categoryRegex = /[0-9]{1,7}/g;

        this.categoryValueError = document.getElementById('valueError');
        this.categoryRegexError = document.getElementById('regexError');

        this.category = null;

        this.init();
    }

    init() {


        this.categorySelect?.classList.add('d-none');
        this.countInput?.classList.add('d-none');
        this.dateInput?.classList.add('d-none');
        this.commentInput?.classList.add('d-none');

        (this.typeSelect as HTMLInputElement).onchange = () => {
            (this.categorySelect as HTMLInputElement).innerHTML = '';

            this.getForm((this.typeSelect as HTMLInputElement).value);
        }

        (this.createButton as HTMLInputElement).onclick = (e) => {
            e.preventDefault();

            (this.categoryValueError as HTMLElement).classList.remove('d-block');
            (this.categoryRegexError as HTMLElement).classList.remove('d-block');

            this.type = (this.typeSelect as HTMLInputElement).value;
            this.categoryId = (this.categorySelect as HTMLInputElement).value;
            this.date = (this.dateInput as HTMLInputElement).value;
            this.comment = (this.commentInput as HTMLInputElement).value;

            if (this.countInput!.value && this.countInput!.value.match(this.categoryRegex)) {
                this.amount = (this.countInput as HTMLInputElement).value;
                this.createOperation((this.categorySelect as HTMLInputElement).value);
            } else if (!this.countInput?.value) {
                this.categoryValueError?.classList.remove('d-none');
                this.categoryValueError?.classList.add('d-block');
            } else if (!this.countInput.value.match(this.categoryRegex)) {
                this.categoryRegexError?.classList.remove('d-none');
                this.categoryRegexError?.classList.add('d-block');
            }
        }
    }

    getForm(type: String | null): void {
        this.category = Categories.getCategories(type)

        // Прячем все элементы кроме выбора типа, чтобы подгрузить категории
        // Надо подгружать категории сразу, но я не сообразила как
        this.categorySelect?.classList.remove('d-none');
        this.countInput?.classList.remove('d-none');
        this.dateInput?.classList.remove('d-none');
        this.commentInput?.classList.remove('d-none');

        // Генерируем опции для выпадающего списка в соответствии с полученными категориями

        this.category.then(item => {
            item?.forEach(categoryItem => {
                let op = document.createElement('option');
                op.innerText = categoryItem.title;
                op.value = categoryItem.id.toString();
                this.categorySelect?.appendChild(op);
            })
        });

        // this.categorySelect.onchange = () => {
        //     console.log(this.categorySelect.value)
        // }
    }

    async createOperation(category: String | null): Promise<void> {
        let newDate = new Date();

        let currentDate = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;

        try {
            // @ts-ignore
            const response: OperationResponseType | DefaultResponseType = await CustomHttp.request(`${config.host}/operations`, 'POST', {
                type: this.typeSelect?.value,
                category_id: Number(category),
                amount: this.countInput?.value,
                date: this.dateInput?.value ? this.dateInput.value : `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`,
                comment: this.commentInput?.value ? this.commentInput.value : 'Новая операция'
            });

            if (response) {
                if (response as DefaultResponseType) {
                    console.log('Что-то пошло не по плану!');
                }
            }
            await Balance.getBalance();
            location.href = '/#/operations';
        }
        catch
            (error)
            {
                console.log(error)
            }
        }
    }