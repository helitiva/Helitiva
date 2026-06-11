import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        try:
            step = json.loads(line)
            if step.get("type") == "VIEW_FILE" and "content" in step:
                content = step["content"]
                if "index.js" in content:
                    lines_match = re.search(r"Showing lines (\d+) to (\d+)", content)
                    if lines_match:
                        start = int(lines_match.group(1))
                        end = int(lines_match.group(2))
                        print(f"Step {step.get('step_index', line_num)} (Line {line_num} in log): VIEW_FILE index.js lines {start} to {end}")
        except:
            pass
