import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        try:
            step = json.loads(line)
            if step.get("type") == "VIEW_FILE" and "content" in step:
                content = step["content"]
                lines_match = re.search(r"Showing lines (\d+) to (\d+)", content)
                start, end = 0, 0
                if lines_match:
                    start = int(lines_match.group(1))
                    end = int(lines_match.group(2))
                
                if "index.html" in content:
                    print(f"Step {step.get('step_index', line_num)} (Line {line_num}): VIEW_FILE index.html lines {start} to {end}")
                elif "index.css" in content:
                    print(f"Step {step.get('step_index', line_num)} (Line {line_num}): VIEW_FILE index.css lines {start} to {end}")
        except:
            pass
