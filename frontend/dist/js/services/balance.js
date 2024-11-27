// import config from "../../config/config.js";
// import {Auth} from "../services/auth.js"
// import {CustomHttp} from "../services/custom-http.js"
// import {UrlManager} from "../utilities/url-manager.js";
//
//
// export class Balance {
//     constructor() {
//
//     }
//
//     static async getBalance() {
//         // const routeParams = UrlManager.getQueryParams();
//
//         // console.log(routeParams)
//         try {
//
//             const accessToken = localStorage.getItem('accessToken');
//
//             console.log(accessToken);
//
//             const result = await CustomHttp.request(config.host + '/balance' + '?accessToken=' + accessToken)
//
//             console.log(result);
//
//             if (result) {
//                 if (result.error) {
//                     throw new Error(result.message)
//                 }
//             }
//             ;
//         } catch (error) {
//             return console.log(error)
//         }
//
//     }
// }