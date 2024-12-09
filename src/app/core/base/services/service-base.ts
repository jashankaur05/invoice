import { HttpClient, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { SortMeta } from 'primeng/api';
import { BehaviorSubject, Observable, map, tap, catchError, of, throwError } from 'rxjs';
import { TTableFilter } from 'src/app/shared/modules/table/models/table';
import { NotificationService } from '../../services/notification/notification.service';
import { BaseOptions } from '../models/base-options.model';
import { BaseResource } from '../models/base-resource';
import { AppConfig } from 'src/app/app-config';
import { LoginResponse } from 'src/app/modules/user-login/models/login-response';
import { LoginService } from 'src/app/modules/user-login/services/login.service';
import { ConfirmService } from '../../confirm/services/confirm.service';

/**
 * Abstract service for interacting with Base rest endpoints.
 * R: resource model: user, Company, WorkLoad ....,
 * C: create model used to create a new resource
 * U: update model used to update a resource
 */

export abstract class BaseService<R extends BaseResource, U = R, C = U> {

  private _dataSubject = new BehaviorSubject<R[]>([]);
    public dataObservable$!:Observable<R[] | undefined>;


    get dataItems():R[] {
        return this._dataSubject.getValue()??[];
    }

    set dataItems(value:R[] ){
        this._dataSubject.next(value);
    }

    clear(){
        this._dataSubject.next([]);
    }

    protected readonly http: HttpClient;

    public defaultTableFilter:TTableFilter  = {}
    public initialFilter:TTableFilter  = {}

    public multiSort:SortMeta[] = [];

    get endpointUrl(): string {
        return this._endpointUrl ?? AppConfig.apiUrl + this.options.path;
    }
    set endpointUrl(url: string | undefined | null) {
        this._endpointUrl = url;
    }

    public _endpointUrl: string | null | undefined;

    public confirmService!: ConfirmService;
    public notificationService!: NotificationService;

    public currentUser!:LoginResponse | null;

    public constructor(
        private readonly injector: Injector,
        public readonly options: BaseOptions<R, U, C>
    ) {

        this.dataObservable$ = this._dataSubject.asObservable();
        this.http = this.injector?.get(HttpClient);
        this.notificationService = this.injector?.get(NotificationService);
        // this.confirmService = this.injector?.get(ConfirmService);
        this.currentUser = injector?.get(LoginService)?.currentUser||null;
    }

    updateOrAddItemById(item:R){

        let index = this.dataItems.findIndex((elem)=> elem.id == item.id);

        if(index < 0) {
            this.dataItems = [ ...this.dataItems, item ];
        }else{
            this.dataItems[index] = {...this.dataItems[index], ...item};
        }
    }


    public get( url: string, options?: { params?:| HttpParams | { [param: string]: string | string[] } } ): Observable<R> {
        return this.http.get<R>(url, options);
    }


    public put(url: string, body: any): Observable<R> {
        return this.http.put<R>(url, body);
    }
    
    public post(url: string, body: any): Observable<R> {
        return this.http.post<R>(url, body);
    }
    
    public getById( id: string, queryParams?: { [key: string]: string } ): Observable<R> {

        const options: { [param: string]: { [key: string]: string } } = {};

        if (queryParams) {
            options['param'] = queryParams;
        }
        return this.get(this.endpointUrl + '/' + id, options) as Observable<R>;
    }


    public getList( url: string, options?: { params?: | HttpParams | { [param: string]: string | string[] } } ): Observable<R[]> {

        const observable: Observable<R[]> = this.http.get<R[]>(url, options);

        return observable;
    }

    public delete( endpoint?: string): Observable<boolean> {

        const url = endpoint ? `${this.endpointUrl}/${endpoint}` : this.endpointUrl;

        let $ = this.http.delete(url).pipe(map(() => true));

        $ = $.pipe(tap(() => {
            this.notificationService.showSuccess("notificationMessage.success");
        }));

        $ = $.pipe(catchError((error) => {

            this.notificationService.showError("notificationMessage.error");

            return of(false)
        }));

        return $;
    }


    public deleteConfirm( resource: R | undefined, endpoint?: string ): Observable<boolean> {

        if (!resource) {
            return of(false);
        }

        //TODO: Implement confirm Service as a task and call .confirm(message) return type observable<boolean>
        //TODO: confirm Service   .confirm(this.options.messages?.deleteConfirm(resource)

        let confirm = false;

        if (confirm) {
            return this.delete( endpoint);
        } else {
            return of(false);
        }
    }

    public create(createModel: C, endpointUrl?: string): Observable<R> {

        let $ = this.http.post<R>(endpointUrl ?? this.endpointUrl, createModel);

        $ = $.pipe(tap((createdResource: R) => {
            this.updateOrAddItemById(createdResource);
            this.notificationService.showSuccess("notificationMessage.success");
        }));

        $ = $.pipe( catchError((error) => {

            this.notificationService.showError("notificationMessage.error");

            const newError = `Error Code: ${error.status}\nMessage: ${error.message}`;

            return throwError( () => new Error( newError ));
        }));

        return $;
    }

    public update(url: string, update: U): Observable<R | undefined> {

        let $ = this.http.put<R>(url, update);

        $ = $.pipe(tap((updatedResource: R) => {
            this.updateOrAddItemById(updatedResource);
            this.notificationService.showSuccess("notificationMessage.success");
        }));

        $ = $.pipe(catchError((error) => {

            this.notificationService.showError("notificationMessage.error");
            const newError = `Error Code: ${error.status}\nMessage: ${error.message}`;

            return throwError( () => new Error( newError));
        }));

        return $;
    }

    public updateById(id: number | string, update: U): Observable<R | undefined> {

        return this.update(this.endpointUrl + '/' + String(id), update);
    }

    getFilteredCollection(pageNumber: number | undefined, recordsPerPage: number | undefined, filter: any | undefined, sortMeta: SortMeta | SortMeta[] | undefined): Observable<{totalRecords:number,results:R[]}> {

        const  options = this.tableRequestOptions(pageNumber, recordsPerPage, filter, sortMeta);

        const $ = this.http.post<{totalRecords:number,results:R[]}>(`${this.endpointUrl}/search`, options);

        return $;
     }

     public tableRequestOptions(pageNumber: number | undefined, recordsPerPage: number | undefined, filter: any, sortMeta: SortMeta | SortMeta[] | undefined) {

        const customer = this.currentUser?.customerName;

        return {
            pagination: {
                pageNumber: pageNumber,
                recordsPerPage: recordsPerPage
            },
            orderBy: sortMeta,
            filter: {
                ...filter,
                companyName: { value: customer, matchMode: 'equals' }
            }
        };
    }
}
