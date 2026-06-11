import json

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        if line_num == 82:
            step = json.loads(line)
            print(f"Type: {step.get('type')}")
            for tool in step.get("tool_calls", []):
                print(f"Tool: {tool.get('name')}")
                args = tool.get("args", {})
                if isinstance(args, str):
                    args = json.loads(args)
                print(f"TargetFile: {args.get('TargetFile')}")
                content = args.get("CodeContent", "")
                print(f"CodeContent type: {type(content)}, length: {len(content)}")
                # Print the first 200 and last 200 chars
                print(f"START: {content[:200]}")
                print(f"END: {content[-200:]}")
