import React from 'react';
import { IApiTransaction} from './ITransaction';
import { Transaction } from './Transaction'
import useAxios from 'axios-hooks'


const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

export function limitShownTransactions(transactions: IApiTransaction[], showEnd: Date): IApiTransaction[] {
    return transactions
        .filter(t => {
            const d = new Date(t.day)
            return d <= showEnd;
        })
        .slice(0, 50);
}

export const TransactionsContainer = ({ userid, currentTime }: { userid: string, currentTime: number }) => {
    const now = new Date(currentTime)
    const start = now;
    const queryEnd = new Date(now.getTime() + (120 * 24 * 60 * 60 * 1000)); // add 120 days
    const showEnd = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // add 90 days

    const downloadQueryEnd = new Date(now.getTime() + (400 * 24 * 60 * 60 * 1000)); // add 400 days (13 months plus some buffer)

    const [{ data, loading, error }] = useAxios(
        `${baseUrl}/api/transactions?userid=${userid}&startDate=${start.toISOString()}&endDate=${queryEnd.toISOString()}`
    )
    
    if (loading) {
        return <div className="spinner-border" role="status">
            <span data-testid="transactions-loading" className="visually-hidden"></span>
        </div>
    }

    if (error) {
        return <p data-testid="transactions-error">Error occurred while fetching transactions! Try refreshing the page.</p>
    }
    
    const tableData = limitShownTransactions(data.transactions as IApiTransaction[], showEnd);

    if (tableData.length === 0) {
        return <p data-testid="transactions-empty">Sorry, it looks like you don't have any transactions. Try setting up a new rule.</p>
    }


    return <div data-testid="transactions-showing" className="table-responsive">
        <div className="text-right mb-1"><a href={`${baseUrl}/api/export_transactions?userid=${userid}&startDate=${start.toISOString()}&endDate=${downloadQueryEnd.toISOString()}`}>Download CSV</a></div>
        <table className="table table-sm table-hover">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Balance</th>
                    <th>Disposable Income</th>
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