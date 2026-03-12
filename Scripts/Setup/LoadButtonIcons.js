

const load_button_icons = {
    init : function() {
        document.querySelectorAll("button- img").forEach(async img => {
            const res = await fetch(img.src);
            const text = await res.text();
            const parser = new DOMParser();
            const svg = parser.parseFromString(text, "image/svg+xml").documentElement;
            svg.removeAttribute("width");
            svg.removeAttribute("height");
            svg.setAttribute("alt", img.alt);
            img.replaceWith(svg);
        });
    }
}