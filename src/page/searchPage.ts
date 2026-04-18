import urlUtil from "../utils/urlUtil";
import {IntervalExecutor} from "../model/IntervalExecutor";
import shielding from "../shieldingModel/shielding";


export default {
    /**
     * 判断是否是搜索页
     * 其中s_mode=tag时可能插画或漫画，tag_tc时为小说，s_usr为用户
     * @param url
     */
    isUrlPage(url: string) {
        if (!url.includes('https://www.pixiv.net/search?')) {
            return false
        }
        const {queryParams: {s_mode = null}} = urlUtil.parseUrl(url);
        if (s_mode === null) {
            return false
        }
        return s_mode === 'tag' || s_mode === "tag_tc"
    },
    //定时搜索页检查插画、漫画和小说列表
    intervalSearchContentListExecutor: new IntervalExecutor(async () => {
        const elList = document.querySelectorAll('div>div[data-ga4-entity-id^="illust/"],div>div[data-ga4-entity-id^="novel/"]');
        const dataList = []
        for (let el of elList) {
            const userEl = el.querySelector('div+a[href^="/users/"]') as HTMLAreaElement;
            const userName = userEl.textContent.trim();
            const userUrl = userEl.href;
            const userId = urlUtil.getUrlUid(userUrl);
            dataList.push({
                el, userName, userUrl, userId, insertionPositionEl: userEl.parentElement!
            })
        }
        shielding.shieldingItemDecorated(dataList);
    }, {
        intervalName: "搜索页插画和漫画列表",
        processTips: true
    })
}