
const update_tab_names = {
    start : function() {

        // Documentation
        tab_button_doc.querySelector("span").innerHTML = `Documentation`;

        // Examples
        let example_num = tab_examples.querySelectorAll(":scope > example-, :scope > split-example-container-").length;
        tab_button_examples.style.opacity = example_num < 1 ? "25%" : "100%";
        tab_button_examples.querySelector("span").innerHTML = example_num > 0 ? `Examples - ${ example_num }` : "No examples available";

        // Internal
        let has_internal = (tab_internal.hasChildNodes() && tab_internal.childNodes[0].tagName != "TAB-PLACEHOLDER-");
        tab_button_internal.style.opacity = has_internal ? "100%" : "25%";
        tab_button_internal.querySelector("span").innerHTML = has_internal ? "Details" : "No details available";
    }
}