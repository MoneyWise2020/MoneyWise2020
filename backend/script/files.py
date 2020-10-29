from datetime import date as dt

import pandas

from script.control import CONTROL
from src.instance import Instance


def flatten_instance(i: Instance) -> dict:
    serialized = i.serialize()
    calculations = serialized["calculations"]
    del serialized["calculations"]
    return {
        **serialized,
        **calculations
    }

def output_to_csv(all_instances):
    serialized_instances = list(map(flatten_instance, all_instances))
    output_columns = list(serialized_instances[0].keys())

    pandas.DataFrame(serialized_instances).to_csv(
        "/tmp/OUTPUT.csv",
        columns=list(output_columns),
        index=False
    )
