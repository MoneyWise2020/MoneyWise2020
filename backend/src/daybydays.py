from typing import List
from datetime import timedelta

from .instance import Instance
from .generate_instances import get_transactions_up_to


def _create_candle(values):
    opening = values[0]
    low = min(values)
    high = max(values)
    close = values[-1]
    return {
        'open': round(opening, 2),
        'low': round(low, 2),
        'high': round(high, 2),
        'close': round(close, 2),
    }

def generate_daybydays(context) -> List[Instance]:
    """
    Returns all projected daybydays, sorted by date, with aggregations calculated and set.
    """
    daybydays = []

    transactions = get_transactions_up_to(context)
    if len(transactions) == 0:
        return []

    current_day = context.parameters.start
    i = 0  # for traversing transactions

    # So our initial balance and working_capital calculations are accurate,
    # inserting a dummy first transaction on the start day
    first_transaction = Instance('fake-starting-transaction', 'starting-transaction-1', 0, context.parameters.start)
    first_transaction.set_calculation("balance", context.parameters.current)
    first_transaction.set_calculation("low_prediction", context.parameters.current) # starts at current
    first_transaction.set_calculation("high_prediction", context.parameters.current) # starts at current

    # initial_working_capital is before the first transaction
    # it will be the working_capital of the first transaction or the current value, whichever is lower.
    # (current will be used in case of first transaction triggering working_capital growth,
    # so users don't assume they have money that they'll get when their first transaction comes in)
    initial_working_capital = min(transactions[0].get_calculation("working_capital"), context.parameters.current)
    first_transaction.set_calculation("working_capital", initial_working_capital)

    transactions.insert(0, first_transaction)

    # Tracking state
    current_balance = transactions[0].get_calculation('balance')
    current_working_capital = transactions[0].get_calculation('working_capital')
    current_low_prediction = transactions[0].get_calculation('low_prediction')
    current_high_prediction = transactions[0].get_calculation('high_prediction')

    end = context.parameters.end
    transactions_len = len(transactions)
    while current_day <= end:
        # Get all transactions for this day
        todays_transactions = []
        while i < transactions_len and transactions[i].day == current_day:
            todays_transactions.append(transactions[i])
            i += 1
        
        # number of transactions which occurred today
        volume = len(todays_transactions)
        if current_day == context.parameters.start:
            # we add a dummy transaction on day 1, should not count toward volume
            volume -= 1
        
        todays_candle = {
            'date': current_day,
            'volume': volume,
        }

        # Balance
        balances = list(map(lambda x: x.get_calculation("balance"), todays_transactions))
        balances.insert(0, current_balance)

        todays_candle["balance"] = _create_candle(balances)
        current_balance = todays_candle["balance"]["close"]

        # Working capital
        working_capitals = list(map(lambda x: x.get_calculation("working_capital"), todays_transactions))
        working_capitals.insert(0, current_working_capital)

        todays_candle["working_capital"] = _create_candle(working_capitals)
        current_working_capital = todays_candle["working_capital"]["close"]

        if context.parameters.should_calculate_high_low:
            # Low prediction
            low_predictions = list(map(lambda x: x.get_calculation("low_prediction"), todays_transactions))
            low_predictions.insert(0, current_low_prediction)

            todays_candle["low_prediction"] = _create_candle(low_predictions)
            current_low_prediction = todays_candle["low_prediction"]["close"]

            # High prediction
            high_predictions = list(map(lambda x: x.get_calculation("high_prediction"), todays_transactions))
            high_predictions.insert(0, current_high_prediction)

            todays_candle["high_prediction"] = _create_candle(high_predictions)
            current_high_prediction = todays_candle["high_prediction"]["close"]

        daybydays.append(todays_candle)
        current_day += timedelta(days=1)

    return daybydays
