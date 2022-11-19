import HTML from 'html-parse-stringify';
import React from 'react';
import AST from '../components/AST';

export const parsePost = (str, emoji = []) => {
    emoji.forEach((emojo) => {
        const regex = new RegExp(':' + emojo.shortcode + ':', 'g')
        str = str.replace(regex, '<img src="' + emojo.url + '" alt="' + emojo.shortcode + '">');
    });

    const parsed = HTML.parse(str);
    return parsed.map((parsedEntry, index) => <AST parsed={parsedEntry} key={index}/>);
};
