from collections import OrderedDict

from enum import Enum


def calculate_balance(context, instances):
    balance = context.parameters.current
    for i in instances:
        balance = i.value + balance
        i.set_calculation("balance", balance)


def calculate_working_capital(context, instances):
    expense_segments = []
    cur = []

    def add_es(es):
        if es:
            val = min((x.get_calculation("balance") for x in es))
            for c in es:
                c.set_calculation("working_capital", val - context.parameters.set_aside)
            expense_segments.append(es)

    for i in instances:
        cur.append(i)
        if i.value > 0:
            add_es(cur)
            cur = []
    add_es(cur) if cur else None

    if expense_segments:
        lowest = expense_segments[-1][0].get_calculation("working_capital")  # initial value
        for es in reversed(expense_segments):
            lowest = min(lowest, es[0].get_calculation("working_capital"))
            for e in es:
                e.set_calculation("working_capital", lowest)
