
var format_examples = {

    // Remove HTML indentation from pre blocks and add the line number
    format : function(s){
        // Find shortest indentation
        let min;
        s = s.split('\n');
        for(let i = 0; i < s.length; i++){
            let line = s[i];
            let spaces = line.search(/\S/);
            if((min > spaces || min == undefined) && spaces >= 0){
                min = spaces;
            }
        }
        // Remove indentation and replace spaces and newlines with visible characters
        for(let i = 0; i < s.length; i++){
            let line = s[i];
            s[i] = (i == 0 || i == s.length - 1) ? '' : '<span class="hidden">' +(('0' + i).slice(-2)) + '&nbsp;&nbsp;</span>';
            s[i] += line.substring(min, line.length).replaceAll(/ /g, "·").replaceAll(/(·+)/g, "<sc->$1<\/sc->");
        }

        // Join and return all lines
        return s.join('<br>');
    },



    // Fix code indentation because apparently HTML5+CSS3 can't do that
    indent_code : function() {
        let c = tab_examples.querySelectorAll('example-');
        for(let i = 0; i < c.length; i++) if(!c[i].hasAttribute("format_blocks-is_fixed")) {
            c[i].setAttribute("format_blocks-is_fixed", "1"); //! Mark as fixed for future iterations

            let divs = c[i].querySelectorAll('div');
            for(let j = 0; j < divs.length; ++j){
                divs[j].innerHTML = format_examples.format(divs[j].innerHTML) + '<br>';
                // Add trailing newline to fix CSS's bugged max-height  ^
            }
        }
    },




    start : function() {
        format_examples.indent_code();
    }
}