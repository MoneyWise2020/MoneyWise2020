from typing import List

from .instance import Instance
from .generate_instances import get_transactions_up_to
from .recur import get_dates


def generate_daybydays(context) -> List[Instance]:
    """
    Returns all projected daybydays, sorted by date, with aggregations calculated and set.
    """
    daybydays = []

    transactions = get_transactions_up_to(context)
    transactionCount = len(transactions)

    rule = {
        'rule': 'FREQ=DAILY;INTERVAL=1'
    }
    dates = get_dates(rule, context.parameters)
    dateCount = len(dates)
    if (dateCount == 0):
        return daybydays    

    balEnd = context.parameters.current
    balLow = balEnd
    balHigh = balEnd

    wcEnd = context.parameters.current
    wcLow = wcEnd
    wcHigh = wcEnd

    i = 0
    j = 0

    while (i < dateCount):    

        if (j < transactionCount and dates[i] == transactions[j].day):

            wcLow = transactions[j].calculations["working_capital"]
            wcHigh = transactions[j].calculations["working_capital"]

            while (j < transactionCount and dates[i] == transactions[j].day):

                balEnd += transactions[j].value
                if (balEnd > balHigh):
                    balHigh = balEnd
                elif (balEnd < balLow):
                    balLow = balEnd

                wcEnd = transactions[j].calculations["working_capital"]
                if (wcEnd > wcHigh):
                    wcHigh = wcEnd
                elif (wcEnd < wcLow):
                    wcLow = wcEnd                

                j += 1

        daybyday = {
            'date': dates[i],
            'balance': 
                {'low': balLow, 'high': balHigh},                
            'working_capital':
                {'low': wcLow, 'high': wcHigh},                
        }

        balLow = balEnd
        balHigh = balEnd
        wcLow = wcEnd
        wcHigh = wcEnd           

        daybydays.append(daybyday)
        i += 1

    return daybydays