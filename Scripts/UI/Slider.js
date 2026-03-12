//!-----------------------------------------------------------------------------------------------------------//
//!   Cursed hack to use an invisible slider to resize the main containers and have it float between them     //
//!   so that it looks like the user is resizing the containers through an actual full height resize handle   //
//!-----------------------------------------------------------------------------------------------------------//





// Save slider element
let slider = document.getElementById("main-slider");
let slider_width_px = Number.parseInt(page_style.getPropertyValue("--slider-w").slice(0, -2));


const ui_slider = {
    // Updates the maximum and minimum values of the slider. Used in browser zoom and window resize
    update_range : function(){
        slider.min = 0;
        slider.max = document.documentElement.clientWidth - main_padding_r_px * 2 - slider_width_px;
    },




    // Updates the width of the left and center main containers
    update_main_width : function(){

        //! HTML Slider's minimum value doesn't actually work. The Math.max calls are used to prevent elements' widths from going negative
        // Left side (calc width)
        let slider_value = Number.parseInt(slider.value);
        let left_w = slider_value;
        left.style.width = `${ left_w }px`;

        // Center (calc width and right distance. center element, limit width to 800, min padding of main_padding_r_px)
        let right_w_limit = 900;
        let right_w_total = window.innerWidth - left_w - main_right_w_px;
        let right_w = Math.min(right_w_limit, right_w_total) - (main_padding_r_px * 2);
        for(let e of center.querySelectorAll(
            ":scope > #main-center-tab-container > * > :not(" +
                "syntax-," +
                "example-," +
                "split-example-container-," +
                "ce-full-size-," +
                "h1," +
                "table," +
                ".table-container," +
                ".no-text-width-limit" +
            ")"
        )) {
            e.style.minWidth = `${ right_w }px`;
            e.style.maxWidth = `${ right_w }px`;
        }
        center.style.width = `${ right_w_total - main_padding_r_px * 2 }px`;

        globalThis.localStorage.setItem("slider-value", slider.value);
    },


    // Update on browser zoom and window resize
    _onresize : function() {
        ui_slider.update_range();
        ui_slider.update_main_width();
    },


    init_slider_first_time : function(){
        globalThis.localStorage.setItem("slider-set", "set");
        let min = 0;
        let max = document.documentElement.clientWidth - main_padding_r_px * 2 - slider_width_px;
        globalThis.localStorage.setItem("slider-value", (min + max) / 2);
    },
    // Set slider value after page refresh and initialize it if needed
    init_slider : function(){
        if(globalThis.localStorage.getItem("slider-set") != "set") {
            ui_slider.init_slider_first_time();
        }
        slider.addEventListener("mousemove", function(){
            ui_slider.update_main_width();
        });
        slider.value = globalThis.localStorage.getItem("slider-value");
    },







    init : function() {
        ui_slider.init_slider();
        ui_slider.update_range();
    }
}