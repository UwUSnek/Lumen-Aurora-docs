

function format(s){
    // find shortest indentation
    var min;
    s = s.split('\n');
    for(var i = 0; i < s.length; i++){
        var line = s[i];
        var spaces = line.search(/\S/);
        if((min > spaces || min == undefined) && spaces >= 0){
            min = spaces;
        }
    }
    // remove indentation
    for(var i = 0; i < s.length; i++){
        var line = s[i];
        s[i] = (i == 0 || i == s.length - 1) ? "" : "<span class=\"hidden\">" + (("0" + i).slice(-2)) + "&nbsp&nbsp;</span>";
        s[i] += line.substring(min, line.length);
    }

    // join and return all lines
    return s.join("\n");
}



// Fix code indentation because apparently HTML5+CSS3 can't do that
function fix_code() {
    var children = document.getElementsByTagName("SCROLL-");
    for(var i = 0; i < children.length; i++){
        children[i].innerHTML = format(children[i].innerHTML) + "\n";
        // Add trailing newline to fix CSS's bugged max-height  ^
    }
}



// Fix syntax codes having different heights because any CSS solution doesn't work and i don't want to add a million wrapper tags
function fix_syntax_heights(){
    var children = document.getElementsByTagName("LEFT-");
    for(var i = 0; i < children.length; i++){
        var left = children[i];
        if(left.parentNode.tagName == "SYNTAX-" || left.parentNode.tagName == "EXAMPLE-") {
            var right;
            var children2 = left.parentNode.children;
            for(var j = 0; j < children2.length; j++){
                if(children2[j].tagName == 'RIGHT-') {
                    right = children2[j];
                    break;
                }
            }
            var max = Math.max(left.clientHeight, right.clientHeight);
            left.style.height = max + "px";
            right.style.height = max + "px";
        }
    }
}


function fix_elm_height(){
    var children = document.getElementsByTagName("ELM-");
    for(var i = 0; i < children.length; i++){
        children[i].innerHTML +=
            "<sup class=\"nobefore noafter\" style=\"display: inline; margin-left: -100%;\"></sup>" +
            "<sub class=\"nobefore noafter\" style=\"display: inline; margin-left: 100%;\"></sub>"
        ;
    }
}



var index_indent = "2vw";

function fix_index_elm(elm, depth, last){
    var children = elm.children;
    for(var i = 0; i < children.length; i++){
        var c = children[i];
        if(c.tagName == "INDEXD-" || c.tagName == "INDEXH-") {
            c.innerHTML =
                "<a style=\"display: inline-block; min-width: 100%; max-width: min-content; margin-left: calc(" + index_indent + " * " + (depth - (c.tagName == "INDEXH-")) + ")\" " +
                "href=\"#" + c.innerHTML.toLocaleLowerCase().replaceAll(' ', '-') + "\">" + (c.tagName == "INDEXH-" ? last : last + i + ".") + " " + c.innerHTML + "</a>"
            ;
        }
        else if(c.tagName == "INDEX-") {
            fix_index_elm(c, depth + 1, last + i + ".");
        }
    }
}

function fix_index(){
    var children = document.getElementsByTagName("INDEX-");
    fix_index_elm(children[0], 0, "");
}


fix_index();
fix_code();
fix_syntax_heights();
fix_elm_height();
