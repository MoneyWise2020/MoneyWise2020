from django.test import TestCase
from datetime import datetime
from .recur import *

class RecurTests(TestCase):

    def test_to_heb_year_month_day(self):
        date = datetime(2020, 5, 17)
        value = recur.to_heb_year_month_day(date)
        self.assertEqual(value, None)
