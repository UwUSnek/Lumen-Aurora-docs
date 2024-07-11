

let left = document.querySelector("body > left-");
let right = document.querySelector("body > right-");







function exec_and_log(f, name){
    var startTime = performance.now()
    f();
    var endTime = performance.now()
    console.debug(`${ name } took ${endTime - startTime} ms`)
}



function init(){
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



