- Help
	- `==concept==    
	- or  Press Ctrl + Shift + H (the default Highlight shortcut, if assigned).
	- 

```dataviewjs 

const FOLDER = "Secutiry+/A-MyNotes/Generated-CertCrush"; // Change as needed

const pages = dv.pages(`"${FOLDER}"`)
    .where(p => p.file.path !== dv.current().file.path)
    .sort(p => p.file.name, "asc");

let total = 0;

for (const page of pages) {
    const content = await dv.io.load(page.file.path);
    if (!content) continue;

    const sections = [];
    let section = null;
    let stack = [];

    for (const line of content.split(/\r?\n/)) {
        // Recognize Markdown headings
        const heading = line.match(/^#{1,6}\s+(.+)/);
        if (heading) {
            section = {
                title: heading[1]
                    .split("·")[0].trim(),
                items: []
            };
            sections.push(section);
            stack = [];
            continue;
        }

        if (!section) continue;

        const bullet = line.match(/^([ \t]*)[-*+]\s+(.+)/);
        if (!bullet) continue;

        const match = bullet[2].match(/==(.+?)==/);
        if (!match) continue;

        const indent = bullet[1]
            .replace(/\t/g, "    ").length;

        while (stack.length &&
               stack[stack.length - 1] >= indent) {
            stack.pop();
        }

        const depth = stack.length;
        section.items.push({
            text: match[1],
            depth
        });
        stack.push(indent);
    }

    const selected = sections.filter(s => s.items.length);
    if (!selected.length) continue;

    dv.header(2, page.file.link);

    for (const s of selected) {
        dv.header(3, s.title);

        const root = document.createElement("ul");
        const parents = [{ depth: -1, list: root }];

        for (const item of s.items) {
            while (parents.length > 1 &&
                   parents[parents.length - 1].depth >= item.depth) {
                parents.pop();
            }

            const parent = parents[parents.length - 1].list;
            const li = document.createElement("li");
            li.textContent = item.text;
            parent.appendChild(li);

            const children = document.createElement("ul");
            li.appendChild(children);
            parents.push({ depth: item.depth, list: children });
            total++;
        }

        dv.container.appendChild(root);
    }
}

dv.paragraph(`Total highlighted concepts: ${total}`);

```
