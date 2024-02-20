const arrayToUrlString = (params: any, key: any, value: any) => {
    let arrayUrl = value.map((item: any) => {
        return `${key}=${item}`
    })
    return arrayUrl.join('&');
}

export const prepareURLEncodedParams = (url: string, params: any) => {
    let paramsArray = Object.keys(params).map((key) => {

        let value;
        if (Array.isArray(params[key])) {
            value = params[key];
        } else {
            value = params[key] ? params[key].toString() : ""
        }

        if (value && value.length) {
            if (Array.isArray(value)) {
                return arrayToUrlString(params, key, value);
            } else {
                return `${key}=${params[key]}`
            }


        }
        else {
            return ""
        }
    }).filter((e) => e.length)

    let paramsURLs = paramsArray.filter((e) => e).join('&');

    if (paramsURLs) {
        return url + '?' + paramsURLs;
    }
    return url;
}