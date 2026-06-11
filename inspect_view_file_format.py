import json

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if idx in [685, 687, 689]:
            step = json.loads(line)
            print(f"--- STEP INDEX {step.get('step_index', idx)} (log line {idx}) ---")
            print(f"keys: {list(step.keys())}")
            print(f"type: {step.get('type')}")
            # print first 500 chars of content
            print(f"content start:\n{step.get('content', '')[:500]}")
            print("\n")
