import React from 'react';
import { Currency } from '../../../components/currency/Currency';
import { IApiTransaction } from './ITransaction';

export const Transaction = ({
    transaction
}: { transaction: IApiTransaction }) => {
    return <tr>
        <td><span className="text-nowrap">{transaction.day}</span></td>
        <td>{transaction.rule_id}</td>
        <td><Currency value={transaction.value} /></td>
        <td><Currency value={transaction.calculations.balance} /></td>
        <td><Currency value={transaction.calculations.working_capital} /></td>
    </tr>
}