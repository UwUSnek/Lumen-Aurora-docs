

const svg_cache = {};
const format_syntax = {


    // Cache fetched SVG content
    fetch_svg : async function (name) {
        if (!svg_cache[name]) {
            const res = await fetch(`./Styles/Blocks/Syntax/Arrows/${name}.svg`);
            const text = await res.text();
            const parsed = new DOMParser().parseFromString(text, 'image/svg+xml');
            // Extract just the inner content (paths, styles etc), not the <svg> wrapper
            svg_cache[name] = Array.from(parsed.documentElement.children);
        }
        return svg_cache[name];
    },




    min_w : Number.parseFloat(page_style.getPropertyValue('--syntax-arrow-w').slice(0, -2)),



    // Align the colums to the maximum width of their cells
    even_widths : function(){
        let tables = tab_doc.querySelectorAll('syntax- > table');
        for(const table of tables) if(!table.hasAttribute("format_syntax-widths")) {
            table.setAttribute("format_syntax-widths", "1"); //! Mark as fixed for future iterations
            let trs = table.querySelectorAll('tr');


            // Calculate max width
            let max = new Array();
            for(const tr of trs) {

                let tds = tr.querySelectorAll('td');
                for(let l = 0; l < tds.length; ++l){
                    if(Object.is(max[l], undefined)) {
                        max[l] = format_syntax.min_w;
                    }
                    if(max[l] < tds[l].offsetWidth) max[l] = tds[l].offsetWidth;
                }
            }


            // Set width
            for(const tr of trs) {
                let tds = tr.querySelectorAll('td');
                for(let l = 0; l < tds.length; ++l){

                    // Resize elements and wrap child elements into a div
                    let e = tds[l].childNodes;
                    if(e.length) {
                        tds[l].style.width = `${ max[l] }px`;
                        e[0].innerHTML = `<div>${ e[0].innerHTML }</div>`;
                    }

                    // Stretch arrows to fit long td bois
                    else {
                        tds[l].style.width = `${ format_syntax.min_w }px`;
                        let ratio = max[l] / format_syntax.min_w;
                        tds[l].style.transform   = `scaleX(${ ratio })`;
                        tds[l].style.marginLeft  = `${ (ratio - 1) / 2 * format_syntax.min_w }px`;
                        tds[l].style.marginRight = `${ (ratio - 1) / 2 * format_syntax.min_w }px`;
                    }
                }
            }
        }
    },








    format_arrows : async function(){
        const tds = tab_doc.querySelectorAll('syntax- > table td');

        // Fix inverted arrows (sync, no change)
        for(const td of tds) if(!td.hasAttribute("format_syntax-arrows_0")) {
            td.setAttribute("format_syntax-arrows_0", "1");
            if(td.dataset.arrows?.length) td.dataset.arrows = td.dataset.arrows
                .replaceAll(/\bbt\b/g, "tb")
                .replaceAll(/\brl\b/g, "lr")
                .replaceAll(/\btl\b/g, "lt")
                .replaceAll(/\brt\b/g, "tr")
                .replaceAll(/\bbr\b/g, "rb")
                .replaceAll(/\blb\b/g, "bl")
            ;
        }

        for (const table of tab_doc.querySelectorAll('syntax- > table')) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            Object.assign(svg.style, {
                position: "absolute",
                overflow: "visible",
                inset: "0",
                width: "100%",
                height: "100%",
                isolation: "isolate",
                pointerEvents: "none"
            });
            table.style.position = "relative";
            table.appendChild(svg);

            const g_root = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svg.appendChild(g_root);

            const table_rect = table.getBoundingClientRect();
            const cell_data = [];

            // Read rects synchronously before any await
            for(const td of table.querySelectorAll("td")) {
                if(!td.hasAttribute("format_syntax-arrows_2") && td.dataset.arrows?.length) {
                    td.setAttribute("format_syntax-arrows_2", "1");
                    const r = td.getBoundingClientRect();
                    cell_data.push({
                        arrows: td.dataset.arrows.split(/[\s]+/),
                        x: r.left - table_rect.left,
                        y: r.top - table_rect.top,
                        w: r.width,
                        h: r.height,
                    });
                }
            }

            // Do async work with saved rects
            await Promise.all(cell_data.map(async ({ arrows, x, y, w, h }) => {
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("transform", `translate(${x}, ${y}) scale(${w / 100}, ${h / 100})`);
                g_root.appendChild(g);

                const results = await Promise.all(arrows.map(this.fetch_svg));
                for (const nodes of results) {
                    for (const node of nodes) {
                        g.appendChild(node.cloneNode(true));
                    }
                }
            }));
        }
    },





    start : function() {
        format_syntax.even_widths();
        format_syntax.format_arrows();
    }
}
