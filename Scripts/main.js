

let left = document.querySelector("body > left-");
let right = document.querySelector("body > right-");



// Scrolls to the element with id the current url hash
// smooth = true|false
function move_to_view(smooth){
    let hash = location.hash.slice(1);
    let id = hash;
    if(hash.length == 0 || hash == null || document.getElementById(id) == null) id = "overview";

    let e = document.getElementById(id);                           if(!e) return;
    let i = document.getElementById("index--" + id).parentElement; if(!i) return;
    e.scrollIntoView({ block: "start",   behavior: (smooth && !window.chrome) ? "smooth" : "auto" });
    i.scrollIntoView({ block: "nearest", behavior: (smooth && !window.chrome) ? "smooth" : "auto" });
}




function exec_and_log(f, name){
    var startTime = performance.now()
    f();
    var endTime = performance.now()
    console.debug(`${ name } took ${endTime - startTime} ms`)
}



function init(){
    exec_and_log(ui_slider.init, "ui_slider");
    exec_and_log(setup_index.init, "setup_index");

    exec_and_log(setup_fix.init, "setup_fix");
    exec_and_log(setup_syntax.init, "setup_syntax");
    exec_and_log(setup_copy_syntax.init, "setup_copy_syntax");

    exec_and_log(summary_list.init, "summary_list");
    exec_and_log(ui_smooth_links.init, "ui_smooth_links");
    exec_and_log(ui_copy_code.init, "ui_copy_code");
    //!^ Must be executed after modifying the body as changing the innerHTML recreates all the elements and removes the event listeners
    exec_and_log(ui_syntax_hover.init, "ui_syntax_hover");
    exec_and_log(setup_tabs.init, "setup_tabs"); 



    // The id="main-mask" div is used to hide the page before js is done moving stuff around as anything else just doesn't work
    // This line removes it from the body so that the user can see the page and think it loaded flawlessly
    setTimeout(function(){ move_to_view(true); }, 1000);
    let e = document.getElementById('main-mask');
    e.style.pointerEvents = 'none';
    e.style.opacity = '0%';
}




function unload(){
    let e = document.getElementById('main-mask');
    e.style.pointerEvents = 'all';
    e.style.opacity = '100%';
}



