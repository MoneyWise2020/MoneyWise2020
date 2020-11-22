
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
