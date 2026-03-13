

const ui_example_button_triggers = {
    decodeHTML : function(html) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    },


    trigger_copy_code : function(label) {
        // Convert <br> to newlines and decode the lines one by one
        let output_text = label.nextElementSibling.innerHTML.replaceAll('<br>', '\n').split('\n');
        for(let i = 0; i < output_text.length; i++) {
            output_text[i] = ui_example_button_triggers.decodeHTML(
                output_text[i]                                         // Base line output
                .replaceAll(/<ce->.*?<\/ce->/g, "")                    // Remove error tags
                .replaceAll(/<\/?(!--|([a-zA-Z0-9_-]+))[^>]+>/g, '')) // Remove tags
                .slice(4)                                              // Remove line number
            ;
        }

        // Join the lines, replace visible spaces with actual spaces and remove all leading and trailing newlines
        navigator.clipboard.writeText(output_text.join('\n').replaceAll('·', " ").trim());
    },


    trigger_run_in_sandbox : function(label) {
        let code = ui_example_button_triggers.trigger_copy_code(label);
        //FIXME connect with sandbox
    },




    // init : function() {
    //     for(const label of document.querySelectorAll("example- > label-")){
    //         label.addEventListener('click', function(){ ui_example_button_triggers.copy_code(label); });
    //     }
    // }
}