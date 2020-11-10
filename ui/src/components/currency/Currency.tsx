import React from 'react';

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
});

function formatCurrency(value: number): string {
    return formatter.format(value);
}

export const Currency = ({ value }: { value: number }) => {
    const presentedValue = formatCurrency(value);

    if (value < 0) {
        return <span className="currency-negative">{presentedValue}</span>
    }
    return <span className="currency-positive">{presentedValue}</span>
}
