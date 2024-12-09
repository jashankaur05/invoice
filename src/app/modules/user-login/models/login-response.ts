import { Companies } from "src/app/core/base/models/customer-company.enum";

export interface LoginResponse {
    id: string,
    name: string,
    lastName: string,
    customerEmail: string,
    customerName: Companies,
    email: string,
    accessToken: string
}
