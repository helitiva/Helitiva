import re

with open("all_snippets.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line_num, line in enumerate(lines[:100]):
    print(f"{line_num}: {line.strip()}")

# Let's count total lines and check for STEP headings
step_lines = []
for line_num, line in enumerate(lines):
    if line.startswith("STEP "):
        step_lines.append((line_num, line.strip()))

print(f"Total STEP occurrences: {len(step_lines)}")
for idx, (ln, val) in enumerate(step_lines):
    print(f"Occurrence {idx}: Line {ln}: {val}")
