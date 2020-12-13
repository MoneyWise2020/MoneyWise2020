from typing import Set, List

from .recur import generate_event_transactions, Instance
from .aggregators import calculate_balance, calculate_working_capital, calculate_high_and_low
from .exe_context import ExecutionContext


def get_transactions_up_to(context: ExecutionContext) -> List[Instance]:
    """
    Returns all projected transactions, sorted by date, with aggregations calculated and set.
    """
    all_transactions = generate_event_transactions(context)

    calculate_balance(context, all_transactions)
    calculate_working_capital(context, all_transactions)

    if context.parameters.should_calculate_high_low:
        calculate_high_and_low(context, all_transactions)

    return all_transactions

