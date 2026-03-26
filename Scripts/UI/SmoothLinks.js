

const ui_smooth_links = {
    init : function(){
        for(const link of document.getElementsByTagName("A")){

            // Local links - Replace with a custom function call
            if(link.getAttribute("href")?.startsWith("#")){
                link.addEventListener("click", function(event){
                    event.preventDefault();
                    setup_index.go_to_index(event.target.href);
                });
            }

            // External links - Open a new tab by default, instead of replacing the current one
            else {
                link.setAttribute("target", "_blank");
            }
        }
    }
}