from rest_framework.test import APITestCase
from rest_framework.test import RequestsClient

from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY

from .views import rules_handler, rules_by_id_handler

import os

if os.environ["DEBUG"] == "DEBUG":
    import ptvsd
    print("Waiting for debugger to attach...")
    ptvsd.enable_attach(address=('0.0.0.0', 3001))
    ptvsd.wait_for_attach()
    print('Attached!')

class RuleTestCase(APITestCase):
    def setUp(self):
        self.client = RequestsClient()

    def test_framework_works(self):
        self.assertEqual(1, 1)
    
    def test_list_api_needs_userid(self):
        response = self.client.get("http://testserver/api/rules")
        self.assertEqual(response.status_code, 400)
    
    def test_successful_manage_lifecycle_flow(self):
        response = self.client.post("http://testserver/api/rules", params={"userid": "testuser"}, json={
            "name": "Rent",
            "rrule": str(rrule(freq=MONTHLY, byweekday=1)),
            "value": -1000
        })
        self.assertEqual(response.status_code, 200)
