
const update_tab_names = {
    start : function() {

        // Documentation
        tab_button_doc.innerHTML = `Documentation`;

        // Examples
        let example_num = tab_examples.querySelectorAll("example- label-").length - tab_examples.querySelectorAll("split-example-container-").length;
        tab_button_examples.style.opacity = example_num < 1 ? "50%" : "100%";
        tab_button_examples.innerHTML = example_num > 0 ? `Examples - ${ example_num }` : "No examples available";

        // Internal
        let has_internal = (tab_internal.hasChildNodes() && tab_internal.childNodes[0].tagName != "TAB-PLACEHOLDER-");
        tab_button_internal.style.opacity = has_internal ? "100%" : "50%";
        tab_button_internal.innerHTML = has_internal ? "Details" : "No details available";
    }
}