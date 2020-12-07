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

#
# High and Low
#

def get_branches(transaction):
    if transaction.rule_id == "Paycheck":
        return [
            (.25, transaction.value - 300),
            (.5, transaction.value),
            (.25, transaction.value + 100),
        ]

    # TODO: trim branches if not used
    return [(1, transaction.value)]
    


def calculate_high_and_low(context, transactions):
    """
    Computes the 10th and 90th percentile balances based on optional high and low values
    for each transaction
    """
    # TODO: shop for a better datastructure
    # that supports hash-like speed and consistency
    # plus fast sorting

    states = {}
    states[str(int(context.parameters.current))] = 1
    # maps balance (rounded to nearest int, to improve collision likelihood) to probability

    for t in transactions:

        new_states = {}
        # for each possible state,
        for state_hash, state_probability in states.items():
            state_value = int(state_hash)
            # branching
            branches = get_branches(t)

            for prob, value in branches:
                branch_state_hash = str(int(state_value + value))
                branch_state_probability = state_probability * prob

                # if multiple branches end at the same state,
                # can accumulate together
                destination_total_probability = new_states.get(branch_state_hash, 0) + branch_state_probability
                new_states[branch_state_hash] = destination_total_probability		

        is_over_10 = False

        cumulative_probability = 0
        for state, probability in sorted(new_states.items(), key=lambda t: int(t[0])):
            cumulative_probability += probability

            if cumulative_probability > .1:

                if not is_over_10:
                    is_over_10 = True
                    t.set_calculation("low_prediction", float(state))

            if cumulative_probability > .9:
                t.set_calculation("high_prediction", float(state))
                break
        


        states = new_states
