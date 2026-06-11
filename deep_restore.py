import os
import json
import re

brain_dir = "/Users/huy/.gemini/antigravity/brain"
candidates = []

# Walk through brain directory to find transcript.jsonl files
for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file == "transcript.jsonl":
            candidates.append(os.path.join(root, file))

print(f"Found {len(candidates)} transcript candidates.")

files_by_time = {}

for path in candidates:
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    step = json.loads(line)
                    # Look for write_to_file tool calls
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
                            # Exclude Vite template matches in src/
                            if "src/" in target_file or "restore_" in target_file or "scratch_" in target_file:
                                continue
                            
                            code = args.get("CodeContent")
                            created_at = step.get("created_at", "")
                            
                            if code and len(code) > 2000: # Ensure it is a complete file
                                key = target_file.split("/")[-1]
                                if key not in files_by_time or created_at > files_by_time[key]["time"]:
                                    files_by_time[key] = {
                                        "time": created_at,
                                        "content": code,
                                        "path": target_file,
                                        "log": path
                                    }
                except:
                    pass
    except Exception as e:
        print(f"Error reading {path}: {e}")

# Save the restored files
for filename, info in files_by_time.items():
    print(f"Restoring {filename} from {info['time']} (log: {info['log']})")
    out_path = f"restore_{filename}"
    with open(out_path, "w", encoding="utf-8") as out_f:
        out_f.write(info["content"])
    print(f"Saved to {out_path} ({len(info['content'])} chars)")
