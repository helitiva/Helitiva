import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

js_lines = {}
html_lines = {}
css_lines = {}

def parse_and_store(content, line_dict):
    # Match lines like "  123: content" or "123: content"
    pattern = re.compile(r"^\s*(\d+):\s?(.*)")
    for line in content.split("\n"):
        match = pattern.match(line)
        if match:
            line_num = int(match.group(1))
            line_val = match.group(2)
            line_dict[line_num] = line_val

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        try:
            step = json.loads(line)
            if step.get("type") == "VIEW_FILE" and "content" in step:
                content = step["content"]
                # We can check file path or name
                path = step.get("tool_calls", [{}])[0].get("args", {}).get("AbsolutePath", "")
                if not path:
                    # Check in content text itself
                    if "index.js" in content:
                        path = "index.js"
                    elif "index.html" in content:
                        path = "index.html"
                    elif "index.css" in content:
                        path = "index.css"
                
                if "index.js" in path:
                    parse_and_store(content, js_lines)
                elif "index.html" in path:
                    parse_and_store(content, html_lines)
                elif "index.css" in path:
                    parse_and_store(content, css_lines)
        except Exception as e:
            pass

# Output stitched files
def write_stitched(line_dict, filename):
    if not line_dict:
        print(f"No lines found for {filename}")
        return
    max_line = max(line_dict.keys())
    print(f"Stitching {filename}: total lines {len(line_dict)}, max line {max_line}")
    with open(f"stitched_{filename}", "w", encoding="utf-8") as out:
        for i in range(1, max_line + 1):
            out.write(line_dict.get(i, "") + "\n")

write_stitched(js_lines, "index.js")
write_stitched(html_lines, "index.html")
write_stitched(css_lines, "index.css")
