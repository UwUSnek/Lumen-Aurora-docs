

var format_syntax = {
    min_w : parseFloat(page_style.getPropertyValue('--syntax-arrow-w').slice(0, -2)),



    // Align the colums to the maximum width of their cells
    even_widths : function(){
        let tables = tab_doc.querySelectorAll('syntax- > table');
        for(let j = 0; j < tables.length; ++j) if(!tables[j].hasAttribute("format_syntax-widths")) {
            tables[j].setAttribute("format_blocks-widths", "1"); //! Mark as fixed for future iterations
            
            let trs = tables[j].querySelectorAll('tr');


            // Calculate max width
            let max = Array();
            for(let k = 0; k < trs.length; ++k) {

                let tds = trs[k].querySelectorAll('td');
                for(let l = 0; l < tds.length; ++l){
                    if(Object.is(max[l], undefined)) {
                        max[l] = format_syntax.min_w;
                    }
                    if(max[l] < tds[l].offsetWidth) max[l] = tds[l].offsetWidth;
                }
            }


            // Set width
            for(let k = 0; k < trs.length; ++k) {
                let tds = trs[k].querySelectorAll('td');
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
                        tds[l].style.transform   = `scaleX(${ ratio + 2 * (1 / format_syntax.min_w) })`; // Add an extra pixel on each side to connect the arrows seamlessly
                        tds[l].style.marginLeft  = `${ (ratio - 1) / 2 * format_syntax.min_w }px`;
                        tds[l].style.marginRight = `${ (ratio - 1) / 2 * format_syntax.min_w }px`;
                    }
                }
            }
        }
    },











    format_arrows : function(){
        c = tab_doc.querySelectorAll("syntax- > table td");


        // Fix inverted arrows
        for(let i = 0; i < c.length; ++i) if(!c[i].hasAttribute("format_syntax-arrows_0")) {
            c[i].setAttribute("format_syntax-arrows_0", "1"); //! Mark as fixed for future iterations

            if(c[i].dataset.arrows && c[i].dataset.arrows.length) c[i].dataset.arrows = c[i].dataset.arrows
                .replaceAll(/\bbt\b/g, "tb")
                .replaceAll(/\brl\b/g, "lr")
                .replaceAll(/\btl\b/g, "lt")
                .replaceAll(/\brt\b/g, "tr")
                .replaceAll(/\bbr\b/g, "rb")
                .replaceAll(/\blb\b/g, "bl")
            ;
        }


        // Add automatic connectors
        for(let i = 0; i < c.length; ++i) if(!c[i].hasAttribute("format_syntax-arrows_1")) {
            c[i].setAttribute("format_syntax-arrows_1", "1"); //! Mark as fixed for future iterations

            if(c[i].dataset.arrows && c[i].dataset.arrows.length){

                // Vertical connectors
                if(/\b(tb|lt|tr)\b/.test(c[i].dataset.arrows)) {
                    let child_index = function(obj){
                        let p = obj.previousElementSibling;
                        return p ? child_index(p) + 1 : 0;
                    };
                    let prev_tr = c[i].parentElement.previousElementSibling;
                    if(prev_tr) {
                        let prev = prev_tr.children[child_index(c[i])];
                        if(prev) {
                            if(prev.dataset.arrows && /\b(tb|rb|bl)\b/.test(prev.dataset.arrows)) {
                                prev.dataset.arrows += " connect-b";
                                c[i].dataset.arrows += " connect-t";
                            }
                        }
                    }
                }

                // Horizontal connectors
                let cur_low  = /\b(lr|lt|bl)-low\b/     .test(c[i].dataset.arrows);
                let cur_std  = /\b(lr|lt|bl)\b($|[^\-])/.test(c[i].dataset.arrows);
                let cur_high = /\b(lr|lt|bl)-high\b/    .test(c[i].dataset.arrows);
                if(cur_low | cur_std | cur_high) {
                    let prev = c[i].previousElementSibling;
                    if(prev) {
                        if(prev.dataset.arrows && prev.dataset.arrows.length) {
                            let prev_low  = /\b(lr|tr|rb)-low\b/     .test(prev.dataset.arrows);
                            let prev_std  = /\b(lr|tr|rb)\b($|[^\-])/.test(prev.dataset.arrows);
                            let prev_high = /\b(lr|tr|rb)-high\b/    .test(prev.dataset.arrows);
                            if(cur_low && prev_low) {
                                prev.dataset.arrows += " connect-r-low";
                                c[i].dataset.arrows += " connect-l-low";
                            }
                            if(cur_std && prev_std) {
                                prev.dataset.arrows += " connect-r";
                                c[i].dataset.arrows += " connect-l";
                            }
                            if(cur_high && prev_high) {
                                prev.dataset.arrows += " connect-r-high";
                                c[i].dataset.arrows += " connect-l-high";
                            }
                        }
                    }
                }
            }
        }


        // Set backgrounds
        for(let i = 0; i < c.length; ++i) if(!c[i].hasAttribute("format_syntax-arrows_2")) {
            c[i].setAttribute("format_syntax-arrows_2", "1"); //! Mark as fixed for future iterations

            if(c[i].dataset.arrows && c[i].dataset.arrows.length){
                let bg = "";
                let arrows = c[i].dataset.arrows.split(/[\s]+/);
                for(let j = 0; j < arrows.length; ++j) bg += `url("./Styles/Blocks/Syntax/Arrows/${ arrows[j] }.svg") center/contain no-repeat content-box, `;
                c[i].style.background = bg.slice(0, -2);
            }
        }
    },







    start : function() {
        format_syntax.even_widths();
        format_syntax.format_arrows();
    }
}
