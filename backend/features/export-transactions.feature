# -- FILE: features/export-transactions.feature
Feature: Export

    Scenario: Download Transactions as CSV
     Given Javier has rules in the database
     When Javier tries to export his transactions to CSV
     Then Javier gets a CSV of transactions with headers for day, rule id, value, balance, and disposable income
