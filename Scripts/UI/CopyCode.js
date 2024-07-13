

var ui_copy_code = {
    decodeHTML : function(html) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    },


    copy_code : function(label) {
        // Convert <br> to newlines and decode the lines one by one
        let output_text = label.nextElementSibling.innerHTML.replaceAll(/<br>/g, '\n').split('\n');
        for(let i = 0; i < output_text.length; i++) {
            output_text[i] = ui_copy_code.decodeHTML(
                output_text[i]                                         // Base line output
                .replaceAll(/<ce->.*?<\/ce->/g, "")                    // Remove error tags
                .replaceAll(/<\/?(!--|([a-zA-Z0-9_\-]+))[^>]+>/g, '')) // Remove tags
                .slice(4)                                              // Remove line number
            ;
        }

        // Join the lines, replace visible spaces with actual spaces and remove all leading and trailing newlines
        navigator.clipboard.writeText(output_text.join('\n').replaceAll(/·/g, " ").trim());
    },




    init : function() {
        let children = document.querySelectorAll("example- > label-");
        for(let i = 0; i < children.length; i++){
            children[i].addEventListener('click', function(){ ui_copy_code.copy_code(children[i]); });
        }
    }
}