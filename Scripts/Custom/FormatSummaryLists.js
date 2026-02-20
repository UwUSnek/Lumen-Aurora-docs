
const format_summary_lists = {
    start : function(){
        for(const summaryList of document.querySelectorAll('.summary-list:not([summary-list-formatted])')) {
            summaryList.setAttribute('summary-list-formatted', '');

            // Calculate left and right width
            let max = 0;
            let liElms = summaryList.querySelectorAll('li');
            for(const li of liElms){
                if(!li.querySelectorAll('span').length) console.error("<span> elements not found in summary list <li>");
                max = Math.max(max, li.querySelector('span').getBoundingClientRect().width);
            }
            let maxWidth0 = `${ max + 20 }px`;
            let maxWidth1 = `calc(100% - ${ maxWidth0 })`;


            // Update element widths and wrap them in a div
            for(const li of liElms){
                let spans = li.querySelectorAll('span');
                spans[0].style.maxWidth = maxWidth0;
                spans[0].style.minWidth = maxWidth0;
                spans[1].style.maxWidth = maxWidth1;
                spans[1].style.minWidth = maxWidth1;
                li.innerHTML = `<div>${ li.innerHTML }</div>`;
            }
        }
    }
};