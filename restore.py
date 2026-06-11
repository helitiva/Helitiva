import json
import re

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

files_found = {}

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            # Check for view_file outputs
            if step.get("type") == "VIEW_FILE" and "content" in step:
                content = step["content"]
                filepath_match = re.search(r"File Path: `file://(.*?)`", content)
                if filepath_match:
                    filepath = filepath_match.group(1)
                    if any(f in filepath for f in ["index.html", "index.js", "index.css"]):
                        # Extract the lines
                        lines = []
                        for l in content.split("\n"):
                            m = re.match(r"^\d+: (.*)", l)
                            if m:
                                lines.append(m.group(1))
                        if lines:
                            files_found[filepath] = "\n".join(lines)
            
            # Check for replace_file_content or write_to_file tool calls
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
                    if name == "write_to_file" and "CodeContent" in args:
                        files_found[target_file] = args["CodeContent"]
                    elif name == "replace_file_content" and "ReplacementContent" in args:
                        # Store replacement snippet
                        if target_file not in files_found:
                            files_found[target_file] = []
                        files_found[target_file].append({
                            "type": "replace",
                            "target": args.get("TargetContent"),
                            "replacement": args["ReplacementContent"]
                        })
        except Exception as e:
            pass

# Output files
for filepath, content in files_found.items():
    print(f"=== FOUND FILE: {filepath} ===")
    if isinstance(content, list):
        print(f"Contains {len(content)} replacement snippets")
    else:
        print(f"Length: {len(content)} characters")
        # Save to scratch
        out_name = filepath.split("/")[-1]
        with open(f"restore_{out_name}", "w", encoding="utf-8") as out_f:
            out_f.write(content)
        print(f"Saved to restore_{out_name}")
