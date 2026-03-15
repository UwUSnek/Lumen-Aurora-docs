



const create_example_buttons = {

    start : function(){
        for(let label of document.querySelectorAll("main- center- example- label-")) {
            if(!label.hasAttribute("example_block_has_buttons")) {
                label.setAttribute("example_block_has_buttons", "1"); //! Mark as having buttons for future iterations


                // Wrap text
                let text_elm = document.createElement("span");
                text_elm.textContent = label.innerHTML;
                label.replaceChildren(text_elm);

                // Add button container
                let button_container = document.createElement("buttons-");
                label.appendChild(button_container);

                // Add copy button
                let copy_button = document.createElement("button-");
                (async () => {copy_button.appendChild(await utils.loadSVG("./Styles/Blocks/Example/Icons/CopyExampleButton.svg"));})();
                copy_button.dataset.tooltip = "Copy example";
                copy_button.classList.add("tooltip-top");
                copy_button.addEventListener('click', function(){ ui_example_button_triggers.trigger_copy_code(label); });
                button_container.appendChild(copy_button);

                // Add sandbox button
                let sandbox_button = document.createElement("button-");
                (async () => {sandbox_button.appendChild(await utils.loadSVG("./Styles/Blocks/Example/Icons/SandboxButton.svg"))})();
                sandbox_button.dataset.tooltip = "Run in ALC Sandbox";
                sandbox_button.classList.add("tooltip-top");
                sandbox_button.addEventListener('click', function(){ ui_example_button_triggers.trigger_run_in_sandbox(label); });
                button_container.appendChild(sandbox_button);
            }
        };
    }
}