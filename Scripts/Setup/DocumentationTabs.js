
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
    get_local_root : function(elm){
        if(elm.parentNode.tagName === "MAIN-RIGHT-DOC-SCROLL-") return elm;
        else return setup_tabs.get_local_root(elm.parentNode);
    },


    get_parent_header : function(elm){
        if(elm.tagName == "H1") return elm;
        else return setup_tabs.get_parent_header(elm.previousSibling);
    },






    create_button : function(text, tab_num){
        // Create the button element
        let b = document.createElement("div");
        b.classList = "tab-button";
        b.innerHTML = text
        b.style.setProperty("--tab-num", `${ tab_num }`);


        // Add click listener
        b.addEventListener("click", function() {
            active_tab = tab_num;
            tab_doc.style.marginLeft = `calc(0px - 100% * ${ tab_num } - var(--main-padding-r) * ${ tab_num })`;
            //let target_container = document.querySelector("#main-right-examples > main-right-examples-scroll-");
            //for(let j = 0; j < examples.length; ++j) {
            //    target_container.appendChild(examples[j]);
            //}

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



        /*
        // For each example element
        let elms = document.querySelectorAll(
            "main-right-doc-scroll- :not(split-example-container-right-) > example-," +
            "main-right-doc-scroll-                                      > example-"
        ); 
        for(let i = 0; i < elms.length; ++i) {
            let button = document.createElement("span");

            // Find additional examples
            let local_root = setup_tabs.get_local_root(elms[i]);
            let parent_header = setup_tabs.get_parent_header(local_root);
            console.log(parent_header);
            console.log(parent_header.innerHTML);
            let header_number = (parent_header.innerHTML).match(/([0-9]+\.)+/g)[0];
            let examples = example_list.get(header_number);


            // If the section has additional examples, create the link and make it load the examples
            if(examples != null && examples.length > 0) {
                button.classList = "more-examples-button";
                button.innerHTML = "See more examples →";
                button.href = "tmp";

                // Add click listener
                button.addEventListener("click", function() {
                    document.getElementById("main-right-doc").style.marginLeft = "calc(0px - 100% - var(--main-padding-r))";
                    let target_container = document.querySelector("#main-right-examples > main-right-examples-scroll-");
                    for(let j = 0; j < examples.length; ++j) {
                        target_container.appendChild(examples[j]);
                    }
                });
            }

            // If not, create a non-clickable text that says there are no more examples
            else {
                button.classList = "no-more-examples-button";
                button.innerHTML = "There are no additional examples.";
            }


            // Append button to the example element
            elms[i].appendChild(button);
        }
        */
    },





    move_elements : function(class_name, output_list) {
        // For each extra example
        let elms = document.getElementsByClassName(class_name)
        for(let i = 0; i < elms.length; ++i) {

            // Get it's header number
            let local_root = setup_tabs.get_local_root(elms[i]);
            let parent_header = setup_tabs.get_parent_header(local_root);
            let header_number = (parent_header.innerHTML).match(/([0-9]+\.)+/g)[0];

            // Save it in the example hash map and remove it from the page
            if(!output_list.has(header_number)) {
                output_list.set(header_number, new Array());
            }
            output_list.get(header_number).push(elms[i]);
            elms[i].remove();
        }
    },




    init : function(){
        setup_tabs.move_elements("moveto-example", example_list);
        setup_tabs.move_elements("moveto-internal", internal_list);
        setup_tabs.create_tab_buttons();
    }
}