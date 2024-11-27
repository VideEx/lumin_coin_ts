import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {

    constructor(page) {
        this.processElement = null;
        this.agreeElement = false;
        this.page = page;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }

        this.userData = {
            name: null,
            lastName: null,
            email: null
        };
        this.fields = [
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

        if (this.page === "signup") {
            this.fields.unshift(
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

        const that = this;

        this.processElement = document.getElementById('process');
        // console.log(this.fields)
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            // console.log(item.element)
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            };
        });
        this.processElement = document.getElementById('process');
        // console.log(this.processElement)
        this.processElement.onclick = function () {
            that.processForm();
        };

        if (this.page === "login") {
            this.agreeElement = document.getElementById('agree');
            this.isAgree = this.agreeElement.checked;
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = "red";
            // console.log(element)
            // console.log(field)
            document.getElementById(field.errorElementId).style.display = 'block';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
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

            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {
                    const repeatPassword = this.fields.find(item => item.name === 'repeatPassword').element.value;

                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === 'name').element.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat: repeatPassword
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message)
                        }
                    }
                } catch (error) {
                    return console.log(error)
                }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.isAgree
                })

                console.log(result)

                if (result) {
                    // console.log(result)
                    // console.log(result.tokens)
                    // console.log(result.user)
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message)
                    }

                    // console.log(result);

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.fullName,
                        userId: result.user.id,
                        email: email
                    });

                    location.href = '#/'
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
