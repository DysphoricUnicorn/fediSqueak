export const getPostHeight = (posts, index) => {
    // Return the cached height of the post, or 500 if it is not yet set
    // TODO: replace 500 with the actual max height of a post
    return posts?.[index]?.renderedHeight ?? 500;
};

export const getPostOffset = (posts, index) => {
    let offset = 0;
    for (let c = 0; c < index; c++) {
        offset += getPostHeight(posts, c);
    }
    return offset;
};

export const decodeHtmlEntities = (str) => {
    return (str
            ?.replace(/&#(\d+);/g, (match, dec) => {
                return String.fromCharCode(dec);
            }))
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, '\'')
            .replace(/&amp;/g, '&')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
        ?? '';
};
