//!-----------------------------------------------------------------------------------------------------------//
//!   Cursed hack to use an invisible slider to resize the main containers and have it float between them     //
//!   so that it looks like the user is resizing the containers through an actual full height resize handle   //
//!-----------------------------------------------------------------------------------------------------------//





// Save slider element
let slider;


var ui_slider = {
    // Updates the maximum and minimum values of the slider. Used in browser zoom and window resize
    update_range : function(){
        slider.min = document.getElementById("CALC-SLIDER-MIN").offsetWidth;
        slider.max = document.getElementById("CALC-VW"        ).offsetWidth - document.getElementById("CALC-SLIDER-MAX").offsetWidth;
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
        left.style.width  =             `${ parseInt(slider.value) - main_padding_l_px }px`;
        right.style.width = `calc(100% - ${ parseInt(slider.value) + main_padding_l_px + main_padding_r_px * 2 }px)`;
        
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
        let min = document.getElementById("CALC-SLIDER-MIN").offsetWidth;
        let max = document.getElementById("CALC-VW"        ).offsetWidth - document.getElementById("CALC-SLIDER-MAX").offsetWidth;
        window.localStorage.setItem("slider-value", (min + max) / 2);
    },
    // Set slider value after page refresh and initialize it if needed
    init_slider : function(){
        if(window.localStorage.getItem("slider-set") != "set") {
            ui_slider.init_slider_first_time();
        }
        slider.addEventListener("mouseup", ui_slider.update_main_width);
        slider.addEventListener("mouseup", ui_slider.update_logos);
        slider.value = window.localStorage.getItem("slider-value");
    },







    //TODO maybe fix this mess of an hacked contraption thing
    init : function() {
        // Save slider element in global variable
        slider = document.getElementById("main-slider");


        // Calculate the minimum value of the slider
        let min = document.createElement('div');
        min.style.position = "fixed";
        min.id = "CALC-SLIDER-MIN";
        min.style.minWidth = "calc(var(--main-padding-l))";
        min.style.maxWidth = "calc(var(--main-padding-l))";
        document.body.appendChild(min);


        // Calculate the maximum value of the slider (starts from the right)
        let max = document.createElement('div');
        max.style.position = "fixed";
        max.id = "CALC-SLIDER-MAX";
        max.style.minWidth = "calc(var(--main-padding-r) * 2 + var(--slider-w))";
        max.style.maxWidth = "calc(var(--main-padding-r) * 2 + var(--slider-w))";
        document.body.appendChild(max);


        // Calculate the workspace width in pixels
        let vw = document.createElement('div');
        vw.style.position = "fixed";
        vw.style.minWidth = "100vw";
        vw.style.maxWidth = "100vw";
        vw.id = "CALC-VW";
        document.body.appendChild(vw);


        // Run initializer functions
        ui_slider.init_slider();
        ui_slider.update_range();
        ui_slider.update_main_width();
    }
}