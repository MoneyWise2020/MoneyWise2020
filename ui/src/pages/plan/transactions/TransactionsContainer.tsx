import React, { useEffect, useMemo, useState } from 'react';
import { IApiTransaction, TransactionsService } from './transactions-service';
// import InfiniteScroll from "react-infinite-scroll-component";
import { Currency } from '../../../components/currency/Currency';

// TODO: get from login
const userid = 'test'

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

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

    const [number, setNumber] = useState<number>(20);
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
                        (transaction) => <tr key={transaction.id} className={transaction.calculations.balance > 0 ? 'table-success' : 'table-danger'}>
                            <td><span className="text-nowrap">{transaction.day}</span></td>
                            <td>{transaction.rule_id}</td>
                            <td><Currency value={transaction.value} /></td>
                            <td><Currency value={transaction.calculations.balance} /></td>
                            <td><Currency value={transaction.calculations.working_capital} /></td>
                        </tr>
                    )
                }
            </tbody>
        {/* <InfiniteScroll
            dataLength={tableData.length}
            next={() => {
                console.log('next called')
                setNumber(n => n + 20)
            }}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
            endMessage={
            <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
            </p>
            }
        >
            {
                tableData.slice(0, number).map(
                    (i, index) => <div style={style} key={index}>
                        div - #{index}
                    </div>
                )
            }
        </InfiniteScroll> */}
        </table>
    </div>
}