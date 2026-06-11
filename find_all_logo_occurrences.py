import json

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "initLogoAnimation" in line:
            print(f"Line {idx}: contains 'initLogoAnimation', length={len(line)}")
            # Try to load and print a snippet
            try:
                step = json.loads(line)
                content = step.get("content", "")
                if "initLogoAnimation" in content:
                    pos = content.find("initLogoAnimation")
                    print(f"  Snippet: {content[pos-100:pos+300]}")
            except:
                pass
