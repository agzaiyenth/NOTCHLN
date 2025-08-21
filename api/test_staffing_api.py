import requests
import csv
import os

API_URL = "http://localhost:5000/predict_staffing"
TEST_FILE = os.path.join(os.path.dirname(__file__), "datasets/task2_test_inputs.csv")

results = []
with open(TEST_FILE, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        payload = {
            "date": row["date"],
            "section_id": row["section_id"]
        }
        try:
            resp = requests.post(API_URL, json=payload, timeout=5)
            data = resp.json()
            results.append({"row_id": row["row_id"], **payload, **data})
        except Exception as e:
            results.append({"row_id": row["row_id"], **payload, "error": str(e)})

# Print first 5 results
for r in results[:5]:
    print(r)
print(f"Total tested: {len(results)}")
