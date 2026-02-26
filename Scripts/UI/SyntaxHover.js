
// Tooltip opacity transition duration in milliseconds
let tooltip_opacity_duration = Number.parseFloat(page_style.getPropertyValue("--syntax-hover-tooltip-opacity-duration")) * 1000;



const ui_syntax_hover = {
    add_tooltip : function(e, text) {
        // Create tooltip container
        let tooltip_c = document.createElement("div");
        tooltip_c.classList.add("syntax-hover-tooltip-container");

        // Create main tooltip element
        let tooltip = document.createElement("div");
        tooltip.classList.add("syntax-hover-tooltip");
        tooltip_c.appendChild(tooltip);

        // Create arrow background
        let tooltip_arrow = document.createElement("div");
        tooltip_arrow.classList.add("syntax-hover-tooltip-arrow");
        tooltip.appendChild(tooltip_arrow);

        // Create arrow border
        let tooltip_arrow_b = document.createElement("div");
        tooltip_arrow_b.classList.add("syntax-hover-tooltip-arrow-border");
        tooltip.appendChild(tooltip_arrow_b);


        // Add the specified text as HTML, append the container to the syntax block element and start the opacity transition
        tooltip.innerHTML += '<p style="margin: 0px;">' + text + '</p>';
        e.appendChild(tooltip_c);
        //! Forcibly flush pending style changes. This stops the opacity change from being calculated in this round and thus skipped
        tooltip.style.opacity = 1;
    },



    f_vbtm : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Verbatim block</b><br><br>" +
        "This block contains code that must be written exactly as shown."
    );},
    f_id : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Identifier block</b><br><br>" +
        "This block identifies a valid user-defined identifier."
    );},
    f_sub : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Sub-element block</b><br><br>" +
        "This block represents a sub-element whose syntax is specified somewhere else in the documentation."
    );},
    f_decl : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Declaration block</b><br><br>" +
        "This block represents a valid symbol declaration of the specified kind."
    );},
    f_sgr : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Syntactic sugar block</b><br><br>" +
        "This block represents syntactic sugar, special syntax elements whose sole purpose is to simplify the syntax of existing features."
    );},
    f_expr : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Expression block</b><br><br>" +
        "This block represents an expression.<br><br>" +
        "If present, square brackets [] indicate that the expression must be of the specified type."
    );},
    f_path : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Path block</b><br><br>" +
        "This block represents a path to a declared symbol."
    );},
    f_type : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Type block</b><br><br>" +
        "This block represents a path to a declared or implicit type.<br><br>" +
        "Types are a subset of symbol paths that can be used to declare variables, routines and other typed symbols."
    );},
    f_sttm : function(e) { ui_syntax_hover.add_tooltip(
        e.target,
        "<b style=\"font-size:16px;\">Statement</b><br><br>" +
        "This block represents a routine statement."
    );},




    on_move: function(e){
        // Get elements and calculate the width of the tooltip / 2 to aligh it with the cursor
        //! "this" assumes the value of the original element this event was attached to. e.target is the innermost and cannot be used in this case
        let tooltip = this.getElementsByClassName("syntax-hover-tooltip-container")[0].getElementsByClassName("syntax-hover-tooltip")[0];
        let parent_rect = this.getBoundingClientRect();
        let halfW = tooltip.getBoundingClientRect().width / 2;

        // Set the tooltip position and align it with the cursor
        tooltip.style.top  = '' + (parent_rect.top + parent_rect.height) + 'px';
        tooltip.style.left = '' + (e.pageX - halfW) + 'px';
    },




    on_leave : function(e){
        // Get elements
        let container = e.target.getElementsByClassName("syntax-hover-tooltip-container")[0];
        let tooltip = container.getElementsByClassName("syntax-hover-tooltip")[0];

        // Start opacity transition and delete the element after it has finished
        tooltip.style.opacity = 0;
        setTimeout(function(){ container.remove(); }, tooltip_opacity_duration);
    },




    start : function(){

        // Verbatim. Literally what the element contains
        for(const e of tab_doc.querySelectorAll("S-VBTM-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_vbtm);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // User defined sequence of characters
        for(const e of tab_doc.querySelectorAll("s-id-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_id);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // Sub element
        for(const e of tab_doc.querySelectorAll("S-SUB-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_sub);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // Declaration
        for(const e of tab_doc.querySelectorAll("S-DECL-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_decl);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // Syntactic sugar
        for(const e of tab_doc.querySelectorAll("S-SGR-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_sgr);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // Expression
        for(const e of tab_doc.querySelectorAll("S-EXPR-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_expr);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // Symbol path
        for(const e of tab_doc.querySelectorAll("S-PATH-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_path);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // Type name
        for(const e of tab_doc.querySelectorAll("S-TYPE-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_type);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }

        // Statements
        for(const e of tab_doc.querySelectorAll("S-STTM-")) {
            e.addEventListener("mouseenter", ui_syntax_hover.f_sttm);
            e.addEventListener("mouseleave", ui_syntax_hover.on_leave);
            e.addEventListener("mousemove",  ui_syntax_hover.on_move);
        }
    }
}