import re

with open("all_snippets.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for "STEP" lines and get their details
step_matches = list(re.finditer(r"STEP \d+", text))
for idx, match in enumerate(step_matches):
    start_pos = match.start()
    end_pos = step_matches[idx+1].start() if idx+1 < len(step_matches) else len(text)
    block = text[start_pos:end_pos]
    
    # Check if index.js or index.html is mentioned in this block
    if "index.js" in block:
        is_tr = "truncated" in block.lower()
        print(f"Block starting with {match.group(0)} contains index.js: size={len(block)}, truncated={is_tr}")
    if "index.html" in block:
        is_tr = "truncated" in block.lower()
        print(f"Block starting with {match.group(0)} contains index.html: size={len(block)}, truncated={is_tr}")
