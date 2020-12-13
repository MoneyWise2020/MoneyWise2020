import React, { useState } from 'react';
import Chart from "react-google-charts";
import useAxios from 'axios-hooks'


const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

interface IDayByDayApi {
    daybydays: {
        date: string;
        balance: {
            open: number;
            low: number;
            high: number;
            close: number;
        };
        working_capital: {
            open: number;
            low: number;
            high: number;
            close: number;
        };
        high_prediction: {
            open: number;
            low: number;
            high: number;
            close: number;
        };
        low_prediction: {
            open: number;
            low: number;
            high: number;
            close: number;
        };
    }[]
}

const options = {
    title: "",
    curveType: "none",
    legend: { position: "top" },
    tooltip: {},
    hAxis: {
        minTextSpacing: 10,
        format: "short"
    },
    chartArea: {
        left: 60,
        width: '100%'
    },
    colors: ['#4374E0', '#488214', '#ffcc66', '#ff6666'],

};

const DayByDayChart = ({ daybyday, chartType }: { daybyday: IDayByDayApi, chartType: 'SteppedAreaChart' | 'CandlestickChart' }) => {
    if (!daybyday.daybydays.length) {
        return <>
            <p data-testid="daybyday-empty">Looks like there are no transactions in the time frame selected...</p>
        </>
    }

    if (chartType === 'SteppedAreaChart') {
        const data = [
            [
                'Day', 
                'Balance', 
                'Disposable Income',
            ],
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
            ['Day', 'Uncertainty Prediction', 'Low Prediction', 'Med High Prediction', 'Upper Limit Prediction'],
            ...daybyday.daybydays.map(candle => {
                return [
                    candle.date,
                    candle.low_prediction.low,
                    candle.high_prediction.low,
                    candle.low_prediction.high,
                    candle.high_prediction.high
                ]
            })
        ]
        return <Chart
            chartType="CandlestickChart"
            width="100%"
            height="400px"
            data={data}
            options={{
                bar: { groupWidth: '100%' }, // Remove space between bars.
                candlestick: {
                    risingColor: {
                        fill: '#FFFFFF'
                    },
                    fallingColor: {
                        fill: '#FFFFFF'
                    },
                }
            }}
        />
    }
    

    return null
}

export const DayByDayContainer = ({ userid, currentTime }: { userid: string, currentTime: number }) => {
    
    const [chartType, setChartType] = useState<'SteppedAreaChart' | 'CandlestickChart'>('SteppedAreaChart');
    const [queryRangeDays, setQueryRangeDays] = useState(90);

    const start = new Date(currentTime);
    const end = new Date(currentTime + (queryRangeDays * 24 * 60 * 60 * 1000))
    
    const [{ data, loading, error }] = useAxios(
        `${baseUrl}/api/daybydays?userid=${userid}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`
    )

    if (loading) {
        return <div style={{ minHeight: '100%', width: '100%' }} className="text-center">
            <h5 data-testid="daybyday-loading">Loading...</h5>
        </div>
    }

    if (error) {
        return <div style={{ minHeight: '100%', width: '100%' }} className="text-center">
            <h5 data-testid="daybyday-error">Error occurred while fetching the future! Try refreshing the page.</h5>
        </div>
    }

    const daybyday = data

    return <>
        <button className="btn btn-outline-primary btn-sm" onClick={() => setChartType(t => t === 'SteppedAreaChart' ? 'CandlestickChart' : 'SteppedAreaChart')}>Toggle Candlesticks</button>
        <DayByDayChart chartType={chartType} daybyday={daybyday} /> 
        <div className="text-center">
            <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryRangeDays(90)}}>3m</button>&nbsp;
            <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryRangeDays(365)}}>1y</button>&nbsp;
            <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryRangeDays(365 * 2)}}>2y</button>&nbsp;
            <button className="btn btn-outline-danger btn-sm" title="May not be as accurate, use with caution" onClick={() => {setQueryRangeDays(365 * 5)}}>5y</button>&nbsp;
            <button className="btn btn-outline-danger btn-sm" title="May not be as accurate, use with caution" onClick={() => {setQueryRangeDays(365 * 10)}}>10y</button>&nbsp;
            <button className="btn btn-outline-danger btn-sm" title="May not be as accurate, use with caution" onClick={() => {setQueryRangeDays(365 * 20)}}>20y</button>&nbsp;
            <button className="btn btn-outline-danger btn-sm" title="May not be as accurate, use with caution" onClick={() => {setQueryRangeDays(365 * 30)}}>30y</button>&nbsp;
            <br />
        </div>
    </>
}
