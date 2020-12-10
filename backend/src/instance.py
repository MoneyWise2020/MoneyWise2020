from datetime import date

class Instance():
    def __init__(self, rule_id, instance_id, value, day, labels={}):
        self.rule_id = rule_id
        self.id = instance_id
        self.value = value
        self.day: date = day
        self.labels = labels
        self.calculations = {}
    
    def set_calculation(self, key: str, value):
        self.calculations[key] = value
    
    def get_calculation(self, key: str):
        return self.calculations[key]
    
    def serialize(self) -> dict:
        return {
            "rule_id": self.rule_id,
            "id": self.id,
            "value": self.value,
            "day": self.day,
            "labels": self.labels,
            "calculations": self.calculations
        }
