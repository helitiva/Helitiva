import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

target_steps = [102, 104, 118, 120, 136, 138, 158, 221, 262, 631]

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx in target_steps and step.get("type") == "VIEW_FILE":
                content = step.get("content", "")
                filepath_match = re.search(r"File Path: `file://(.*?)`", content)
                path_str = filepath_match.group(1) if filepath_match else "Unknown"
                print(f"Log line {idx} (Step {step_idx}): Path={path_str}, length={len(content)}")
        except Exception as e:
            pass
