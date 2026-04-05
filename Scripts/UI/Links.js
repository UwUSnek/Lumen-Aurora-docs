

const ui_links = {
    init : function(){
        for(const link of document.getElementsByTagName("A")){


            // Local links
            if(link.getAttribute("href")?.startsWith("#")){

                // Replace with a custom function call
                link.addEventListener("click", function(event){
                    event.preventDefault();
                    setup_index.go_to_index(event.target.href);
                });

                // Check if the link is valid, print warning if not
                let id = link.getAttribute("href").slice(1);
                if(!document.getElementById(`index--${  id }`)) {
                    console.warn("Invalid ID link to #" + id, link);
                }
            }


            // External links
            else {

                // Open a new tab by default, instead of replacing the current one
                link.setAttribute("target", "_blank");
            }
        }
    },
}