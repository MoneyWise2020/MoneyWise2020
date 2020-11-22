import React from 'react';
import { IApiTransaction} from './ITransaction';
import { Transaction } from './Transaction'
import useAxios from 'axios-hooks'

// TODO: get from login
const userid = 'test'
const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;


const now = new Date();

export const TransactionsContainer = () => {
    const [{ data, loading, error }, refetch] = useAxios(
        `${baseUrl}/api/transactions?userid=${userid}&startDate=${now.toISOString()}&endDate=${new Date(now.getTime() + (720 * 24 * 60 * 60 * 1000)).toISOString()}`
    )
    
    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error occurred while fetching transactions! Try refreshing the page.</p>
    }

    console.log(data)
    const tableData = data.transactions as IApiTransaction[];

    return <div className="table-responsive" style={{height:300}}>
        <table className="table table-sm table-hover">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Balance</th>
                    <th>Working Capital</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map(
                        (transaction) => <Transaction transaction={transaction} />
                    )
                }
            </tbody>
        </table>
    </div>
}