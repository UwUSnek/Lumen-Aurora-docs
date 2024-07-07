
const example_list = new Map();


var setup_example = {

    get_local_root : function(elm){
        if(elm.parentNode.tagName === "MAIN-RIGHT-DOC-SCROLL-") return elm;
        else return setup_example.get_local_root(elm.parentNode);
    },


    get_parent_header : function(elm){
        if(elm.tagName == "H1") return elm;
        else return setup_example.get_parent_header(elm.previousSibling);
    },




    create_view_examples_button : function(){
        // For each example element
        let elms = document.querySelectorAll(
            "main-right-doc-scroll- :not(split-example-container-right-) > example-," +
            "main-right-doc-scroll-                                      > example-"
        ); 
        for(let i = 0; i < elms.length; ++i) {
            let button = document.createElement("span");

            // Find additional examples
            let local_root = setup_example.get_local_root(elms[i]);
            let parent_header = setup_example.get_parent_header(local_root);
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
    },





    move_full_examples : function() {
        // For each extra example
        let elms = document.getElementsByClassName("full-example")
        for(let i = 0; i < elms.length; ++i) {

            // Get it's header number
            let local_root = setup_example.get_local_root(elms[i]);
            let parent_header = setup_example.get_parent_header(local_root);
            let header_number = (parent_header.innerHTML).match(/([0-9]+\.)+/g)[0];

            // Save it in the example hash map and remove it from the page
            if(!example_list.has(header_number)) {
                example_list.set(header_number, new Array());
            }
            example_list.get(header_number).push(elms[i]);
            elms[i].remove();
        }
    },




    init : function(){
        setup_example.move_full_examples();
        setup_example.create_view_examples_button();
    }
}