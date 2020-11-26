import React, { useState } from 'react';
import Chart from "react-google-charts";

interface IDayByDayApi {
    daybydays: {
        date: string;
        balance: {
            low: string;
            high: string;
        };
        working_capital: {
            low: string;
            high: string;
        };
    }[]
}

const options = {
    title: "",
    curveType: "none",
    legend: { position: "top" }
};

const DayByDayChart = ({ daybyday, chartType }: { daybyday: IDayByDayApi, chartType: 'SteppedAreaChart' | 'CandlestickChart' }) => {
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

    const daybyday = {
        "daybydays": [
            {
                "date": "2020-11-24",
                "balance": {
                    "low": "-100.0",
                    "high": "400.0"
                },
                "working_capital": {
                    "low": "-100.0",
                    "high": "300.0"
                }
            },
            {
                "date": "2020-11-25",
                "balance": {
                    "low": "400.0",
                    "high": "400.0"
                },
                "working_capital": {
                    "low": "300.0",
                    "high": "300.0"
                }
            },
            {
                "date": "2020-11-26",
                "balance": {
                    "low": "400.0",
                    "high": "400.0"
                },
                "working_capital": {
                    "low": "300.0",
                    "high": "300.0"
                }
            },
            {
                "date": "2020-11-27",
                "balance": {
                    "low": "400.0",
                    "high": "400.0"
                },
                "working_capital": {
                    "low": "300.0",
                    "high": "300.0"
                }
            },
            {
                "date": "2020-11-28",
                "balance": {
                    "low": "400.0",
                    "high": "400.0"
                },
                "working_capital": {
                    "low": "300.0",
                    "high": "300.0"
                }
            },
            {
                "date": "2020-11-29",
                "balance": {
                    "low": "400.0",
                    "high": "400.0"
                },
                "working_capital": {
                    "low": "300.0",
                    "high": "300.0"
                }
            },
            {
                "date": "2020-11-30",
                "balance": {
                    "low": "400.0",
                    "high": "400.0"
                },
                "working_capital": {
                    "low": "300.0",
                    "high": "300.0"
                }
            },
            {
                "date": "2020-12-01",
                "balance": {
                    "low": "300.0",
                    "high": "800.0"
                },
                "working_capital": {
                    "low": "300.0",
                    "high": "800.0"
                }
            },
            {
                "date": "2020-12-02",
                "balance": {
                    "low": "800.0",
                    "high": "800.0"
                },
                "working_capital": {
                    "low": "800.0",
                    "high": "800.0"
                }
            },
            {
                "date": "2020-12-03",
                "balance": {
                    "low": "800.0",
                    "high": "800.0"
                },
                "working_capital": {
                    "low": "800.0",
                    "high": "800.0"
                }
            },
            {
                "date": "2020-12-04",
                "balance": {
                    "low": "800.0",
                    "high": "800.0"
                },
                "working_capital": {
                    "low": "800.0",
                    "high": "800.0"
                }
            },
            {
                "date": "2020-12-05",
                "balance": {
                    "low": "800.0",
                    "high": "800.0"
                },
                "working_capital": {
                    "low": "800.0",
                    "high": "800.0"
                }
            },
            {
                "date": "2020-12-06",
                "balance": {
                    "low": "800.0",
                    "high": "800.0"
                },
                "working_capital": {
                    "low": "800.0",
                    "high": "800.0"
                }
            },
            {
                "date": "2020-12-07",
                "balance": {
                    "low": "800.0",
                    "high": "800.0"
                },
                "working_capital": {
                    "low": "800.0",
                    "high": "800.0"
                }
            }
        ]
    }

    return <>
        <button onClick={() => setChartType(t => t === 'SteppedAreaChart' ? 'CandlestickChart' : 'SteppedAreaChart')}>Toggle Candlesticks</button>
        <DayByDayChart chartType={chartType} daybyday={daybyday} />
    </>
}