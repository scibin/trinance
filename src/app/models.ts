export interface FaveDetail {
    fav_details_id?: number;
    tag: string;
    ethAddress: string;
    notes?: string;
    balance?: string;
}

export interface Fave {
    fav_id?: number;
    ethBalanceArr?: any[];
    faveDetails: FaveDetail[];
}

export interface DEPOSIT {
    amount: number;
    currency: string;
    from: string;
    id: string;
    // Need to convert it to moment
    time: any;
}

export interface WITHDRAWAL {
    amount: number;
    currency: string;
    to: string;
    id: string;
    // Need to convert it to moment
    time: any;
}


export interface TRADE {
    id: string;
    pair: string;
    price: string;
    quantity: string;
    time: any;
    total: string;
    type: string;
}

export interface PROFILE {
    firstName: string;
    lastName: string;
    dob?: any;
    country?: string;
    phone?: string;
    mailPreferences: number;
}
