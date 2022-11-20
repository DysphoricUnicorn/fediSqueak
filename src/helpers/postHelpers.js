import {callAuthenticated} from './apiHelper';

/**
 * Return the cached height of the post, or 500 if it is not yet set
 * TODO: replace 500 with the actual max height of a post
 * @param {Array<Object>} posts
 * @param {number} index
 * @returns {number}
 */
export const getPostHeight = (posts, index) => {
    return posts?.[index]?.renderedHeight ?? 500;
};

/**
 * Get a post's offset from the top of the timeline
 * @param {Array<Object>} posts
 * @param {number} index
 * @returns {number}
 */
export const getPostOffset = (posts, index) => {
    let offset = 0;
    for (let c = 0; c < index; c++) {
        offset += getPostHeight(posts, c);
    }
    return offset;
};

/**
 * Returns the index of the last post before the specified offset as well as the difference between that post's offset and the specified one
 * @param {Array<Object>} posts
 * @param {number} offset
 * @returns {(number|number)[]}
 */
export const findPostByOffset = (posts, offset) => {
    let calculatedOffset = 0;
    let lastOffset = 0;
    let index = 0;
    while (calculatedOffset < offset && posts[index]) {
        lastOffset = calculatedOffset;
        calculatedOffset += getPostHeight(posts, index);
        index++;
    }
    return [index, offset - lastOffset];
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

export const updatePost = (updatedPost, direct = false, setPosts, mainPost, hideNonExistWarning = false) => {
    setPosts((oldPosts) => {
        const id = oldPosts.findIndex(oldPost => oldPost.id === mainPost.id);
        if (id === -1) {
            if (!hideNonExistWarning) {
                console.warn('Interacted with post that does not seem to exist');
            }
            return oldPosts;
        }

        const newPosts = [...oldPosts];
        if (!direct && mainPost.reblog) {
            newPosts[id].reblog = updatedPost;
        } else {
            newPosts[id] = updatedPost;
        }
        return newPosts;
    });
};

export const handleFavouriteClick = (setPosts, oauthToken, instanceInfo, readPost, mainPost, favourited, setFavourited, hideNonExistWarning = false) => {
    if (favourited === false) {
        setFavourited(true);
        callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + readPost.id + '/favourite', 'POST', oauthToken, hideNonExistWarning)
            .then((updatedPost) => updatePost(updatedPost, false, setPosts, mainPost, hideNonExistWarning))
            .catch((reason) => {
                setFavourited(false);
                console.error('Could not favourite post', reason);
            });
    } else {
        setFavourited(false);
        callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + readPost.id + '/unfavourite', 'POST', oauthToken, hideNonExistWarning)
            .then((updatedPost) => updatePost(updatedPost, false, setPosts, mainPost, hideNonExistWarning))
            .catch((reason) => {
                    setFavourited(true);
                    console.error('Could not unfavourite post', reason);
                },
            );
    }
};

export const handleReblogClick = (setPosts, oauthToken, instanceInfo, readPost, mainPost, reblogged, setReblogged, hideNonExistWarning = false) => {
    if (reblogged === false) {
        setReblogged(true);
        callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + readPost.id + '/reblog', 'POST', oauthToken, hideNonExistWarning)
            .then((updatedPost) => updatePost(updatedPost.reblog, false, setPosts, mainPost, hideNonExistWarning))
            .catch((reason) => {
                setReblogged(false);
                console.error('Could not reblog post', reason);
            });
    } else {
        setReblogged(false);
        callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + readPost.id + '/unreblog', 'POST', oauthToken, hideNonExistWarning)
            .then((updatedPost) => updatePost(updatedPost.reblog, false, setPosts, mainPost, hideNonExistWarning))
            .catch((reason) => {
                setReblogged(true);
                console.error('Could not unreblog post', reason);
            });
    }
};
