import {IntervalExecutor} from "../model/IntervalExecutor";
import elUtil from "../utils/elUtil";
import urlUtil from "../utils/urlUtil";
import shielding from "../shieldingModel/shielding";

export default {
    isUrlPage(url: string) {
        return url.includes("https://www.pixiv.net/cate_r18.php");
    },
    //间隔检查插画列表
    intervalIllustrationListExecutor: new IntervalExecutor(() => {
        const elList = []
        for (let el of elUtil.xpathEls('//div[text()="每日排行榜"]/parent::section//ul/div[node()]')) {
            elList.push(el)
        }
        for (let el of elUtil.xpathEls('//h2[text()="本站的最新作品" or text()="插画约稿作品"]/ancestor::section//ul/div[node()]')) {
            elList.push(el)
        }
        const dataList = elList.map((el) => {
            const userEl = el.querySelector('div+a[href^="/users/"]') as HTMLAreaElement;
            const userName = userEl.textContent.trim();
            const userUrl = userEl.href;
            const userId = urlUtil.getUrlUid(userUrl);
            return {
                el, userName, userUrl, userId, insertionPositionEl: userEl.parentElement!
            }
        })

        shielding.shieldingItemDecorated(dataList);
    }, {
        intervalName: "r18插画列表",
        processTips: true
    })
}