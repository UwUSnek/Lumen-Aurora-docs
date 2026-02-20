let syntax_sources = new Array();



const copy_syntax = {
    copy : function() {

        // For each label
        for(const label of tab_doc.querySelectorAll('label-')) {
            let id = label.id.split('.', 2)[1];

            // If it requires a copy
            if(/^copy\..*/.test(label.id)) {

                // For each cached syntax element
                let found = false;
                for(let k = 0; k < syntax_sources.length && !found; ++k) {

                    // For each child label
                    let l1 = syntax_sources[k].querySelectorAll('label-');
                    for(let l = 0; l < l1.length; ++l) {

                        // If its id matches with the requested one, copy the syntax snippet from the source
                        if(l1[l].id == id){
                            label.insertAdjacentElement('afterend', l1[l].parentElement.querySelectorAll('table')[l].cloneNode(true));
                            label.classList = l1[l].classList;
                            label.id = label.id.replace('copy', 'copied'); //! Prevent multiple copies from being pasted
                            found = true;
                            break;
                        }
                    }

                    // Append note if present
                    let note = syntax_sources[k].querySelector('syntax-note-');
                    if(found && note != null && label.parentElement.querySelector('syntax-note-') == null) label.parentElement.appendChild(note.cloneNode(true));
                }

                // Print error if the ID cannot be found
                if(!found) console.error(`syntax not found for id ${ id }`)
            }
        }
    },




    start : function() {
        copy_syntax.copy();
    },




    init : function() {
        // Cache source syntax elements
        syntax_sources = [...(document.querySelectorAll('#main-right-staging syntax-'))];
    }
}