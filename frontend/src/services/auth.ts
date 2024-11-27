import config from "../../config/config";
import {UserDataType} from "../../types/user-data.type";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);

        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }

        this.removeTokens();
        location.href = '#/login';
        return false;

    }

    static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static async logout(): Promise<boolean|void> {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);

        if (refreshToken) {
            const response = await fetch('http://localhost:3000/api' + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();

                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true;
                }
            }
        }
    }

    static setUserInfo(info: UserDataType):void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo(): String|null {
        const userInfo = localStorage.getItem(this.userInfoKey);

        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}