from collections import OrderedDict

from enum import Enum


def calculate_balance(context, instances):
    balance = context.parameters.current
    for i in instances:
        balance = i.value + balance
        i.set_calculation("balance", balance)


def calculate_working_capital(context, instances):
    """
    """

    # STEP 1
    # group all transactions into runs of expenses
    # and calculate the lowest balance in each run

    # expense_segments is an array of arrays of transactions
    # where each array starts with an income transaction
    # and the rest are expenses.
    expense_segments = []

    def add_es(es):
        if es:
            val = min((x.get_calculation("balance") for x in es))
            for c in es:
                c.set_calculation("working_capital", val - context.parameters.set_aside)
            expense_segments.append(es)

    # this is a temp variable for building an expense_segment
    current_expense_segment = []
    for i in instances:
        if i.value > 0:
            add_es(current_expense_segment)
            current_expense_segment = []
        current_expense_segment.append(i)
    add_es(current_expense_segment) if current_expense_segment else None

    # STEP 2
    # make sure the working_capital of transactions inside each expense segment
    # is always increasing over time
    # (a.k.a. decreasing as you go backwards)
    if expense_segments:
        lowest = expense_segments[-1][0].get_calculation("working_capital")  # initial value
        for es in reversed(expense_segments):
            lowest = min(lowest, es[0].get_calculation("working_capital"))
            for e in es:
                e.set_calculation("working_capital", lowest)
