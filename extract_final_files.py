import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

html_lines = {}
css_lines = {}
js_lines = {}

def parse_lines(content, line_dict):
    pattern = re.compile(r"^\s*(\d+):\s?(.*)")
    for line in content.split("\n"):
        match = pattern.match(line)
        if match:
            line_num = int(match.group(1))
            line_val = match.group(2)
            line_dict[line_num] = line_val

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        # Index is 0-based, so step lines are:
        # Step 689 (Line 685): HTML view, JS lines 1-800 view
        # Step 691 (Line 687): JS lines 800-1300 view
        # Step 693 (Line 689): JS lines 1300-1400 view
        # Step 631 (Line 627): CSS view
        
        try:
            step = json.loads(line)
            content = step.get("content", "")
            
            if idx == 685: # Step 689
                # This contains index.html AND index.js (lines 1 to 800)
                # Let's inspect which one it is, or we parse both if present in tool calls
                print(f"Index 685: processing content of length {len(content)}")
                # We can differentiate them by searching for "File Path: " or checking content
                if "index.html" in content:
                    parse_lines(content, html_lines)
                if "index.js" in content:
                    parse_lines(content, js_lines)
                    
            elif idx == 687: # Step 691
                print(f"Index 687: processing JS lines 800 to 1300")
                parse_lines(content, js_lines)
                
            elif idx == 689: # Step 693
                print(f"Index 689: processing JS lines 1300 to 1400")
                parse_lines(content, js_lines)
                
            elif idx == 627: # Step 631
                print(f"Index 627: processing CSS")
                parse_lines(content, css_lines)
        except Exception as e:
            print(f"Error at index {idx}: {e}")

def save_file(line_dict, filename):
    if not line_dict:
        print(f"No content to save for {filename}")
        return
    max_line = max(line_dict.keys())
    print(f"Saving {filename} up to line {max_line}")
    with open(f"final_{filename}", "w", encoding="utf-8") as out:
        for i in range(1, max_line + 1):
            out.write(line_dict.get(i, "") + "\n")

save_file(html_lines, "index.html")
save_file(css_lines, "index.css")
save_file(js_lines, "index.js")
