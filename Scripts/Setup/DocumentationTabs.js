
const doc_list = new Map();
const example_list = new Map();
const internal_list = new Map();
let active_tab;

let tab_doc      = document.getElementById("main-right-doc");
let tab_examples = document.getElementById("main-right-examples");
let tab_internal = document.getElementById("main-right-internal");
let tab_button_doc;
let tab_button_examples;
let tab_button_internal;


//FIXME add quick fade-out/fade-in to tab transitions
var setup_tabs = {
    create_button : function(tab_num){
        // Create the button element
        let b = document.createElement("div");
        b.classList = "tab-button";
        b.style.setProperty("--tab-num", `${ tab_num }`);


        // Add click listener
        b.addEventListener("click", function() {
            // Update active tab
            active_tab = tab_num;
            tab_doc.style.marginLeft = `calc(0px - 100% * ${ tab_num } - var(--main-padding-r) * ${ tab_num })`;

            // Update button colors
            tab_button_doc.style.removeProperty("background-color");
            tab_button_examples.style.removeProperty("background-color");
            tab_button_internal.style.removeProperty("background-color");
            b.style.backgroundColor = "var(--bg-index-active)";
        });
        b.addEventListener("mouseenter", function(){
            if(parseInt(b.style.getPropertyValue("--tab-num"), 10) != active_tab) {
                b.style.backgroundColor = "var(--bg-index-hover)";
            }
        });
        b.addEventListener("mouseleave", function(){
            if(parseInt(b.style.getPropertyValue("--tab-num"), 10) != active_tab) {
                b.style.removeProperty("background-color");
            }
        });


        // Reutrn the button
        return b;
    },



    create_tab_buttons : function(){
        // Create button container
        let container = document.createElement("div");
        container.classList = "tab-buttons-container"

        // Create the actual buttons
        container.appendChild(tab_button_doc      = setup_tabs.create_button(0));
        container.appendChild(tab_button_examples = setup_tabs.create_button(1));
        container.appendChild(tab_button_internal = setup_tabs.create_button(2));

        // Spawn the container and set the default tab to documentation
        right.insertBefore(container, right.children[0]);
        tab_button_doc.dispatchEvent(new Event("click"))
    },






    get_local_root : function(elm){
        if(elm.parentNode.id === "main-right-staging") return elm;
        else return setup_tabs.get_local_root(elm.parentNode);
    },


    get_parent_header : function(elm){
        if(typeof elm != 'undefined' && elm != null) {
            if(elm.tagName == "H1") return elm;
            else return setup_tabs.get_parent_header(elm.previousSibling);
        }
        else return null;
    },



    move_elements : function(tag_name, output_map) {
        // For each "moveto" tag
        let elms = [...(document.getElementsByTagName(tag_name))];  //! Convert HTMLCollection to Array to make it not change dynamically
        for(let elm of elms) {

            // Get its header number
            let local_root = setup_tabs.get_local_root(elm);
            let parent_header = setup_tabs.get_parent_header(local_root);
            if(parent_header == null) continue;
            let header_number = (parent_header.innerHTML).match(/(\d+\.)+/g)[0];

            // Create content list in the map if it doesnt exist yet (and add the header element as first element)
            if(!output_map.has(header_number)) {
                output_map.set(header_number, [parent_header.cloneNode(true)]);
            }

            // Save each of its children in the hash map and remove them from the page, then remove the container.
            let output_array = output_map.get(header_number);  // Redundant variable to improve performance and readability
            let children = [...(elm.children)];  //! Convert HTMLCollection to Array to make it not change dynamically
            for(let c of children){
                output_array.push(c);
                c.remove();
            }
            elm.remove();
        }
    },




    init : function(){
        // Move elements in the correct tab (without spawning them)
        setup_tabs.move_elements("moveto-doc-", doc_list);
        setup_tabs.move_elements("moveto-examples-", example_list);
        setup_tabs.move_elements("moveto-internal-", internal_list);
        document.getElementById("main-right-staging").replaceChildren(); //! Empty the staging tab to improve performance and tidiness

        // Create buttons for the user
        setup_tabs.create_tab_buttons();

        // Force spawn the content (Normally this requires a click from the user)
        setup_index.on_location_changed();
        ui_slider.update_logos(); //! Update any logo element that's currently loaded
    }
}