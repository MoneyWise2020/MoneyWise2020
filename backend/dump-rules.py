import datetime
import json

from script.get_rules import get_rules_by_type

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.strftime("%Y-%m-%d")

if __name__ == "__main__":
    rules = get_rules_by_type()
    with open('rules.json', 'w') as phile:
        json.dump(rules, phile, indent=4, sort_keys=True, cls=DateTimeEncoder)
