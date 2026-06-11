import os
import json
import re

transcripts = [
    "/Users/huy/.gemini/antigravity/brain/fb866933-9be7-4051-aa42-fef4dbdc4f55/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/3413c196-a1cd-4e48-9062-5bbd404d4f6b/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/70c9e403-353f-4519-ad4e-1e29a59c4c1f/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"
]

for t in transcripts:
    if not os.path.exists(t):
        print(f"Skipping {t}: not found")
        continue
    
    print(f"\nScanning transcript: {t}")
    with open(t, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f):
            try:
                step = json.loads(line)
                
                # Check VIEW_FILE content
                if step.get("type") == "VIEW_FILE" and "content" in step:
                    content = step["content"]
                    # check if it looks like the index files
                    for filename in ["index.html", "index.js", "index.css"]:
                        if filename in content and len(content) > 1000:
                            print(f"  [VIEW_FILE] Line {line_num}: Found potential {filename} view, length: {len(content)}")
                            
                # Check tool calls
                for tool in step.get("tool_calls", []):
                    name = tool.get("name")
                    args = tool.get("args", {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    
                    target_file = args.get("TargetFile")
                    if target_file and any(f in target_file for f in ["index.html", "index.js", "index.css"]):
                        code = args.get("CodeContent")
                        if code:
                            print(f"  [TOOL_CALL {name}] Line {line_num}: Target: {target_file}, CodeContent length: {len(code)}")
            except Exception as e:
                pass
