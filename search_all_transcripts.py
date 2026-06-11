import os
import json

brain_dir = "/Users/huy/.gemini/antigravity/brain"
candidates = []

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file == "transcript.jsonl":
            candidates.append(os.path.join(root, file))

for path in candidates:
    print(f"\nSearching: {path}")
    with open(path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f):
            if "initLogoAnimation" in line:
                print(f"  Line {line_num}: contains 'initLogoAnimation', length={len(line)}")
                try:
                    step = json.loads(line)
                    content = step.get("content", "")
                    if "initLogoAnimation" in content:
                        pos = content.find("initLogoAnimation")
                        print(f"    Snippet: {content[pos:pos+500]}")
                    for tool in step.get("tool_calls", []):
                        args = tool.get("args", {})
                        if isinstance(args, str):
                            args = json.loads(args)
                        code = args.get("CodeContent", "")
                        if "initLogoAnimation" in code:
                            pos = code.find("initLogoAnimation")
                            print(f"    Tool write_to_file code snippet: {code[pos:pos+500]}")
                except Exception as e:
                    print(f"    Error parsing: {e}")
