import { Injectable } from '@angular/core';
import * as CryptoJS  from "crypto-js";

@Injectable({
    providedIn: 'root'
})
export class CryptoEncryptionService {

    encryptAES(password:string){

        let key = CryptoJS.lib.WordArray.random (32);
        let iv = CryptoJS.lib.WordArray.random (16);


        let encrypted = CryptoJS.AES.encrypt( btoa(password), key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });


        return {
            "encrypted":  encrypted.toString (),
            "key": CryptoJS.enc.Base64.stringify (key),
            "iv": CryptoJS.enc.Base64.stringify (iv)
        }
    }
}
