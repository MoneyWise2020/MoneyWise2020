import React from 'react';

export const Currency = ({ value }: { value: number }) => {
    if (value < 0) {
        return <span className="currency-negative">-${value*-1}</span>
    }
    return <span className="currency-positive">${value}</span>
}
