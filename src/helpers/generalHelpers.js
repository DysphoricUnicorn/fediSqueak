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

export const parsePost = (str) => {
    const decoded = decodeHtmlEntities(str);
    const parsed = HTML.parse(decoded);
    return parsed.map((parsedEntry, index) => <AST parsed={parsedEntry} key={index}/>);
};
