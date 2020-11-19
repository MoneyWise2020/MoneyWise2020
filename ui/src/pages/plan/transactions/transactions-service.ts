import axios from 'axios';

const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

export interface IApiTransaction {
    rule_id: string;
    id: string;
    value: number;
    day: string;
    calculations: {
        balance: number;
        working_capital: number;
    }
}

export class TransactionsService {
    public static getTransactions(userid: string): Promise<IApiTransaction[]> {
        const now = new Date();
        return axios.get(`${baseUrl}/api/transactions`, { params: { 
            userid,
            startDate: now.toISOString(),
            endDate: new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString()
        }})
            .then(({ data }) => data);
    }
}