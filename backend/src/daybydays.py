from typing import List
from datetime import timedelta

from .instance import Instance
from .generate_instances import get_transactions_up_to


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
    first_transaction.set_calculation("working_capital", transactions[0].get_calculation("working_capital"))
    transactions.insert(0, first_transaction)

    current_balance = transactions[0].get_calculation('balance')
    current_working_capital = transactions[0].get_calculation('working_capital')

    end = context.parameters.end
    transactions_len = len(transactions)
    while current_day <= end:
        # Get all transactions for this day
        todays_transactions = []
        while i < transactions_len and transactions[i].day == current_day:
            todays_transactions.append(transactions[i])
            i += 1

        balances = list(map(lambda x: x.get_calculation("balance"), todays_transactions))
        balances.insert(0, current_balance)
        balance_low = min(balances)
        balance_high = max(balances)
        current_balance = balances[-1]

        working_capitals = list(map(lambda x: x.get_calculation("working_capital"), todays_transactions))
        working_capitals.insert(0, current_working_capital)
        working_capital_low = min(working_capitals)
        working_capital_high = max(working_capitals)
        current_working_capital = working_capitals[-1]

        daybydays.append({
            'date': current_day,
            'balance': {
                'low': round(balance_low, 2),
                'high': round(balance_high, 2)
            },
            'working_capital': {
                'low': round(working_capital_low, 2),
                'high': round(working_capital_high, 2)
            },
        })
        current_day += timedelta(days=1)

    return daybydays
