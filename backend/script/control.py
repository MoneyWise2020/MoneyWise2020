import os

import pandas

# Read in Configuration (useful global values)

#
# Initial conditions sheet
#
CONTROL = dict(map(lambda x: (x["KEY"], x["VALUE"]), pandas.read_excel(
    "/cashflow-data/CONTROL.xlsx",
    sheet_name="INITIAL_CONDITIONS"
).to_dict("records")))
