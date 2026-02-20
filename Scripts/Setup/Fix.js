
const setup_fix = {
    fix_split_td_height : function(){
        for(const splitTdOuter of document.querySelectorAll('.split-td-outer')) {
            let e = document.createElement('div');
            e.classList = 'split-td-outer2';

            let outerHTML = splitTdOuter.outerHTML;
            splitTdOuter.replaceWith(e);
            e.innerHTML = outerHTML;
        }
        for(const splitTd of document.querySelectorAll('.split-td')) {
            splitTd.innerHTML = `<div><div>${ splitTd.innerHTML }</div></div>`;
        }
    },




    init : function() {
        setup_fix.fix_split_td_height();
    }
}