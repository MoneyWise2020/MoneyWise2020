import React, { useState } from 'react';
import Chart from "react-google-charts";
import useAxios from 'axios-hooks'
import Container from 'react-bootstrap/Container';


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
};

const black = '#4374E0'
const green = '#488214';
const red = '#dc3545';

enum ChartTab {
    DISPOSABLE_INCOME = "Disposable Income",
    UNCERTAINTY = "Uncertainty",
}

const DayByDayChart = ({ daybyday, chartType }: { daybyday: IDayByDayApi, chartType: ChartTab }) => {
    if (!daybyday.daybydays.length) {
        return <Container className="text-center">
            <p data-testid="daybyday-empty">Nothing's here...</p>
        </Container>
    }

    switch(chartType) {
        case ChartTab.DISPOSABLE_INCOME:
            const disposableIncomeData = [
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
                data={disposableIncomeData}
                options={{
                    ...options,
                    colors: [black, green],
                }}
            />
            break;
        case ChartTab.UNCERTAINTY:
            const uncertaintyData = [
                ['Day', '90th Percentile', 'Expected', '10th Percentile'],
                ...daybyday.daybydays.map(candle => [
                    candle.date,
                    candle.high_prediction.low,
                    candle.balance.low,
                    candle.low_prediction.low,
                ])
            ];
            
            return <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={uncertaintyData}
                options={{
                    ...options,
                    colors: [green, black, red],
                }}
            />
            break;
    }
}

function isHighLowEnabled(userid: string): boolean {
    return [
        'google-oauth2|113612696937596388912', // james.patrick.fulford@gmail.com
    ].includes(userid);
}

export const DayByDayContainer = ({ userid, currentTime }: { userid: string, currentTime: number }) => {
    const highLowEnabled = isHighLowEnabled(userid);
    const [chartType, setChartType] = useState<ChartTab>(ChartTab.DISPOSABLE_INCOME);
    const [queryRangeDays, setQueryRangeDays] = useState(90);

    const start = new Date(currentTime);
    const end = new Date(currentTime + (queryRangeDays * 24 * 60 * 60 * 1000))
    
    const [{ data, loading, error }] = useAxios(
        `${baseUrl}/api/daybydays?${highLowEnabled ? 'highLow&' : ''}userid=${userid}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`
    );

    if (loading) {
        return <div style={{ minHeight: '100%', width: '100%' }} className="text-center">
            <div className="spinner-border" role="status">
                <span data-testid="daybyday-loading" className="visually-hidden"></span>
            </div>
        </div>
    }

    if (error) {
        return <div style={{ minHeight: '100%', width: '100%' }} className="text-center">
            <h5 data-testid="daybyday-error">Error occurred while fetching the future! Try refreshing the page.</h5>
        </div>
    }

    const daybyday = data

    return <>
        <ul className="nav nav-tabs">
            {[
                ChartTab.DISPOSABLE_INCOME,
                ChartTab.UNCERTAINTY,
            ].map(chart => <li className="nav-item" key={chart}>
                <a
                    className={"nav-link " + (chart === chartType ? 'active' : '')}
                    onClick={() => setChartType(chart as any)}
                >
                    {chart}
                </a>
            </li>)}
        </ul>
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
