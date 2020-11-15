from django.test import TestCase
from datetime import datetime
from src.recur import *

class RecurTests(TestCase):

    def test_to_heb_year_month_day(self):
        date = datetime(2020, 5, 17)
        expected = (5780, 2, 23)
        self.assertEqual((5780, 2, 23), to_heb_year_month_day(date))

