
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



var setup_tabs = {
    create_button : function(text, tab_num){
        // Create the button element
        let b = document.createElement("div");
        b.classList = "tab-button";
        b.innerHTML = text
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


//TODO remove scroll fix after making paragraphs dynamic

    create_tab_buttons : function(){
        // Create button container
        let container = document.createElement("div");
        container.classList = "tab-buttons-container"

        // Create the actual buttons
        container.appendChild(tab_button_doc      = setup_tabs.create_button("Documentation",        0));
        container.appendChild(tab_button_examples = setup_tabs.create_button("Examples",             1));
        container.appendChild(tab_button_internal = setup_tabs.create_button("Internal functioning", 2));

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



    move_elements : function(tag_name, output_list) {
        // For each "moveto" tag
        let elms = document.getElementsByTagName(tag_name)
        for(let i = 0; i < elms.length; ++i) {

            // Get it's header number
            let local_root = setup_tabs.get_local_root(elms[i]);
            let parent_header = setup_tabs.get_parent_header(local_root);
            if(parent_header == null) continue;
            let header_number = (parent_header.innerHTML).match(/([0-9]+\.)+/g)[0];

            // Create header element in the map if it doesnt exist yet
            if(!output_list.has(header_number)) {
                output_list.set(header_number, new Array());
            }

            // Save each of its children in the hash map and remove them from the page, then remove the container
            let c = [...elms[i].children];  //! Convert HTMLCollection to Array to make it not change dynamically
            for(let j = 0; j < c.length; ++j){
                output_list.get(header_number).push(c[j]);
                c[j].remove();
            }
            elms[i].remove();
        }
    },




    init : function(){
        setup_tabs.move_elements("moveto-doc-", doc_list);
        setup_tabs.move_elements("moveto-example-", example_list);
        setup_tabs.move_elements("moveto-internal-", internal_list);
        setup_tabs.create_tab_buttons();
    }
}