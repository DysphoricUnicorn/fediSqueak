import HTML from 'html-parse-stringify';
import React from 'react';
import AST from '../components/AST';

export const decodeHtmlEntities = (str) => {
    return (str
            ?.replace(/&#(\d+);/g, (match, dec) => {
                return String.fromCharCode(dec);
            }))
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, '\'')
            .replace(/&amp;/g, '&')
        ?? '';
};

export const parsePost = (str, emoji = []) => {
    let decoded = decodeHtmlEntities(str);
    emoji.forEach((emojo) => {
        const regex = new RegExp(':' + emojo.shortcode + ':', 'g')
        decoded = decoded.replace(regex, '<img src="' + emojo.url + '" alt="' + emojo.shortcode + '">');
        console.log(decoded, emojo, regex)
    });

    const parsed = HTML.parse(decoded);
    return parsed.map((parsedEntry, index) => <AST parsed={parsedEntry} key={index}/>);
};
