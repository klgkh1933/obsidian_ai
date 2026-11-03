**Trust boundary (background)**: The point where information or authority crosses from one security domain, identity or privilege level to another.

Important boundaries include third-party data → retrieval index; user input → model; retrieved text → model; model-generated output → browser/database/shell; model request → privileged tool; downloaded model → production runtime.

**Ask at every boundary:** Who controls the input? What could it influence? Where is authorization independently enforced? What is logged, and what is the fallback when a control fails?