//用户页面
import urlUtil from "../utils/urlUtil";

export default {
    //获取用户信息
    getUserInfo(): { userName: string, userUrl: string, userId: number } | null {
        const nameEl = document.querySelector('h1.sc-1740e64f-5');
        if (nameEl === null) {
            return null;
        }
        const userUrl = location.href;
        const userId = urlUtil.getUrlUid(userUrl);
        return {userName: nameEl.textContent, userId, userUrl}
    },
    isThisPage(url: string) {
        return url.includes('//www.pixiv.net/users/')
    }
}