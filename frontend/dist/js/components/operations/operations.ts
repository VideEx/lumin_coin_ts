import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";
import {CategoriesAllResponseType} from "../../../types/category.types";
import {DefaultResponseType} from "../../../types/default-response.type";
import {OperationResponseType} from "../../../types/operations-response.type";

export class Operations {
    constructor() {

    }
    // @ts-ignore
    async getOperations(period: String|null, dateFrom: null| String, dateTo: null| String): Promise<OperationResponseType[]> {
        try {
            console.log('Текущий период - ', period)
            console.log('Текущая дата - ', dateFrom)
            console.log('Текущая дата - ', dateTo)
            let params = '';

            if (dateFrom === null || dateTo === null) {
                params = `?period=${period}`;
                console.log(params)
            } else {
                params = `?period=interval&dateFrom=${dateFrom}&dateTo=${dateTo}`;
            }

            // @ts-ignore
            const result: DefaultResponseType|OperationResponseType[] = await CustomHttp.request(`${config.host}/operations${params}`)

            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }

            // @ts-ignore
            return result;
        } catch (error) {
            console.log(error)
        }
    }

    async getOperation(id: String|null): Promise<any> {
        try {
            // @ts-ignore
            const result: DefaultResponseType | OperationResponseType = await CustomHttp.request(`${config.host}/operations/${id}`)

            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }

            return result;
        } catch (error) {
            console.log(error);
        }
    }
}