import re

with open("all_snippets.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find all headers like "STEP X"
steps = re.split(r"===+\nSTEP \d+.*?\n===+\n", content)

for idx, step in enumerate(steps):
    if not step.strip():
        continue
    
    # Check if this step contains a file content dump
    # We can search for the first lines of index.js, index.html, index.css
    first_lines = step.strip()[:100]
    print(f"Step {idx}: length {len(step)}, start: {repr(first_lines)}")
    
    # Check for index.js keys
    if "HELITIVA LABS - CYBER INTERACTIVE ENGINE" in step or "translations = {" in step:
        print(f"-> Found translation engine candidate in Step {idx} (length {len(step)})")
        # Let's save it
        with open(f"extracted_step_{idx}.js", "w", encoding="utf-8") as out:
            out.write(step)
            
    if "HELITIVA LABS - PURE DARK CYBER STYLESHEET" in step:
        print(f"-> Found CSS stylesheet candidate in Step {idx} (length {len(step)})")
        with open(f"extracted_step_{idx}.css", "w", encoding="utf-8") as out:
            out.write(step)

    if "<!DOCTYPE html>" in step and "Helitiva Labs" in step:
        print(f"-> Found HTML candidate in Step {idx} (length {len(step)})")
        with open(f"extracted_step_{idx}.html", "w", encoding="utf-8") as out:
            out.write(step)
