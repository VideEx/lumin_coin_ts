import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";
import {Balance} from '../../services/balance';

import {Categories} from '../category/categories'
import {Operations} from './operations'
import {OperationDataType} from "../../../types/operations-data.type";
import {OperationResponseType} from "../../../types/operations-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";

export class EditOperations extends Operations {
    period: String | null;
    type: String | null;
    count: String | null;
    category: String | null;
    date: String | null;
    comment: String | null;

    typeInput: HTMLInputElement | null;
    categorySelect: HTMLInputElement | null;
    countInput: HTMLInputElement | null;
    dateInput: HTMLInputElement | null;
    commentInput: HTMLInputElement | null;
    createButton: HTMLInputElement | null;
    editElement: HTMLInputElement | null;

    operation;

    constructor() {
        super();

        this.period = 'all';

        this.type = null;
        this.category = null;
        this.count = null;
        this.date = null;
        this.comment = null;
        //
        // this.currentIdCategory = null;
        this.typeInput = document.getElementById('inputType') as HTMLInputElement;
        this.categorySelect = document.getElementById('inputCategory') as HTMLInputElement;
        this.countInput = document.getElementById('inputCount') as HTMLInputElement;
        this.dateInput = document.getElementById('inputDate') as HTMLInputElement;
        this.commentInput = document.getElementById('inputComment') as HTMLInputElement;
        this.createButton = document.getElementById('createOperation') as HTMLInputElement;

        this.editElement = document.getElementById('edit-btn') as HTMLInputElement;

        const params = window.location.hash.split('?')[1].split('=')[1];
        this.operation = this.getOperation(params);
        this.init();
    }

    init() {


        // this.typeInput = document.getElementById('inputType');
        // this.countInput = document.getElementById('inputCount');
        // this.dateInput = document.getElementById('inputDate');
        // this.commentInput = document.getElementById('inputComment');
        // this.editElement = document.getElementById('edit-btn');
        //
        // this.categorySelect = document.getElementById('inputCategory')

        const data = this.operation.then(item => {
            item.type === 'income' ? (this.typeInput as HTMLInputElement).value = 'Доход' :  (this.typeInput as HTMLInputElement).value = 'Расход';
            (this.typeInput as HTMLInputElement).id = item.type;
            (this.countInput as HTMLInputElement).value = item.amount.toString();
            (this.dateInput as HTMLInputElement).value = item.date;
            (this.commentInput as HTMLInputElement).value = item.comment;


            const categories = Categories.getCategories(item.type);

            categories.then(item => {

                console.log(categories)

                // @ts-ignore
                item?.forEach(categoryItem => {
                    let op = document.createElement('option');
                    op.innerText = categoryItem.title;
                    op.value = categoryItem.id.toString();

                    // @ts-ignore
                    if (categoryItem === item.title) {
                        op.setAttribute('selected', 'true')
                    }

                    (this.categorySelect as HTMLInputElement).appendChild(op);
                })
            })
        });

        (this.typeInput as HTMLInputElement).setAttribute('disabled', 'true');

        (this.editElement as HTMLInputElement).onclick = () => {
            let id = window.location.hash.split('=')[1].split('&')[0];
            this.editOperations(id);
        };
    }

    async editOperations(id: String) {
        let newDate = new Date();
        let currentDate = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`;

        try {
            // @ts-ignore
            const response: OperationResponseType[]|DefaultResponseType = await CustomHttp.request(`${config.host}/operations/${id}`, 'PUT', {
                type: this.typeInput?.id,
                amount: this.countInput?.value,
                category_id: Number(this.categorySelect?.value),
                date: this.dateInput?.value ? this.dateInput.value : `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`,
                comment: this.commentInput?.value ? this.commentInput.value : 'Новая операция'
            });

            if (response) {
                if ((response as OperationResponseType[])) {
                    // @ts-ignore
                    const result = await response.json();

                    if (result && !result.error) {
                        console.log('Что-то пошло не по плану!');
                    }
                }
            }

            await Balance.getBalance();
            location.href = '/#/operations'
        } catch (e) {
            alert('Такая запись уже существует!')
        }
    }
}