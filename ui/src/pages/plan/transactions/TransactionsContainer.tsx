import React, { useEffect, useState } from 'react';
import { IApiTransaction, TransactionsService } from './transactions-service';
import { Transaction } from './Transaction'

// TODO: get from login
const userid = 'test'

export const TransactionsContainer = () => {
    const [data, setData] = useState<IApiTransaction[] | 'error'>();
    useEffect(() => {
        TransactionsService.getTransactions(userid)
            .then(setData)
            .catch(e => {
                console.error('Transaction API error', e);
                setData('error');
            });
    }, []);
    const tableData = Array.isArray(data) ? data : [];
    
    if (!data) {
        return <p>Loading...</p>
    }

    if ('error' === data) {
        return <p>Error occurred while fetching transactions! Try refreshing the page.</p>
    }

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