
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




    toggle_index : function() {
        let toggle_index = localStorage.getItem("toggle_index") === "true";
        localStorage.setItem("toggle_index", !toggle_index);
        ui_slider.update_main_width();
    },




    toggle_text_wrap : function() {
        let text_wrap = localStorage.getItem("text_wrap") === "true";
        localStorage.setItem("text_wrap", !text_wrap);
        ui_slider.update_main_width();
    },




    open_sandbox : function() {
        //TODO sandbox is under the footer
        //TODO when the button is clicked, the entire page (including the index) slides up, revealing the sandbox area
        //TODO inverse animation when closing the sandbox

        //TODO this makes sidebar's index indicator show "ALC Sandbox" instead of the actual current index
        //TODO it also disables the search, toggle word wrap and toggle index buttons
        //TODO footer and sidebar stay in the same place

        //TODO add a divider graphic between documentation and sandbox that shows up during the transition animation
        //TODO full width, about 1/5th height
    }
}