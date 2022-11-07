export const decodeHtmlEntities = (str) => {
    return (str?.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    })) ?? '';
};

export const parsePost = (str) => {
    // TODO: this is not a good way to do this but it will do for the beginning. Replace with something better later.

    return decodeHtmlEntities(str).replace(/<((p|\/?span))>/g, '').replace(/<((\/p)|(br ?\/?))>/g, '\n').replace(/&quot;/g, '"').replace(/&apos;/g, '\'');
}
