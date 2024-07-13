

let left = document.querySelector("body > left-");
let right = document.querySelector("body > right-");


// Main padding is expressed in vw
let page_style = getComputedStyle(document.body);
let main_padding_l_vw = parseInt(page_style.getPropertyValue("--main-padding-l").slice(0, -2));
let main_padding_r_vw = parseInt(page_style.getPropertyValue("--main-padding-r").slice(0, -2));
let main_padding_l_px;
let main_padding_r_px;

function update_vw_values(){
    let page_width = document.documentElement.clientWidth;
    main_padding_l_px = main_padding_l_vw * page_width / 100;
    main_padding_r_px = main_padding_r_vw * page_width / 100;
}





function exec_and_log(f, name){
    var startTime = performance.now()
    f();
    var endTime = performance.now()
    console.debug(`${ name } took ${endTime - startTime} ms`)
}



function init(){
    update_vw_values();


    exec_and_log(ui_slider.init, "ui_slider");
    exec_and_log(setup_index.init, "setup_index");
    exec_and_log(copy_syntax.init, "copy_syntax init");

    exec_and_log(setup_fix.init, "setup_fix");

    exec_and_log(summary_list.init, "summary_list");
    exec_and_log(ui_smooth_links.init, "ui_smooth_links");
    exec_and_log(ui_copy_code.init, "ui_copy_code");
    //!^ Must be executed after modifying the body as changing the innerHTML recreates all the elements and removes the event listeners
    exec_and_log(setup_tabs.init, "setup_tabs"); 



    // The id="main-mask" div is used to hide the page before js is done moving stuff around as anything else just doesn't work
    // This line removes it from the body so that the user can see the page and think it loaded flawlessly
    let e = document.getElementById('main-mask');
    e.style.pointerEvents = 'none';
    e.style.opacity = '0%';
}




function unload(){
    let e = document.getElementById('main-mask');
    e.style.pointerEvents = 'all';
    e.style.opacity = '100%';
}



