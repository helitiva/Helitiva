import json

log_path = "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if idx == 101: # Line 101 in log, Step 102
            step = json.loads(line)
            content = step.get("content", "")
            print(f"Step 102 content length: {len(content)}")
            # Let's search if "initLogoAnimation" is inside
            if "initLogoAnimation" in content:
                print("Found initLogoAnimation in content!")
                pos = content.find("initLogoAnimation")
                print(f"Content starting from initLogoAnimation:\n{content[pos:pos+1500]}")
            with open("step_102_content.txt", "w", encoding="utf-8") as out:
                out.write(content)
            print("Saved to step_102_content.txt")
