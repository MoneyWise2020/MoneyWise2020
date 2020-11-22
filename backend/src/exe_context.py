from datetime import date

class ExecutionParameters():
    def __init__(self,
        start: date,
        end: date,
        current: float,
        set_aside: float
    ):
        self.start: date = start
        self.end: date = end
        self.current: float = current
        self.set_aside: float = set_aside


class ExecutionRules():
    def __init__(self, rules_map):
        self.rules_map = rules_map


class ExecutionContext(object):
    def __init__(self, parameters: ExecutionParameters, rules: ExecutionRules):
        self.parameters: ExecutionParameters = parameters
        self.rules: ExecutionRules = rules
