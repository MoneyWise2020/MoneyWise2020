import React from 'react';
import { Currency } from '../../../components/currency/Currency';
import { IApiTransaction } from './transactions-service';

export const Transaction = ({
    transaction
}: { transaction: IApiTransaction }) => {
    return <tr key={transaction.id} className={transaction.calculations.balance > 0 ? 'table-success' : 'table-danger'}>
        <td><span className="text-nowrap">{transaction.day}</span></td>
        <td>{transaction.rule_id}</td>
        <td><Currency value={transaction.value} /></td>
        <td><Currency value={transaction.calculations.balance} /></td>
        <td><Currency value={transaction.calculations.working_capital} /></td>
    </tr>
}