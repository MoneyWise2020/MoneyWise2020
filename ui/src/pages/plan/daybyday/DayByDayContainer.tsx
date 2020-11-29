import React, { useState } from 'react';
import Chart from "react-google-charts";
import useAxios from 'axios-hooks'


// TODO: get from login
const userid = 'test'
const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;
const now = new Date();
const start = now;
let showEnd = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // add 90 days
interface IDayByDayApi {
    daybydays: {
        date: string;
        balance: {
            low: number;
            high: number;
        };
        working_capital: {
            low: number;
            high: number;
        };
    }[]
}

const options = {
    title: "",
    curveType: "none",
    legend: { position: "top" },
    tooltip: {},
    hAxis: {
        title: "Time",
        minTextSpacing: 10,
        format: "short"
    },
    vAxis: {
        title: "Funds"
    }

};

const DayByDayChart = ({ daybyday, chartType }: { daybyday: IDayByDayApi, chartType: 'SteppedAreaChart' | 'CandlestickChart' }) => {
    if (!daybyday.daybydays.length) {
        return <>
            <p data-testid="daybyday-empty">Looks like there are no transactions in the time frame selected...</p>
        </>
    }

    if (chartType === 'SteppedAreaChart') {
        const data = [
            ['Day', 'Balance', 'Working Capital'],
            ...daybyday.daybydays.map(candle => [
                candle.date,
                Number(candle.balance.low),
                Number(candle.working_capital.low),
            ])
        ]
        return <Chart
          chartType="SteppedAreaChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
    }

    if (chartType === 'CandlestickChart') {
        const data = [
            ['Day', 'Balance', 'Balance base bottom', 'Balance base top', 'Balance high', 'Working Capital', 'Working Capital base bottom', 'Working Capital base top', 'Working Capital high'],
            ...daybyday.daybydays.map(candle => {
                const lowBalance = Number(candle.balance.low)
                const highBalance = Number(candle.balance.high)
                const lowWorkingCapital = Number(candle.working_capital.low)
                const highWorkingCapital = Number(candle.working_capital.high)
                // TODO: consider using wicks of candles? Has to do with previous candle height?
                return [
                    candle.date,
                    lowBalance,
                    lowBalance,
                    highBalance,
                    highBalance,
                    lowWorkingCapital,
                    lowWorkingCapital,
                    highWorkingCapital,
                    highWorkingCapital,
                ]
            })
        ]
        return <Chart
            chartType="CandlestickChart"
            width="100%"
            height="400px"
            data={data}
            options={options}
        />
    }

    return null
}

export const DayByDayContainer = ({ currentTime }: { currentTime: number }) => {
    
    const [chartType, setChartType] = useState<'SteppedAreaChart' | 'CandlestickChart'>('SteppedAreaChart');
    const [queryEnd, setQueryEnd] = useState(new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)));
    

    const [{ data, loading, error }] = useAxios(
        `${baseUrl}/api/daybydays?userid=${userid}&startDate=${start.toISOString()}&endDate=${queryEnd.toISOString()}`
    )

    if (loading) {
        return <p data-testid="daybyday-loading">Loading...</p>
    }

    if (error) {
        return <p data-testid="daybyday-error">Error occurred while fetching daybydays! Try refreshing the page.</p>
    }

    const daybyday = data

    return <>
        <button className="btn btn-outline-primary btn-sm" onClick={() => setChartType(t => t === 'SteppedAreaChart' ? 'CandlestickChart' : 'SteppedAreaChart')}>Toggle Candlesticks</button>
        <DayByDayChart chartType={chartType} daybyday={daybyday} />
        <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryEnd(new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)))}}>3 Months</button>&nbsp;
        <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryEnd(new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)))}}>1 Year</button>&nbsp;
        <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryEnd(new Date(now.getTime() + (730 * 24 * 60 * 60 * 1000)))}}>2 Years</button>&nbsp;
        <br />
    </>
}