import {Chart} from "chart.js/auto";
import {Balance} from "../services/balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Main {
    constructor() {
        this.colorArray = ["rgb(253 126 20)", "rgb(32 201 151)", "rgb(255 193 7)", "rgb(13 110 253)", "rgb(220 53 69)"];

        this.incomeData = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        this.expensesData = [10, 20, 30, 40, 50, 60, 70, 80, 90];

        this.setColor(this.incomeData);
        this.setColor(this.expensesData);

        const ctx = document.getElementById('income');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: 'Рублей',
                    data: this.incomeData,
                    backgroundColor: this.colorArray
                }]
            },
        });
        const ctx1 = document.getElementById('expenses');
        new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: 'Рублей',
                    data: this.expensesData,
                    backgroundColor: this.colorArray
                }]
            },
        });

        this.getCategories()
    };

    getRandomInt() {
        return Math.floor(Math.random() * 150);
    };

    setColor(category) {
        if (this.colorArray.length < category.length) {
            let count = category.length - this.colorArray.length + 1;

            for (let i = 0; i < count; i++) {
                let color = `rgb(${this.getRandomInt()} ${this.getRandomInt()} ${this.getRandomInt()})`;
                this.colorArray.push(color);
            };
        };
    };

    async getCategories() {
        try {
            // console.log(accessToken);

            const result = await CustomHttp.request(config.host + '/categories/expense')

            console.log(result);

            if (result) {
                if (result.error) {
                    throw new Error(result.message)
                }
            };
        } catch (error) {
            return console.log(error)
        }
    }
}