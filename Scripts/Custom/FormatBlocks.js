
const format_blocks = {

    // Even out the height of right and left example tags
    even_heights : function(example_containers) {
        for(const exampleContainer of example_containers) {
            if(!exampleContainer.hasAttribute("example_container_is_even")) {
                exampleContainer.setAttribute("example_container_is_even", "1"); //! Mark as being even for future iterations

                // Find left and right containers
                let lc = exampleContainer.querySelector('split-example-container-left-');
                let rc = exampleContainer.querySelector('split-example-container-right-');

                // Get contained divs
                let l = lc.querySelector('example-'); // Use example element to allow for multiple example blocks at the left while keeping the correct corrected height on the right
                let r = rc.querySelector('example-');
                let ldiv = l.querySelector('div');
                let rdiv = r.querySelector('div');
                let label = lc.querySelector('div example- label-'); // Needed to calculate the height of the label to subtract from the total left height

                // Fix heights
                if(r.offsetHeight < l.offsetHeight) rdiv.style.minHeight = rdiv.style.maxHeight = `${ l.offsetHeight - label.offsetHeight }px`
                if(l.offsetHeight < r.offsetHeight) ldiv.style.minHeight = ldiv.style.maxHeight = `${ r.offsetHeight - label.offsetHeight }px`
            }
        }
    },





    start : function() {
        format_blocks.even_heights(tab_examples.querySelectorAll('split-example-container-'));
        format_blocks.even_heights(tab_doc.querySelectorAll('split-example-container-'));
    }
}