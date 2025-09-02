# cli.py
import os
import sys
from analyzer.analyzer import analyze_file, analyze_folder, generate_report, print_summary
from fpdf import FPDF  # Make sure fpdf is installed: pip install fpdf

# Ensure reports folder exists
REPORTS_DIR = os.path.join(os.getcwd(), "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

def export_pdf(report, output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Vulnerability Analysis Report", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", "", 12)
    meta = report.get("metadata", {})
    pdf.multi_cell(0, 8, f"Generated At: {meta.get('generated_at', '')}")
    pdf.multi_cell(0, 8, f"Total Vulnerabilities: {meta.get('total_vulnerabilities', 0)}")
    pdf.multi_cell(0, 8, f"Severity Breakdown: {meta.get('severity_breakdown', {})}")
    pdf.ln(5)

    for idx, finding in enumerate(report.get("findings", []), start=1):
        pdf.set_font("Arial", "B", 12)
        pdf.multi_cell(0, 8, f"{idx}. {finding.get('vulnerability')} ({finding.get('severity')}, Confidence: {finding.get('confidence')}%)")
        pdf.set_font("Arial", "", 12)
        pdf.multi_cell(0, 6, f"File: {finding.get('file')}:{finding.get('line')}")
        pdf.multi_cell(0, 6, f"Recommendation: {finding.get('recommendation')}")
        pdf.multi_cell(0, 6, f"Code Snippet:\n{finding.get('snippet')}\n")
        pdf.ln(2)

    pdf.output(output_path)
    print(f"[+] PDF report saved at: {output_path}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python cli.py <file_or_folder_path>")
        sys.exit(1)

    path = sys.argv[1]

    if os.path.isfile(path):
        results = analyze_file(path)
        base_name = os.path.basename(path).replace(".", "_")
    elif os.path.isdir(path):
        results = analyze_folder(path)
        base_name = os.path.basename(os.path.normpath(path))
    else:
        print(f"[!] Path not found: {path}")
        sys.exit(1)

    # Ask user for export type
    export_choice = input("Choose export format - PDF (p), JSON (j), Both (pj): ").lower()
    if export_choice not in ['p', 'j', 'pj']:
        print("[!] Invalid choice. Defaulting to JSON.")
        export_choice = 'j'

    report = generate_report(results)

    if 'j' in export_choice:
        json_path = os.path.join(REPORTS_DIR, f"{base_name}_report.json")
        generate_report(results, output_json=json_path)

    if 'p' in export_choice:
        pdf_path = os.path.join(REPORTS_DIR, f"{base_name}_report.pdf")
        export_pdf(report, pdf_path)

    # Print summary
    print_summary(report)

if __name__ == "__main__":
    main()
