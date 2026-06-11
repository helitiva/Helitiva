import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

original_js = {}
original_html = {}
original_css = {}

def parse_and_store(content, line_dict):
    pattern = re.compile(r"^\s*(\d+):\s?(.*)")
    for line in content.split("\n"):
        match = pattern.match(line)
        if match:
            line_num = int(match.group(1))
            line_val = match.group(2)
            line_dict[line_num] = line_val

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            if step.get("type") == "VIEW_FILE" and "content" in step:
                content = step["content"]
                # Search for File Path: `file:///Users/huy/Desktop/Projects/Web2/Helitiva%20landing/index.js`
                filepath_match = re.search(r"File Path: `file://(.*?)`", content)
                if filepath_match:
                    path = filepath_match.group(1)
                    # Exclude stitched, restore, scratch, python scripts, plan, all_snippets
                    if not any(x in path for x in ["stitched", "restore", "scratch", "all_snippets", ".py", ".md"]):
                        if "index.js" in path:
                            parse_and_store(content, original_js)
                        elif "index.html" in path:
                            parse_and_store(content, original_html)
                        elif "index.css" in path:
                            parse_and_store(content, original_css)
        except Exception as e:
            pass

def save_clean(line_dict, filename):
    if not line_dict:
        print(f"No content to save for {filename}")
        return
    max_line = max(line_dict.keys())
    print(f"Stitched {filename}: total lines {len(line_dict)}, max line {max_line}")
    with open(f"clean_{filename}", "w", encoding="utf-8") as out:
        for i in range(1, max_line + 1):
            out.write(line_dict.get(i, "") + "\n")

save_clean(original_js, "index.js")
save_clean(original_html, "index.html")
save_clean(original_css, "index.css")
