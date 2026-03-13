
const button_triggers = {
    open_github : function() {
        // TODO
    },




    open_about : function() {
        // TODO
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