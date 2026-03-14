

const load_button_icons = {
    init : function() {
        for(let e of document.querySelectorAll("main- > right- button-")) (async () => {
            const path = e.dataset.icon;
            let svg = await utils.loadSVG(path);
            e.replaceChildren(svg);
        })();
    }
}