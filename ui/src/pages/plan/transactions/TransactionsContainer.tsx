import React, { useEffect, useState } from 'react';
import { IApiTransaction, TransactionsService } from './transactions-service';

// TODO: get from login
const userid = 'test'

export const TransactionsContainer = () => {
    const [data, setData] = useState<IApiTransaction[]>();
    useEffect(() => {
        TransactionsService.getTransactions(userid)
            .then(setData);
    }, []);
    return <code>{JSON.stringify(data, null, 2)}</code>
}