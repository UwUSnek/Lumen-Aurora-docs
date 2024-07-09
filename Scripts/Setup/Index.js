index_indent = '3ch';



function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



var setup_index = {
    // Indent and enumerate index elements
    format_elm : function(elm, depth, last){
        let children = elm.children;
        let separators = 0;
        for(let i = 0; i < children.length; i++){
            let c = children[i];
            if(c.tagName == 'INDEX-SEPARATOR-') {
                separators += 1;
                continue;
            }
            if(c.tagName == 'INDEXD-' || c.tagName == 'INDEXH-') {
                let id = c.innerHTML;
                if(id.length == 0) {
                    c.style.minHeight = '2em';
                    continue;
                }
                let name = capitalize(id.split('.').pop()).replaceAll('-', ' ');
                let num = (c.tagName == 'INDEXH-' ? last : (last + (i - separators) + '.'));


                // Fix index
                c.innerHTML = `<span id="index--${ id }">${ num } ${ name }</span>`;
                c.style.paddingLeft = `calc(` +   `${ index_indent } * ${ (depth - (c.tagName == 'INDEXH-')) })`;
                c.style.maxWidth    = `calc(100% - ${ index_indent } * ${ (depth - (c.tagName == 'INDEXH-')) })`;
                c.addEventListener('click', function(){ setup_index.go_to_index(`#${ id }`); });


                //Fix heading
                let depth2 = (c.tagName == 'INDEXH-' ? depth : depth + 1);
                let heading = document.getElementById(id);
                if(heading == null) console.error(`heading for ID ${ id } not found`);

                heading.insertAdjacentHTML('beforebegin', `<sep-${ depth2 }-></sep-${ depth2 }->`);
                heading.innerHTML = `${ num } ${ name }`;
                if(depth == 0) heading.insertAdjacentHTML('afterend', '<sep-3-></sep-3->');
                heading.classList.add('h' + depth2);
            }
            else if(c.tagName == 'INDEX-') {
                setup_index.format_elm(c, depth + 1, last + (i - separators) + '.');
            }
        }
    },










    is_id_defined : function(id) {
        return !(Object.is(id, undefined) || id == null || !id.length || document.getElementById(id) == null);
    },




    on_location_changed : function() {
        // Reset the old element and highlight the new one
        let old = window.sessionStorage.getItem('index.selected_id');
        let new_ = `index--${ location.hash.slice(1) }`;
        if(new_ == 'index--' || document.getElementById(new_) == null) new_ = 'index--overview'
        let new_elm = document.getElementById(new_);


        // Update index elements colors
        if(setup_index.is_id_defined(old)) {
            document.getElementById(old).parentElement.style.removeProperty("background-color");
        }
        window.sessionStorage.setItem('index.selected_id', new_);
        new_elm.parentElement.style.backgroundColor = 'var(--bg-index-active)';


        // Remove old contents
        tab_doc.replaceChildren();
        tab_examples.replaceChildren();
        tab_internal.replaceChildren();


        // Retrieve the header number and spawn new paragraph contents
        let header_number = (new_elm.innerHTML.match(/([0-9]+\.)+/g)[0]);
        let dc =      doc_list.get(header_number); if(typeof dc != 'undefined' && dc != null) for(let i = 0; i < dc.length; ++i) tab_doc     .appendChild(dc[i]);
        let ec =  example_list.get(header_number); if(typeof ec != 'undefined' && ec != null) for(let i = 0; i < ec.length; ++i) tab_examples.appendChild(ec[i]);
        let ic = internal_list.get(header_number); if(typeof ic != 'undefined' && ic != null) for(let i = 0; i < ic.length; ++i) tab_internal.appendChild(ic[i]);
    },




    // full link or #hash
    go_to_index : function(link){
        history.pushState(null, '', link);
        setup_index.on_location_changed();
        move_to_view(true);
    },




    init : function(){
        setup_index.format_elm(document.querySelector('index-'), 0, '');
        setup_index.on_location_changed();


        // Setup location change listener
        window.addEventListener('hashchange', function(e){ setup_index.on_location_changed(); });
    }
}