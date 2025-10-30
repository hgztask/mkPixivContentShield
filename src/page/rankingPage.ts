import urlUtil from "../utils/urlUtil";
import {IntervalExecutor} from "../model/IntervalExecutor";
import shielding from "../shieldingModel/shielding";

const getWorksList = () => {
    const els = document.querySelectorAll('div.ranking-items>section')
    const list: SelectedNewWorkType[] = [];
    for (const el of els) {
        const userAEl = el.querySelector('a[href^="/users/"][data-user_name]') as HTMLAreaElement;
        const userName = userAEl.getAttribute('data-user_name') as string;
        const userUrl = userAEl.href;
        const userId = urlUtil.getUrlUid(userUrl);
        list.push({insertionPositionEl: userAEl, el, userName, userUrl, userId})
    }
    const novelEls = document.querySelectorAll('section._ranking-items>._ranking-item')
    for (const el of novelEls) {
        const userAEl = el.querySelector('a[href^="/users/"]') as HTMLAreaElement;
        const userName = userAEl.getAttribute('data-user_name') as string;
        const userUrl = userAEl.href;
        const userId = urlUtil.getUrlUid(userUrl);
        list.push({insertionPositionEl: userAEl.parentElement!, el, userName, userUrl, userId})
    }
    return list;
}

window.getWorksList = getWorksList;

export default {
    isThisPage(url: string) {
        return url.includes('//www.pixiv.net/ranking.php') || url.includes('//www.pixiv.net/novel/ranking.php')
    },
    //间隔检查排行榜作品列表
    intervalCheckRankingWorksListExecutor: new IntervalExecutor(async () => {
        const list = getWorksList();
        shielding.shieldingItemDecorated(list)
    }, {processTips: true, intervalName: '排行榜作品列表'})
}