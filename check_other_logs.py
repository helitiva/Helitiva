import json

other_logs = [
    "/Users/huy/.gemini/antigravity/brain/fb866933-9be7-4051-aa42-fef4dbdc4f55/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/3413c196-a1cd-4e48-9062-5bbd404d4f6b/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/70c9e403-353f-4519-ad4e-1e29a59c4c1f/.system_generated/logs/transcript.jsonl"
]

for path in other_logs:
    print(f"Checking {path}")
    try:
        with open(path, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f):
                if "initLogoAnimation" in line:
                    print(f"  Line {idx} matches!")
                    step = json.loads(line)
                    content = step.get("content", "")
                    for tool in step.get("tool_calls", []):
                        args = tool.get("args", {})
                        if isinstance(args, str):
                            args = json.loads(args)
                        code = args.get("CodeContent", "")
                        if "initLogoAnimation" in code:
                            print(f"    Found in tool call write_to_file code of size {len(code)}")
                            pos = code.find("initLogoAnimation")
                            print(f"    CODE:\n{code[pos:pos+1200]}")
    except Exception as e:
        print(f"  Error reading: {e}")
