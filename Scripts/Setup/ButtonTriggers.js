
const button_triggers = {
    open_downloads : function() {
        // TODO
    },




    open_github : function() {
        // TODO
    },




    open_about : function() {
        // TODO
    },




    open_search : function() {
        //TODO
    },




    open_toggle_index : function() {
        let toggle_index = localStorage.getItem("toggle_index") === "true";
        localStorage.setItem("toggle_index", !toggle_index);
        ui_slider.update_main_width();
    },




    open_toggle_text_wrap : function() {
        let text_wrap = localStorage.getItem("text_wrap") === "true";
        localStorage.setItem("text_wrap", !text_wrap);
        ui_slider.update_main_width();
    },




    open_sandbox : function() {
        // TODO
    }
}