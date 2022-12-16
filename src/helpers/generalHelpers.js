import HTML from 'html-parse-stringify';
import React from 'react';
import AST from '../components/AST';

export const parsePost = (str, emoji = [], cn = false) => {
    emoji.forEach((emojo) => {
        const regex = new RegExp(':' + emojo.shortcode + ':', 'g');
        str = str.replace(regex, '<img src="' + emojo.url + '" alt="' + emojo.shortcode + '">');
    });

    const parsed = HTML.parse(str);
    let first = true;
    return parsed.map((parsedEntry, index) => {
        const wasFirst = first;
        first = false;
        return <AST parsed={parsedEntry} key={index} first={wasFirst} cn={cn}/>;
    });
};
