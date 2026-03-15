
const keybinds = {

    init : function() {

        // Tab arrows
        document.addEventListener('keydown', e => {
            let current_tab_index = setup_tabs.get_active_tab_index();
            let new_tab_index;
            if     (e.key === 'ArrowLeft' ) new_tab_index = Math.min(Math.max(current_tab_index - 1, 0), 3);
            else if(e.key === 'ArrowRight') new_tab_index = Math.min(Math.max(current_tab_index + 1, 0), 3);
            else return;
            setup_tabs.change_tab(setup_tabs.get_tab_button(new_tab_index), new_tab_index);
        });


        // Sidebar buttons
        document.addEventListener('keydown', e => {
            switch(e.key) {
                case "i": button_triggers.toggle_index(); break;
                case "w": button_triggers.toggle_text_wrap(); break;
                case "a": setup_index.move_to_view(true); break;
                default: return;
            }
        });
    }
}