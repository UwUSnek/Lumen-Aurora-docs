

const ui_example_button_triggers = {
    decodeHTML : function(html) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    },


    retrieve_code: function(label) {
        // Convert <br> to newlines and decode the lines one by one
        let output_text = label.nextElementSibling.innerHTML.replaceAll('<br>', '\n').split('\n');
        for(let i = 0; i < output_text.length; i++) {
            output_text[i] = ui_example_button_triggers.decodeHTML(
                output_text[i]                                         // Base line output
                .replaceAll(/<ce->(.*?)<\/ce->/g, "// $1")             // Replace error tags with simple comments
                .replaceAll(/<\/?(!--|([a-zA-Z0-9_-]+))[^>]+>/g, ''))  // Remove other HTML tags
                .slice(4)                                              // Remove line number
            ;
        }

        // Join the lines, replace visible spaces with actual spaces and remove all leading and trailing newlines
        return output_text.join('\n').replaceAll('·', " ").trim();
    },




    trigger_copy_example_block : function(label) {
        navigator.clipboard.writeText(ui_example_button_triggers.retrieve_code(label));
    },


    trigger_copy_example_project : function(label) {

        // Collect labels
        let _labels = [];
        let container = label.closest('split-example-container-');
        if(container) {
            for(let _label of container.querySelectorAll('label-')) {
                _labels.push(_label);
            }
        }
        else {
            _labels.push(ui_example_button_triggers.retrieve_code(label));
        }


        // Read code, set file names and copy to clipboard
        let output_text = [];
        for(let _label of _labels) {
            output_text.push(`[ ${ _label.textContent.trim() } ]\n\n${ ui_example_button_triggers.retrieve_code(_label) }`);
        }
        navigator.clipboard.writeText(output_text.join("\n\n\n\n\n"));
    },


    trigger_run_in_sandbox : function(label) {
        let code = ui_example_button_triggers.trigger_copy_example_block(label);
        //FIXME connect with sandbox
    },
}

