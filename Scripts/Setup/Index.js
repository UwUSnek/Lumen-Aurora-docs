let index_indent = '3ch';
let index_active_id = 'index--overview';


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








    // Resets the old element and highlights the new one
    update_index_colors : function(index_old_id) {
        if(setup_index.is_id_defined(index_old_id)) {
            document.getElementById(index_old_id).parentElement.style.removeProperty("background-color");
        }
        document.getElementById(index_active_id).parentElement.style.backgroundColor = 'var(--bg-index-active)';
    },




    // Loads the contents in their respective tab
    refresh_tab_content : function() {

        // Retrieve the header number and spawn new paragraph contents, replacing the old ones
        let header_number = (document.getElementById(index_active_id).innerHTML.match(/([0-9]+\.)+/g)[0]);
        let dc =      doc_list.get(header_number); tab_doc.     replaceChildren(...(dc != null ? dc : new Array()));
        let ec =  example_list.get(header_number); tab_examples.replaceChildren(...(ec != null ? ec : new Array()));
        let ic = internal_list.get(header_number); tab_internal.replaceChildren(...(ic != null ? ic : new Array()));

        // Format blocks
        format_blocks.start();

        // Format examples
        format_examples.start();
        example_number.start();

        // Copy and format syntax blocks
        copy_syntax.start();
        format_syntax.start();


        // Add syntax cursor tooltips  //! Event listeners cannot be added before spawning the actual elements
        ui_syntax_hover.start();
    },








    // Scrolls the active index element into view
    // smooth = true|false
    move_to_view : function(smooth){
        let i = document.getElementById(index_active_id).parentElement; 
        if(i != null) {
            i.scrollIntoView({ 
                block: "nearest", 
                behavior: (smooth && !window.chrome) ? "smooth" : "auto" 
            });
        }
    },




    // Callback that updates the session storage, the index UI and the tab contents
    on_location_changed : function() {
        let old = window.sessionStorage.getItem('index.selected_id');
        index_active_id = `index--${ location.hash.slice(1) }`;
        if(index_active_id == 'index--' || document.getElementById(index_active_id) == null) index_active_id = 'index--overview'
        window.sessionStorage.setItem('index.selected_id', index_active_id);

        setup_index.update_index_colors(old);
        setup_index.move_to_view(true);
        setup_index.refresh_tab_content();
    },




    // full link or #hash
    go_to_index : function(link){
        history.pushState(null, '', link);
        setup_index.on_location_changed();
    },







    init : function(){
        setup_index.format_elm(document.querySelector('index-'), 0, '');

        // Setup location change listener
        window.addEventListener('hashchange', function(e){ setup_index.on_location_changed(); });
    }
}