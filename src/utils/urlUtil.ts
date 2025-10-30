export default {
    // 获取url中用户id
    getUrlUid(url: string): number {
        const match = url.match(/^https:\/\/www.pixiv.net\/users\/(\d+)/)?.[1];
        if (match === undefined) {
            return -1
        }
        return parseInt(match)
    },
    /**
     * 解析 URL
     * @param urlString 要解析的 URL 字符串
     */
    parseUrl(urlString: string) {
        // 创建一个新的 URL 对象
        const url = new URL(urlString);
        // 提取路径部分并分割成数组
        const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
        // 使用 URLSearchParams 来解析查询参数
        const searchParams = new URLSearchParams(url.search.slice(1));
        const queryParams: { [key: string]: string } = {};
        for (const [key, value] of searchParams.entries()) {
            queryParams[key] = value;
        }
        return {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            pathSegments,
            search: url.search,
            queryParams,
            hash: url.hash
        };
    }

}