import config from "../../config/config";
import {CustomHttp} from "./custom-http";
import {DefaultResponseType} from "../../types/default-response.type";
import {BalanceType} from "../../types/balance.type";

export class Balance {

    static async getBalance(): Promise<void> {
        try {
            // @ts-ignore
            const result: BalanceType = await CustomHttp.request(`${config.host}/balance`)

            if (result) {
                // @ts-ignore
                (document.getElementById('current-balance') as HTMLElement).innerText = result.balance;
            }

            // return result.balance;
        } catch (error) {
            return console.log(error)
        }
    }

    static async updateBalance(currentBalance: Number): Promise<void> {
        try {

            // @ts-ignore
            const response: BalanceType = await CustomHttp.request(`${config.host}/balance`, 'PUT', {
                newBalance: currentBalance
            });

            if (response && response as BalanceType) {
                // @ts-ignore
                const result = await response.json();
                console.log(result)

                if (result && !result.error) {
                    console.log('Что-то пошло не по плану!');
                }
            }
        } catch (error) {
            return console.log(error);
        }
    }
}