let index_indent = '3ch';
let index_active_id = 'index--overview';

let tab_spacer_doc      = document.createElement("virtual-spacer-");
let tab_spacer_examples = document.createElement("virtual-spacer-");
let tab_spacer_internal = document.createElement("virtual-spacer-");

let tab_placeholder_doc      = document.createElement("tab-placeholder-");
let tab_placeholder_examples = document.createElement("tab-placeholder-");
let tab_placeholder_internal = document.createElement("tab-placeholder-");


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}





const setup_index = {

    format_elm_self : function(elm, depth, number_str) {

        // Click events
        if(elm.tagName == 'INDEXH-') {
            let id = elm.innerHTML;
            elm.addEventListener('click', function(e) {
                if(e.offsetX < 10) {
                    elm.parentElement.classList.toggle('collapsed');
                }
                else {
                    setup_index.go_to_index(`#${ id }`);
                }
            });
        }
        if(elm.tagName == 'INDEXD-') {
            let id = elm.innerHTML;
            elm.addEventListener('click', function(){
                setup_index.go_to_index(`#${ id }`);
            });
        }


        // Layout / formatting
        if(elm.tagName == 'INDEXD-') {
            elm.classList.add('small');
        }
        if(elm.tagName == 'INDEXD-' || elm.tagName == 'INDEXH-') {
            let id = elm.innerHTML;
            if(id.length == 0) {
                elm.style.minHeight = '2em';
                return;
            }


            // Fix index element
            let name = capitalize(id.split('.').pop()).replaceAll('-', ' ');
            elm.innerHTML = `<span id="index--${ id }">${ number_str } ${ name }</span>`;
            elm.style.paddingLeft = `calc(` +   `${ index_indent } * ${ depth })`;
            elm.style.maxWidth    = `calc(100% - ${ index_indent } * ${ depth })`;

            //Fix referenced heading
            let heading = document.getElementById(id);
            if(heading == null) console.error(`heading for ID ${ id } not found`);
            heading.innerHTML = `${ number_str } ${ name }`;
            heading.classList.add('h' + (depth + 1));
        }


        // Elements container - set fixed height
        else if(elm.tagName == "INDEX-ELMS-") {
            elm.style.maxHeight = elm.getBoundingClientRect().height + 'px';
        }
    },




    // Indent and enumerate index elements
    format_elm : function(elm, depth, number_str) {
        this.format_elm_self(elm, depth, number_str);


        // index-elms- container (calculate new depth and pass computed number string)
        if(elm.tagName == 'INDEX-ELMS-') {
            let children = elm.children;
            let separators = 0;
            for(let i = 0; i < children.length; i++){
                let c = children[i];
                if(c.tagName == 'INDEX-SEPARATOR-'){
                    separators++;
                }
                else {
                    let c_number_str = number_str + (i - separators + 1) + '.';
                    this.format_elm(c, depth + 1, c_number_str);
                }
            }
        }

        // Other elements (simply forward the parameters)
        else {
            for(let c of elm.children) {
                this.format_elm(c, depth, number_str);
            }
        }
    },










    is_id_defined : function(id) {
        return !(Object.is(id, undefined) || !id?.length || document.getElementById(id) == null);
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

        // Retrieve the header number and spawn new paragraph contents, replacing the old ones //! (And also add the virtual spacer element back)
        let header_number = (document.getElementById(index_active_id).innerHTML.match(/(\d+\.)+/g)[0]);
        let dc =      doc_list.get(header_number); tab_doc.     replaceChildren(...(dc == null ? [tab_placeholder_doc]      : dc), tab_spacer_doc);
        let ec =  example_list.get(header_number); tab_examples.replaceChildren(...(ec == null ? [tab_placeholder_examples] : ec), tab_spacer_examples);
        let ic = internal_list.get(header_number); tab_internal.replaceChildren(...(ic == null ? [tab_placeholder_internal] : ic), tab_spacer_internal);

        // Update tab names
        create_tab_names.start();

        // Resize logos (if they exist)
        ui_slider.update_logos();

        // Color regex elements
        regex_colors.start();

        // Format blocks
        format_blocks.start();

        // Format summary lists
        format_summary_lists.start();

        // Format examples
        format_examples.start();

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
                behavior: (smooth && !globalThis.chrome) ? "smooth" : "auto"
            });
        }
    },




    // Callback that updates the session storage, the index UI and the tab contents
    on_location_changed : function() {
        let old = globalThis.sessionStorage.getItem('index.selected_id');
        index_active_id = `index--${ location.hash.slice(1) }`;
        if(index_active_id == 'index--' || document.getElementById(index_active_id) == null) index_active_id = 'index--overview'
        globalThis.sessionStorage.setItem('index.selected_id', index_active_id);

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
        setup_index.format_elm(document.querySelector('index-'), -0.5, '');

        // Setup location change listener
        globalThis.addEventListener('hashchange', function(e){ setup_index.on_location_changed(); });
    }
}