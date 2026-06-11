import json

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            for tool in step.get("tool_calls", []):
                name = tool.get("name")
                args = tool.get("args", {})
                if isinstance(args, str):
                    args = json.loads(args)
                target_file = args.get("TargetFile", "")
                if "index.js" in target_file and name == "replace_file_content":
                    repl = args.get("ReplacementContent", "")
                    if "initLogoAnimation" in repl or "draw" in repl or "canvas" in repl:
                        print(f"Log line {idx} (Step {step.get('step_index')}): replace of len {len(repl)}")
                        print(f"REPLACEMENT:\n{repl[:1500]}")
                        print("="*40)
        except Exception as e:
            pass
