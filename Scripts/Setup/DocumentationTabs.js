
const doc_list = new Map();
const example_list = new Map();
const internal_list = new Map();

let tab_doc      = document.getElementById("main-center-doc");
let tab_examples = document.getElementById("main-center-examples");
let tab_internal = document.getElementById("main-center-internal");
let tab_button_doc;
let tab_button_examples;
let tab_button_internal;

let doc_tab_opacity_easing_exit  = getComputedStyle(document.documentElement).getPropertyValue("--doc-tab-opacity-easing-exit").trim()
let doc_tab_opacity_easing_enter = getComputedStyle(document.documentElement).getPropertyValue("--doc-tab-opacity-easing-enter").trim()
let doc_tab_movement_easing      = getComputedStyle(document.documentElement).getPropertyValue("--doc-tab-movement-easing").trim()
let transition_movement = `margin-left 0.3s ${ doc_tab_movement_easing }`;



const setup_tabs = {
    get_active_tab_index : function() {
        return Number.parseInt(localStorage.getItem("active_tab") ?? "0");
    },


    get_tab : function(number){
        switch(number) {
            case 0: return tab_doc;
            case 1: return tab_examples;
            case 2: return tab_internal;
            default: return null;
        }
    },


    get_tab_button : function(number){
        switch(number) {
            case 0: return tab_button_doc;
            case 1: return tab_button_examples;
            case 2: return tab_button_internal;
            default: return null;
        }
    },


    disable_tab : function(tab) {
        tab.style.opacity = "0%";
        tab.style.transition = `${ transition_movement }, opacity 0.3s ${ doc_tab_opacity_easing_exit }`;
        tab.style.setProperty("pointer-events", "none", "important");
        //! !important is required in order to overwrite other stuff.
        //! no clicks on invisible tabs is of the highest priority.
    },


    enable_tab : function(tab) {
        tab.style.opacity = "100%";
        tab.style.transition = `${ transition_movement }, opacity 0.3s ${ doc_tab_opacity_easing_enter }`;
        tab.style.pointerEvents = "auto";
    },


    create_button : function(tab_num){

        // Create the button element
        let b = document.createElement("div");
        b.classList = "tab-button";
        b.style.setProperty("--tab-num", `${ tab_num }`);


        // Add click listener
        b.addEventListener("click", function() {

            // Disable old tab, enable new tab
            setup_tabs.disable_tab(setup_tabs.get_tab(setup_tabs.get_active_tab_index()));
            setup_tabs.enable_tab(setup_tabs.get_tab(tab_num));

            // Change active tab index and move the elements
            localStorage.setItem("active_tab", tab_num);
            tab_doc.style.marginLeft = `calc(0px - 100% * ${ tab_num } - var(--main-padding-c) * ${ tab_num })`;

            // Update button colors
            tab_button_doc.style.removeProperty("background-color");
            tab_button_examples.style.removeProperty("background-color");
            tab_button_internal.style.removeProperty("background-color");
            b.style.backgroundColor = "var(--bg-index-active)";
        });
        b.addEventListener("mouseenter", function(){
            if(Number.parseInt(b.style.getPropertyValue("--tab-num"), 10) != setup_tabs.get_active_tab_index()) {
                b.style.backgroundColor = "var(--bg-index-hover)";
            }
        });
        b.addEventListener("mouseleave", function(){
            if(Number.parseInt(b.style.getPropertyValue("--tab-num"), 10) != setup_tabs.get_active_tab_index()) {
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
        tab_button_doc      = setup_tabs.create_button(0); container.appendChild(tab_button_doc     );
        tab_button_examples = setup_tabs.create_button(1); container.appendChild(tab_button_examples);
        tab_button_internal = setup_tabs.create_button(2); container.appendChild(tab_button_internal);

        // Spawn the container and set the default tab to documentation
        center.insertBefore(container, center.children[0]);
        this.get_tab_button(setup_tabs.get_active_tab_index()).dispatchEvent(new Event("click"))
    },






    get_local_root : function(elm){
        if(elm.parentNode.id === "main-center-staging") return elm;
        else return setup_tabs.get_local_root(elm.parentNode);
    },


    get_parent_header : function(elm){
        if(elm !== undefined && elm != null) {
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
        document.getElementById("main-center-staging").replaceChildren(); //! Empty the staging tab to improve performance and tidiness

        // Create buttons for the user
        setup_tabs.create_tab_buttons();

        // Initialize the content: All tabs start as disabled
        for(let i = 0; i < 3; ++i) {
            let active_tab = setup_tabs.get_active_tab_index();
            if(i != active_tab) {
                setup_tabs.disable_tab(setup_tabs.get_tab(i));
            }
        }

        // Force spawn the content (Normally this requires a click from the user)
        setup_index.on_location_changed();
    }
}