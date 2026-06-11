import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        try:
            step = json.loads(line)
            step_type = step.get("type", "")
            
            # Check VIEW_FILE
            if step_type == "VIEW_FILE" and "content" in step:
                content = step["content"]
                for fn in ["index.js", "index.html"]:
                    if fn in content:
                        is_truncated = "truncated" in content.lower()
                        print(f"Line {line_num} VIEW_FILE {fn}: len={len(content)}, truncated={is_truncated}")
                        # If not truncated or if we want to see what is there:
                        if not is_truncated:
                            print(f"  -> Content length is {len(content)}, no 'truncated' marker found!")
            
            # Check tool_calls
            for tool in step.get("tool_calls", []):
                name = tool.get("name")
                args = tool.get("args", {})
                if isinstance(args, str):
                    args = json.loads(args)
                target_file = args.get("TargetFile", "")
                if target_file and any(fn in target_file for fn in ["index.js", "index.html"]):
                    code = args.get("CodeContent", "")
                    if code:
                        is_truncated = "truncated" in code.lower()
                        print(f"Line {line_num} TOOL_CALL {name} {target_file}: len={len(code)}, truncated={is_truncated}")
        except Exception as e:
            pass
