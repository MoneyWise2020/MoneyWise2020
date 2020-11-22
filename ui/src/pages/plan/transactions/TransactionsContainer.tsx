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
        return <p data-testid="transactions-loading">Loading...</p>
    }

    if (error) {
        return <p data-testid="transactions-error">Error occurred while fetching transactions! Try refreshing the page.</p>
    }
    
    const tableData = data.transactions as IApiTransaction[];

    if (tableData.length === 0) {
        return <p data-testid="transactions-empty">Sorry, it looks like you don't have any transactions. Try setting up a new rule.</p>
    }

    return <div data-testid="transactions-showing" className="table-responsive" style={{height:300}}>
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
                        (transaction) => <Transaction transaction={transaction} key={transaction.id} />
                    )
                }
            </tbody>
        </table>
    </div>
}