
var format_blocks = {

    // Even out the height of right and left example tags
    even_heights : function() {
        let c = tab_examples.querySelectorAll('split-example-container-');

        for(let i = 0; i < c.length; i++) {
            // Find left and right containers
            let lc = c[i].querySelector('split-example-container-left-');
            let rc = c[i].querySelector('split-example-container-right-');

            // Get contained divs
            let l = lc.querySelector('DIV');
            let r = rc.querySelector('DIV');

            // Fix heights
            if(r.offsetHeight < l.offsetHeight) r.style.minHeight = r.style.maxHeight = `${ l.offsetHeight }px`
            if(l.offsetHeight < r.offsetHeight) l.style.minHeight = l.style.maxHeight = `${ r.offsetHeight }px`
        }
    },





    start : function() {
        format_blocks.even_heights();
    }
}