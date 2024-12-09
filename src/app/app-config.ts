import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class AppConfig {
  static isCollapse_menu: boolean = false;
  static font_family: string = 'Roboto';
  static readonly LOGIN_PATH: string = '/login';
  static apiUrl: string = environment.apiUrl

}
