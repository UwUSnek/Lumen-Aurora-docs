
const format_blocks = {

    // Even out the height of right and left example tags
    even_heights : function() {
        for(const exampleContainer of tab_examples.querySelectorAll('split-example-container-')) {
            if(!exampleContainer.hasAttribute("example_container_is_even")) {
                exampleContainer.setAttribute("example_container_is_even", "1"); //! Mark as being even for future iterations

                // Find left and right containers
                let lc = exampleContainer.querySelector('split-example-container-left-');
                let rc = exampleContainer.querySelector('split-example-container-right-');

                // Get contained divs
                let l = lc.querySelector('div');
                let r = rc.querySelector('div');

                // Fix heights
                if(r.offsetHeight < l.offsetHeight) r.style.minHeight = r.style.maxHeight = `${ l.offsetHeight }px`
                if(l.offsetHeight < r.offsetHeight) l.style.minHeight = l.style.maxHeight = `${ r.offsetHeight }px`
            }
        }
    },





    start : function() {
        format_blocks.even_heights();
    }
}