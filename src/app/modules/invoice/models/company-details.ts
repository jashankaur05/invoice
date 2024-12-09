export enum CompanyDetails {
    companyName = 'Softwiz Infotech',
    companyMotto = 'Building Future with Innovation',
    companyAddress = 'D-151, Ground Floor, Industrial Area, Phase 8, Mohali, SAS Nagar, Punjab – 160071',
    companyGST = '03BDZPR9422A1ZC',
    bankName = 'HDFC Bank Ltd, Sector 70, Mohali',
    bankAccountNo = '5020005193480',
    bankIFSCCode = 'HDFC0002450',
    website = 'www.softwizinfotech.com',
    email = 'sales@softwizinfotech.com'
}

export interface InvoiceData {
    gst: number,
    invoiceDate: string,
    items: {
        amount: number,
        description: string,
        sacCode: string
    }[],
    totalAmount: number,
    invoiceNumber: string,
    clientId: string,
    companyId: string,
    invoiceType: string,
    currency: string,
    locked: boolean,
    key: string
}

export enum Currency {
    usd = 'USD ($)',
    // inr = 'INR (₹)',
    gbp = 'GBP (£)'
}
export enum GSTCurrency { 
   inr = 'INR (₹)',
}