//!-----------------------------------------------------------------------------------------------------------//
//!   Cursed hack to use an invisible slider to resize the main containers and have it float between them     //
//!   so that it looks like the user is resizing the containers through an actual full height resize handle   //
//!-----------------------------------------------------------------------------------------------------------//





// Save slider element
let slider = document.getElementById("main-slider");
let slider_width_px = parseInt(page_style.getPropertyValue("--slider-w").slice(0, -2));


var ui_slider = {
    // Updates the maximum and minimum values of the slider. Used in browser zoom and window resize
    update_range : function(){
        slider.min = main_padding_l_px;
        slider.max = document.documentElement.clientWidth - main_padding_r_px * 2 - slider_width_px;
    },




    // Updates the logo- X-position and height
    update_logos : function(){
        
        // If one of more logo elements are present in the current documentation tab
        let logos = tab_doc.querySelectorAll("logo-");
        let page_width = document.documentElement.clientWidth;
        if(logos != null && logos.length > 0) {

            // For each logo element
            for(let i = 0; i < logos.length; ++i){

                // Move the background image from left of the viewport to center of the element (X only)
                logos[i].style.backgroundPositionX = `calc(${ (page_width + parseInt(slider.value) + main_padding_l_px) / 2 }px - ${ getComputedStyle(logos[i]).backgroundSize } / 2)`;

                // Make its height identical to its (dynamic) width  //! Only setting the height property with min-height at 0 doesn't work
                let height = `min(60vh, ${ page_width - parseInt(slider.value) - main_padding_r_px - main_padding_l_px * 2 }px)`;
                logos[i].style.minHeight = height;
                logos[i].style.maxHeight = height;
            }
        }
    },




    // Updates the width of the left and right main containers
    update_main_width : function(){
        console.log("value: " + parseInt(slider.value));
        left.style.width  =             `${ Math.max(0, parseInt(slider.value) - main_padding_l_px) }px`;
        right.style.width = `calc(100% - ${ Math.max(0, parseInt(slider.value) + main_padding_l_px + main_padding_r_px * 2) }px)`;
        //! ^ HTML Slider's minimum value doesn't actually work. The Math.max calls are used to prevent elements' widths from going negative
        
        window.localStorage.setItem("slider-value", slider.value);
    },


    // Update on browser zoom and window resize
    _onresize : function() {
        ui_slider.update_range();
        ui_slider.update_main_width();
        ui_slider.update_logos();
    },


    init_slider_first_time : function(){
        window.localStorage.setItem("slider-set", "set");
        let min = main_padding_l_px;
        let max = document.documentElement.clientWidth - main_padding_r_px * 2 - slider_width_px;
        window.localStorage.setItem("slider-value", (min + max) / 2);
    },
    // Set slider value after page refresh and initialize it if needed
    init_slider : function(){
        if(window.localStorage.getItem("slider-set") != "set") {
            ui_slider.init_slider_first_time();
        }
        slider.addEventListener("mouseup", function(){ ui_slider.update_main_width(); ui_slider.update_logos() });
        slider.value = window.localStorage.getItem("slider-value");
    },







    init : function() {
        ui_slider.init_slider();
        ui_slider.update_range();
        ui_slider.update_main_width();
    }
}