from typing import Set, List

from src.transactions.recur import generate_event_instances, Instance
from src.transactions.aggregators import calculate_balance, calculate_working_capital
from src.transactions.context import ExecutionContext


def get_instances_up_to(context: ExecutionContext) -> List[Instance]:
    """
    Returns all projected transactions, sorted by date, with aggregations calculated and set.
    """
    all_instances = generate_event_instances(context)

    calculate_balance(context, all_instances)
    calculate_working_capital(context, all_instances)

    return all_instances
