

let left = document.querySelector("body > main- > left-");
let center = document.querySelector("body > main- > center-");


// Main padding is expressed in vw
let main_padding_r_vw      = Number.parseInt(utils.page_style.getPropertyValue("--main-padding-c")   .slice(0, -2));
let main_right_w_vw        = Number.parseInt(utils.page_style.getPropertyValue("--main-right-w")     .slice(0, -2));
let main_centeR_width_w_vw = Number.parseInt(utils.page_style.getPropertyValue("--main-center-min-w").slice(0, -2));
let main_padding_r_px;
let main_right_w_px;
let main_centeR_width_w_px;


function update_vw_values(){
    let page_width = document.documentElement.clientWidth;
    main_padding_r_px      = main_padding_r_vw      * page_width / 100;
    main_right_w_px        = main_right_w_vw        * page_width / 100;
    main_centeR_width_w_px = main_centeR_width_w_vw * page_width / 100;
}



function init(){
    update_vw_values();


    utils.exec_and_log(ui_slider.init, "ui_slider");
    utils.exec_and_log(setup_index.init, "setup_index");
    utils.exec_and_log(copy_syntax.init, "copy_syntax init");

    utils.exec_and_log(setup_fix.init, "setup_fix");

    utils.exec_and_log(ui_smooth_links.init, "ui_smooth_links");
    utils.exec_and_log(setup_tabs.init, "setup_tabs");
    utils.exec_and_log(load_button_icons.init, "load_button_icons");


    // Force update elements again to reflect the slider's width
    ui_slider.update_main_width();


    // Load keybinds
    keybinds.init();


    // The id="main-mask" div is used to hide the page before js is done moving stuff around as anything else just doesn't work
    // This line removes it from the body so that the user can see the page and think it loaded flawlessly
    let e = document.getElementById('main-mask');
    e.style.pointerEvents = 'none';
    e.style.opacity = '0%';
}