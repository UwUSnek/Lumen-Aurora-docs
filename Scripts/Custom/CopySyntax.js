let syntax_sources = Array();



var copy_syntax = {
    copy : function() {
        // For each label
        let l0 = tab_doc.querySelectorAll('label-');
        for(let i = 0; i < l0.length; ++i) {
            let id = l0[i].id.split('.', 2)[1];

            // If it requires a copy
            if(/^copy\..*/.test(l0[i].id)) {

                // For each cached syntax element
                let found = false;
                for(let k = 0; k < syntax_sources.length && !found; ++k) {

                    // For each child label
                    let l1 = syntax_sources[k].querySelectorAll('label-');
                    for(let l = 0; l < l1.length; ++l) {

                        // If its id matches with the requested one, copy the syntax snippet from the source
                        if(l1[l].id == id){
                            l0[i].insertAdjacentElement('afterend', l1[l].parentElement.querySelectorAll('table')[l].cloneNode(true));
                            l0[i].classList = l1[l].classList;
                            l0[i].id = l0[i].id.replace('copy', 'copied'); //! Prevent multiple copies from being pasted
                            found = true;
                            break;
                        }
                    }

                    // Append note if present
                    let note = syntax_sources[k].querySelector('syntax-note-');
                    if(found && note != null && l0[i].parentElement.querySelector('syntax-note-') == null) l0[i].parentElement.appendChild(note.cloneNode(true));
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