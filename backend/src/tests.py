from rest_framework.test import APITestCase
from rest_framework.test import RequestsClient

from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY

from .views import rules_handler, rules_by_id_handler

import os

if os.environ.get("DEBUG", ""):
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
    
    def test_can_get_after_create(self):
        body = {
            "name": "Rent",
            "rrule": str(rrule(freq=MONTHLY, byweekday=1)),
            "value": -1000
        }
        response = self.client.post("http://testserver/api/rules", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 201)

        rule_id = response.json()['id']

        response = self.client.get(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"})
        self.assertEqual(response.status_code, 200)

        res_json = response.json()
        self.assertEqual(res_json["name"], body["name"])
        self.assertEqual(res_json["rrule"], body["rrule"])
        self.assertEqual(res_json["value"], body["value"])

        self.assertEqual(res_json["id"], rule_id)
        self.assertEqual(res_json["userid"], "testuser")

        # Is rule_id in list of rules?
        response = self.client.get("http://testserver/api/rules", params={"userid": "testuser"})
        res_json = response.json()
        rule_ids = list(map(lambda r: r["id"], res_json["data"]))
        self.assertEqual(response.status_code, 200)
        self.assertIn(rule_id, rule_ids)

    def test_delete(self):
        body = {
            "name": "Rent",
            "rrule": str(rrule(freq=MONTHLY, byweekday=1)),
            "value": -1000
        }
        response = self.client.post("http://testserver/api/rules", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 201)

        rule_id = response.json()['id']

        # Ensure it's there
        response = self.client.get(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"})
        self.assertEqual(response.status_code, 200)

        # Remove it
        response = self.client.delete(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"})
        self.assertEqual(response.status_code, 204)

        # Ensure it is removed
        response = self.client.get(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"})
        self.assertEqual(response.status_code, 404)

        # Assert non-existing rules give 404 when delete attempted
        response = self.client.delete(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"})
        self.assertEqual(response.status_code, 404)
    
    def test_update(self):
        body = {
            "name": "Rent",
            "rrule": str(rrule(freq=MONTHLY, byweekday=1)),
            "value": -1000
        }
        response = self.client.post("http://testserver/api/rules", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 201)

        rule_id = response.json()['id']

        # Update the value
        body = {
            "name": "Rent",
            "rrule": str(rrule(freq=MONTHLY, byweekday=1)),
            "value": -1200
        }
        response = self.client.put(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 200)

        # Ensure change is saved
        response = self.client.get(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"})
        self.assertEqual(response.status_code, 200)

        res_json = response.json()
        self.assertEqual(res_json["name"], body["name"])
        self.assertEqual(res_json["rrule"], body["rrule"])
        self.assertEqual(res_json["value"], body["value"])

        self.assertEqual(res_json["userid"], "testuser")

        self.assertIn("id", res_json)
    
    def test_no_partial_update(self):
        body = {
            "name": "Rent",
            "rrule": str(rrule(freq=MONTHLY, byweekday=1)),
            "value": -1000
        }
        response = self.client.post("http://testserver/api/rules", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 201)

        rule_id = response.json()['id']

        body = {
            "name": "Rent"
        }
        response = self.client.put(f"http://testserver/api/rules/{rule_id}", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 400)

    def test_400_when_ridiculously_large_value_is_used(self):
        body = {
            "name": "Paycheck",
            "rrule": str(rrule(freq=WEEKLY, byweekday=1)),
            "value": 99999999999999999999999999999999999
        }
        response = self.client.post("http://testserver/api/rules", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 400)

    def test_rrule_validation_failure(self):
        body = {
            "name": "Paycheck",
            "rrule": 'invalid rrule',
            "value": 2000
        }
        response = self.client.post("http://testserver/api/rules", params={"userid": "testuser"}, json=body)
        self.assertEqual(response.status_code, 400)

    # Example tests
    def test_another_test(self):
        assert True

    def test_again(self):
        assert True