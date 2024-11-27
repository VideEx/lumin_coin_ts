import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {FormFieldsType} from "../../types/form-fields.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {UserDataType} from "../../types/user-data.type";
import {LoginResponseType} from "../../types/login-response.type";

export class Form {

    page: String;
    // agreeElement: boolean;
    agreeElement: HTMLInputElement|null;
    isAgree: boolean;
    processElement: HTMLElement|null;

    fields: FormFieldsType[] = [
        {
            name: 'email',
            id: 'email',
            element: null,
            regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            valid: false,
            errorElementId: 'emailError'
        },
        {
            name: 'password',
            id: 'password',
            element: null,
            regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            valid: false,
            errorElementId: 'passwordError'
        },
    ];

    constructor(page: String) {
        this.processElement = null;
        // this.agreeElement = false;
        this.agreeElement = null;
        this.page = page;

        this.isAgree = false;
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }

        if (this.page === "signup") {
            this.fields?.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /[A-Za-zА-Яа-яЁё]{2,3}/,
                    valid: false,
                    errorElementId: 'nameError'
                },
                {
                    name: 'repeatPassword',
                    id: 'repeat-password',
                    element: null,
                    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    valid: false,
                    errorElementId: 'repeatPasswordError'
                });
        }

        const that: Form = this;

        this.processElement = document.getElementById('process');
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.element.onchange = function () {
                that.validateField.call(that, item, <HTMLInputElement>this)
            };
        });
        this.processElement = document.getElementById('process') as HTMLInputElement;
        this.processElement.onclick = function () {
            that.processForm();
        };

        if (this.page === "login") {
            this.agreeElement = document.getElementById('agree') as HTMLInputElement;
            this.isAgree = this.agreeElement.checked;
        }
    }

    validateField(field: FormFieldsType, element: HTMLInputElement) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = "red";
            (document.getElementById(field.errorElementId) as HTMLInputElement).style.display = 'block';
            field.valid = false;
        } else {
            (element.parentNode as HTMLElement).removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    };

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        // console.log(validForm);

        return validForm;
    };

    async processForm() {
        if (this.validateForm()) {

            // console.log(this.fields)

            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = this.fields.find(item => item.name === 'password')?.element?.value;

            if (this.page === 'signup') {
                try {
                    const repeatPassword = this.fields.find(item => item.name === 'repeatPassword')?.element?.value;

                    // @ts-ignore
                    const result: DefaultResponseType|UserDataType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name')?.element?.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === 'name')?.element?.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat: repeatPassword
                    });

                    if (result) {
                        if ((result as DefaultResponseType).error) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                    }
                } catch (error) {
                    return console.log(error)
                }
            }

            try {
                // @ts-ignore
                const result: DefaultResponseType|LoginResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.isAgree
                })

                console.log(result)

                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    console.log(result)

                    Auth.setTokens((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken);
                    Auth.setUserInfo({
                        name: (result as LoginResponseType).user.name,
                        lastName: (result as LoginResponseType).user.lastName,
                        id: (result as LoginResponseType).user.id!,
                        email: email as string
                    })

                    location.href = '#/'
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
