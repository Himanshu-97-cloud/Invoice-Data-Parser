from backend.text_extractor import extract_text
from ollama import chat
import json


file_path = r"D:\HIMANSHU\Desktop\RD\Project-8 Invoice Data Parser\backend\data\batch1_1\batch1-0001.jpg"

text = extract_text(file_path)


def parse_json(text):

    prompt = f"""
    You are an invoice data extraction assistant.

    The following text may contain ONE or MULTIPLE invoices.

    Identify each separate invoice and extract its information.

    Return ONLY valid JSON in exactly this structure:

    {{
        "invoices": [
            {{
                "invoice": {{
                    "invoice_number": "",
                    "date": "",
                    "seller": "",
                    "seller_address": "",
                    "seller_tax_id": "",
                    "client": "",
                    "client_address": "",
                    "client_tax_id": "",
                    "net_total": 0,
                    "vat": 0,
                    "gross_total": 0
                }},
                "items": [
                    {{
                        "description": "",
                        "quantity": 0,
                        "unit": "",
                        "net_price": 0,
                        "net_worth": 0,
                        "vat_percent": 0,
                        "gross_worth": 0
                    }}
                ]
            }}
        ]
    }}

    Rules:
    - If there is only one invoice, return one object inside "invoices".
    - If there are multiple invoices, return one object for each invoice.
    - Keep items belonging to their correct invoice.
    - If a value is missing, use null.
    - Do not add any extra text outside the JSON.

    Invoice text:
    {text}
    """

    response = chat(
        model="qwen2.5:7b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    result = response.message.content
    result = result.replace("```json", "").replace("```", "").strip()
    return json.loads(result)


# answer = parse_json(text)
# print(json.dumps(answer, indent=4))