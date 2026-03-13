

const utils = {
    page_style: getComputedStyle(document.body),


    // idk what to use this for but it looks cool
    // it's too tacky for documentation tabs or really anything that needs to be read often
    type_to : function(elm, new_text, speed = 25) {
        const old_text = elm.textContent;
        const longer = old_text.length > new_text.length ? old_text : new_text;
        const diff_at = [...longer].findIndex((c, i) => old_text[i] !== new_text[i]);

        // If texts are identical, do nothing
        if(diff_at === -1 && old_text.length === new_text.length) return;

        // Start of difference, or end of shorter string
        const split = diff_at === -1 ? Math.min(old_text.length, new_text.length) : diff_at;

        let current = old_text;
        const step = (deleting = true) => {
            if (elm.textContent !== current) return;
            if (deleting && current.length > split) {
                current = current.slice(0, -1);
                elm.textContent = current;
                setTimeout(() => step(true), speed);
            } else if (current.length < new_text.length) {
                current += new_text[current.length];
                elm.textContent = current;
                setTimeout(() => step(false), speed);
            }
        };
        step();
    },




    loadSVG : async (path) => {
        const res = await fetch(path);
        const text = await res.text();
        let svg = new DOMParser().parseFromString(text, "image/svg+xml").documentElement;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        return svg;
    },



    exec_and_log : function(f, name, ...params){
        let startTime = performance.now()
        f(params);
        let endTime = performance.now()
        console.debug(`${ name } took ${endTime - startTime} ms`)
    }
}