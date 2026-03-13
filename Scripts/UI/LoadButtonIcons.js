

const load_button_icons = {
    init : function() {
        for(let e of document.querySelectorAll("main- > right- button-")) (async () => {
            const path = e.dataset.icon;
            if(path !== undefined && path.length > 0) {
                console.log("loading " + path);
                let svg = await utils.loadSVG(path);
                e.replaceChildren(svg);
            }
        })();
    }
}