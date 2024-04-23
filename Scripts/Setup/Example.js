
var setup_example = {
    get_local_root : function(elm){
        if(elm.parentNode.tagName === "MAIN-SCROLL-") return elm;
        else return setup_example.get_local_root(elm.parentNode);
    },


    get_parent_header : function(elm){
        if(elm.tagName == "H1") return elm;
        else return setup_example.get_parent_header(elm.previousSibling);
    },




    view_examples_button : function(){

        // For each example element
        let elms = document.querySelectorAll(
            "main-scroll- :not(split-example-container-right-) > example-," +
            "main-scroll-                                      > example-"
        );
        for(let i = 0; i < elms.length; ++i) {

            // Create button
            let button = document.createElement("span");
            button.classList = "more-examples-button";
            button.innerHTML = "See more examples →";
            button.href = "tmp";

            // Add click listener
            button.addEventListener("click", function() {
                let local_root = setup_example.get_local_root(elms[i]);
                let parent_header = setup_example.get_parent_header(local_root);
                let header_number = (parent_header.innerHTML).match(/([0-9]+\.)+/g)[0];
                console.log(header_number);
            });

            // Append button to the example element
            elms[i].appendChild(button);
        }
    },





    init : function(){
        setup_example.view_examples_button();
    }
}