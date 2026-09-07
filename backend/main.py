from backend.text_extractor import extract_text
from backend.llm_parser import parse_json
from backend.excel_handler import save_to_excel


def process_invoice(file_path, output_file="invoices.xlsx"):

    text = extract_text(file_path)

    data = parse_json(text)

    save_to_excel(data, output_file)

    return output_file



# file_path = r"D:\HIMANSHU\Desktop\RD\Project-8 Invoice Data Parser\backend\data\batch1_1\batch1-0001.jpg"

# output = process_invoice(file_path)

# print("Invoice processed successfully!")
# print("Excel saved at:", output)