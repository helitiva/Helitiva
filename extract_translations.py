import json
import re

transcripts = [
    "/Users/huy/.gemini/antigravity/brain/fb866933-9be7-4051-aa42-fef4dbdc4f55/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"
]

all_translations_content = ""

for t in transcripts:
    try:
        with open(t, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    step = json.loads(line)
                    # Check VIEW_FILE steps
                    if step.get("type") == "VIEW_FILE" and "content" in step:
                        content = step["content"]
                        if "const translations =" in content:
                            if len(content) > len(all_translations_content):
                                all_translations_content = content
                except:
                    pass
    except Exception as e:
        print(f"Error: {e}")

if all_translations_content:
    print(f"Found translation view with length: {len(all_translations_content)}")
    # Clean and print lines
    lines = []
    for l in all_translations_content.split("\n"):
        m = re.match(r"^\d+: (.*)", l)
        if m:
            lines.append(m.group(1))
    
    clean_code = "\n".join(lines)
    with open("full_translations.js", "w", encoding="utf-8") as out_f:
        out_f.write(clean_code)
    print("Saved to full_translations.js")
else:
    print("No translations container found.")
