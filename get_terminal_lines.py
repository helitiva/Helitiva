import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

found_lines = {}

def parse_lines(content):
    pattern = re.compile(r"^\s*(\d+):\s?(.*)")
    for line in content.split("\n"):
        match = pattern.match(line)
        if match:
            line_num = int(match.group(1))
            line_val = match.group(2)
            if 500 <= line_num <= 620:
                found_lines[line_num] = line_val

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            if step.get("type") == "VIEW_FILE" and "content" in step:
                content = step["content"]
                if "index.js" in content:
                    parse_lines(content)
        except:
            pass

# Print sorted lines
print("--- STITCHED LINES 500 to 620 ---")
for l in sorted(found_lines.keys()):
    print(f"{l}: {found_lines[l]}")
