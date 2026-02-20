
const ui_smooth_links = {
    init : function(){
        for(const link of document.getElementsByTagName("A")){
            link.addEventListener("click", function(event){
                event.preventDefault();
                setup_index.go_to_index(event.target.href);
            });
        }
    }
}