export function callApi(instance, route, method, data, additionalHeaders = {}) {
    const request = {
        'method': method,
        'headers': {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            ...additionalHeaders,
        },
    };

    if (data) {
        request.body = JSON.stringify(data);
    }

    return fetch(
        instance + route,
        request,
    ).then((result) => {
        if (result.ok) {
            return result.json();
        } else {
            return Promise.reject(result);
        }
    });
}

export function callAuthenticated(instance, route, method, token, data, additionalHeaders = {}) {
    const headers = {Authorization: token, ...additionalHeaders};
    return callApi(instance, route, method, data, headers);
}
