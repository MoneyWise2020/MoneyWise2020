from dateutil.relativedelta import relativedelta

from src.context import ExecutionContext, ExecutionParameters, ExecutionRules
from script.control import CONTROL

from script.get_rules import get_rules_by_type


def build_context(end=None):
    start = CONTROL["NOW"].to_pydatetime().date()
    if end is None:
        end = start + relativedelta(
            months=int(CONTROL["GENERATE_MONTHS"])
        )
    current = CONTROL["CURRENT"]
    set_aside = CONTROL["SET_ASIDE"]
    biweekly_start = CONTROL["BIWEEKLY_START"].to_pydatetime().date()

    parameters = ExecutionParameters(
        start,
        end,
        current,
        set_aside,
        biweekly_start
    )

    rules_by_type = get_rules_by_type()
    rules = ExecutionRules(rules_by_type)

    return ExecutionContext(parameters, rules)
