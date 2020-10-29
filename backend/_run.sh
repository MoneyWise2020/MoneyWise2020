#!/bin/bash
d=$(date +%Y-%m-%d)
mkdir -p /workspace/logs
python /workspace/production.py | tee "/workspace/logs/${d}_production.log"
python /workspace/goal.py | tee "/workspace/logs/${d}_goal.log"
python /workspace/basic.py | tee "/workspace/logs/${d}_basic.log"
cp "/cashflow-data/CONTROL.xlsx" "/workspace/logs/${d}_CONTROL.xlsx"
cp "/tmp/OUTPUT.csv" "/workspace/logs/${d}_OUTPUT.csv"
head "/workspace/logs/${d}_OUTPUT.csv"