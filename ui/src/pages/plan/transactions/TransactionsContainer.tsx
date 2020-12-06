import React from 'react';
import { IApiTransaction} from './ITransaction';
import { Transaction } from './Transaction'
import useAxios from 'axios-hooks'

// TODO: get from login
const userid = 'test'
const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

export function limitShownTransactions(transactions: IApiTransaction[], showEnd: Date): IApiTransaction[] {
    return transactions
        .filter(t => {
            const d = new Date(t.day)
            return d <= showEnd;
        })
        .slice(0, 100);
}

export const TransactionsContainer = ({ currentTime }: { currentTime: number }) => {
    const now = new Date(currentTime)
    const start = now;
    const queryEnd = new Date(now.getTime() + (120 * 24 * 60 * 60 * 1000)); // add 120 days
    const showEnd = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // add 90 days

    const downloadQueryEnd = new Date(now.getTime() + (400 * 24 * 60 * 60 * 1000)); // add 400 days (13 months plus some buffer)

    const [{ data, loading, error }] = useAxios(
        `${baseUrl}/api/transactions?userid=${userid}&startDate=${start.toISOString()}&endDate=${queryEnd.toISOString()}`
    )
    
    if (loading) {
        return <p data-testid="transactions-loading">Loading...</p>
    }

    if (error) {
        return <p data-testid="transactions-error">Error occurred while fetching transactions! Try refreshing the page.</p>
    }
    
    const tableData = limitShownTransactions(data.transactions as IApiTransaction[], showEnd);

    if (tableData.length === 0) {
        return <p data-testid="transactions-empty">Sorry, it looks like you don't have any transactions. Try setting up a new rule.</p>
    }

    return <div data-testid="transactions-showing" className="table-responsive" style={{height:300}}>
        <a href={`${baseUrl}/api/export_transactions?userid=${userid}&startDate=${start.toISOString()}&endDate=${downloadQueryEnd.toISOString()}`}>Download</a>
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