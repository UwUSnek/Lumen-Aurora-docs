
var create_tab_names = {
    start : function() {
        tab_button_doc.innerHTML = `Documentation`;
        tab_button_examples.innerHTML = `Examples [${ tab_examples.querySelectorAll("example- label-").length - tab_examples.querySelectorAll("split-example-container-").length }]`;
        tab_button_internal.innerHTML = `Internal functioning${ (tab_internal.hasChildNodes() && tab_internal.childNodes[0].tagName != "TAB-PLACEHOLDER-") ? " [*]" : "" }`;
    }
}