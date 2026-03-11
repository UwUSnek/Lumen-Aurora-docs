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




    // Updates the logo- X-position and height
    update_logos : function(){

        // If one of more logo elements are present in the current documentation tab
        let logos = tab_doc.querySelectorAll("logo-");
        let page_width = document.documentElement.clientWidth;
        if(logos != null && logos.length > 0) {

            // For each logo element
            for(const element of logos){

                // Move the background image from left of the viewport to center of the element (X only)
                element.style.backgroundPositionX = `calc(${ (page_width + Number.parseInt(slider.value)) / 2 }px - ${ getComputedStyle(element).backgroundSize } / 2)`;

                // Make its height identical to its (dynamic) width  //! Only setting the height property with min-height at 0 doesn't work
                let height = `min(25vh, ${ page_width - Number.parseInt(slider.value) - main_padding_r_px }px)`;
                element.style.minHeight = height;
                element.style.maxHeight = height;
            }
        }
    },




    // Updates the width of the left and right main containers
    update_main_width : function(){

        //! HTML Slider's minimum value doesn't actually work. The Math.max calls are used to prevent elements' widths from going negative
        // Left side (calc width)
        let slider_value = Number.parseInt(slider.value);
        let left_w = slider_value;
        left.style.width = `${ left_w }px`;

        // Right side (calc width and right distance. center element, limit width to 800, min padding of main_padding_r_px)
        let max_right_w = 800;
        // let right_w_total = Math.max(0, window.innerWidth - (slider_value + main_padding_l_px + main_padding_r_px * 2))
        let right_w_total = window.innerWidth - (left_w + main_padding_r_px * 2)
        let right_w = Math.min(max_right_w, right_w_total)
        let right_right = Math.max(main_padding_r_px, (right_w_total - right_w) / 2);
        right.style.width = `${ right_w }px`;
        right.style.right = `${ right_right }px`;

        globalThis.localStorage.setItem("slider-value", slider.value);
    },


    // Update on browser zoom and window resize
    _onresize : function() {
        ui_slider.update_range();
        ui_slider.update_main_width();
        ui_slider.update_logos();
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
            ui_slider.update_logos()
        });
        slider.value = globalThis.localStorage.getItem("slider-value");
    },







    init : function() {
        ui_slider.init_slider();
        ui_slider.update_range();
        ui_slider.update_main_width();
    }
}