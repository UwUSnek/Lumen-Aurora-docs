

const regex_colors = {




    tokenize : function(pattern) {
        let result = '';
        let i = 0;

        while(i < pattern.length) {
            const ch = pattern[i];

            // Escaped character (backslash sequence)
            if(ch === '\\') {
                const next = pattern[i + 1] ?? '';
                result += `<regex-token->${ '\\' + next }</regex-token->`;
                i += 2;
                continue;
            }

            // Character class [...]
            if(ch === '[') {
                result += `<regex-group->${ ch }</regex-group->`;
                i++;

                let buffer = '';
                const flushBuffer = () => {
                    if(buffer) {
                        result += `<regex-char->${ buffer }</regex-char->`;
                        buffer = '';
                    }
                };

                // Optional negation ^
                if(pattern[i] === '^') {
                    result += `<regex-token->^</regex-token->`;
                    i++;
                }

                while(i < pattern.length && pattern[i] !== ']') {
                    const c = pattern[i];

                    if(c === '\\') {
                        flushBuffer();
                        const next = pattern[i + 1] ?? '';
                        result += `<regex-token->${ '\\' + next }</regex-token->`;
                        i += 2;
                    }
                    else if(c === '-' && buffer.length > 0 && pattern[i + 1] && pattern[i + 1] !== ']') {

                        // Range syntax. Flush all but last char of buf as the range start, then add the - character and the rest of the range
                        const rangeStart = buffer.at(-1);
                        buffer = buffer.slice(0, -1);
                        flushBuffer();
                        const rangeEnd = pattern[i + 1];
                        result += `<regex-char->${ rangeStart }</regex-char->`;
                        result += `<regex-token->-</regex-token->`;
                        result += `<regex-char->${ rangeEnd }</regex-char->`;
                        i += 2;
                    }
                    else {
                        buffer += c;
                        i++;
                    }
                }

                flushBuffer();
                if(pattern[i] === ']') {
                result += `<regex-group->]</regex-group->`;
                    i++;
                }
                continue;
            }

            // Groups
            if(ch === '(' || ch === ')') {
                result += `<regex-group->${ ch }</regex-group->`;
                i++;
                continue;
            }

            // Tokens: quantifiers, anchors, dot, pipe
            if('*+?.|^$'.includes(ch)) {
                result += `<regex-token->${ ch }</regex-token->`;
                i++;
                continue;
            }

            // Normal character
            result += `<regex-char->${ ch }</regex-char->`;
            i++;
        }

        return result;
    },




    start : function() {
        for(let elm of document.querySelectorAll('regex-:not([regex-formatted])')) {
            elm.innerHTML = this.tokenize(elm.innerHTML);
            elm.setAttribute('regex-formatted', '');
        }
    }
}