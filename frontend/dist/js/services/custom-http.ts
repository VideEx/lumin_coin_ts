import {Auth} from "./auth";
import * as stream from "stream";
import {QueryParamsType} from "../../types/query-params.type";

export class CustomHttp {
    static async request(url: String, method: String = "GET", body: any = null): Promise<String|null> {
        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token = localStorage.getItem("accessToken");

        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        // @ts-ignore
        const response: Response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                const result = await Auth.processUnauthorizedResponse();

                if (result) {
                    return await this.request(url, method, body)
                } else {
                    return null;
                }
            }

            throw new Error(response.statusText);
        }

        return await response.json();
    }
}