import json
import re

t = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"
out_lines = []

with open(t, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        try:
            step = json.loads(line)
            step_type = step.get("type", "")
            
            # Check VIEW_FILE content
            if step_type == "VIEW_FILE" and "content" in step:
                content = step["content"]
                for filename in ["index.html", "index.js", "index.css"]:
                    if filename in content:
                        out_lines.append(f"\n========================================\n")
                        out_lines.append(f"STEP {step.get('step_index')} (type: {step_type})\n")
                        out_lines.append(f"========================================\n")
                        out_lines.append(content)
                        out_lines.append("\n")
            
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
                        out_lines.append(f"\n========================================\n")
                        out_lines.append(f"STEP {step.get('step_index')} (tool_call: {name} for {target_file})\n")
                        out_lines.append(f"========================================\n")
                        out_lines.append(code)
                        out_lines.append("\n")
                    
                    rep = args.get("ReplacementContent")
                    if rep:
                        out_lines.append(f"\n========================================\n")
                        out_lines.append(f"STEP {step.get('step_index')} (tool_call: {name} for {target_file})\n")
                        out_lines.append(f"TargetContent:\n{args.get('TargetContent')}\n")
                        out_lines.append(f"ReplacementContent:\n{rep}\n")
                        out_lines.append("\n")
        except:
            pass

with open("all_snippets.txt", "w", encoding="utf-8") as out_f:
    out_f.writelines(out_lines)
print("Saved to all_snippets.txt")
