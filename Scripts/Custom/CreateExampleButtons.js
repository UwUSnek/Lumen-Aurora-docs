



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


                // Add copy example block button
                let copy_block_button = document.createElement("button-");
                (async () => {copy_block_button.appendChild(await utils.loadSVG("./Styles/Blocks/Example/Icons/CopyExampleBlockButton.svg"));})();
                copy_block_button.dataset.tooltip = "Copy example block";
                copy_block_button.classList.add("tooltip-top");
                copy_block_button.addEventListener('click', function(){ ui_example_button_triggers.trigger_copy_example_block(label); });
                button_container.appendChild(copy_block_button);


                // Add copy example project button
                let copy_project_button = document.createElement("button-");
                (async () => {copy_project_button.appendChild(await utils.loadSVG("./Styles/Blocks/Example/Icons/CopyExampleProjectButton.svg"));})();
                copy_project_button.dataset.tooltip = "Copy example project";
                copy_project_button.classList.add("tooltip-top");
                copy_project_button.addEventListener('click', function(){ ui_example_button_triggers.trigger_copy_example_project(label); });
                button_container.appendChild(copy_project_button);


                // Add sandbox button (or "sandbox not available icon")
                let sandbox_button = document.createElement("button-");
                sandbox_button.classList.add("tooltip-top");
                if(label.classList.contains("no-sandbox")) {
                    (async () => {sandbox_button.appendChild(await utils.loadSVG("./Styles/Blocks/Example/Icons/NoSandboxButton.svg"))})();
                    sandbox_button.dataset.tooltip = "Sandbox not available for this block";
                    sandbox_button.classList.add("no-sandbox");
                }
                else {
                    (async () => {sandbox_button.appendChild(await utils.loadSVG("./Styles/Blocks/Example/Icons/SandboxButton.svg"))})();
                    sandbox_button.addEventListener('click', function(){ ui_example_button_triggers.trigger_run_in_sandbox(label); });
                    sandbox_button.dataset.tooltip = "Run in ALC Sandbox";
                }
                button_container.appendChild(sandbox_button);
            }
        };
    }
}