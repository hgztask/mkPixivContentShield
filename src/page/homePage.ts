import elUtil from "../utils/elUtil";
import urlUtil from "../utils/urlUtil";
import shielding from "../shieldingModel/shielding";
import pageCommon from "./pageCommon";
import {IntervalExecutor} from "../model/IntervalExecutor";


//获取首页下方的推荐作品列表
const getHomeBelowRecommendWorksList = async (): Promise<SelectedNewWorkType[]> => {
    const els = await elUtil.findElements('.flex.flex-col.items-center[data-ga4-label="home_recommend"]>.w-full')
    const list: SelectedNewWorkType[] = []
    for (let el of els) {
        if (el.className.includes('bg-background')) {
            continue;
        }
        const dataGa4Label = el.getAttribute('data-ga4-label');
        if (dataGa4Label === 'ranking_content') {
            //跳过排行榜大幅
            continue;
        }
        const itemsCenterDiv: HTMLDivElement = el.querySelector('.items-center[data-cr-label]')!;
        const userAEl: HTMLAreaElement = itemsCenterDiv.querySelector('div[title]>a[href^="/users/"]')!;
        const insertionPositionEl = userAEl.parentElement!;
        //如果是短片小说的话url为/novel/show.php?id=的小说类型而非插画链接
        const userName = userAEl.textContent.trim();
        const userUrl = userAEl.href;
        const userId = urlUtil.getUrlUid(userUrl);
        list.push({userName, userUrl, userId, el, insertionPositionEl})
    }
    return list
}

//首页模块
export default {
    //首页
    isHomeThisPage(url: string) {
        return url === 'https://www.pixiv.net/';
    },
    //首页中的子页面漫画页
    isHomeMangaThisPage(url: string) {
        return url.endsWith('//www.pixiv.net/manga')
    },
    //首页中的子页面插画页
    isHomeIllustrationThisPage(url: string) {
        return url.endsWith('//www.pixiv.net/illustration')
    },
    //检查首页子页面插画推荐列表
    async checkHomeRecommendIllustrationList() {
        const list = await pageCommon.getAListOfWorks('.eqqsVu.fuIUpJ')
        shielding.shieldingItemDecorated(list);
    },
    //间隔检查精选新作列表
    intervalHomeWorksListExecutor: new IntervalExecutor(() => {
        //精选新作列表和该项下方的推荐作品
        const selector = 'li.p-0.list-none.overflow-hidden.col-span-2,li[data-ga4-label="thumbnail"]';
        const els = document.querySelectorAll(selector)
        const list: SelectedNewWorkType[] = []
        for (let el of els) {
            const userAEl: HTMLAreaElement = el.querySelector('a[data-ga4-label="user_name_link"]')!;
            const userName = userAEl.textContent.trim();
            const userUrl = userAEl.href;
            const userId = urlUtil.getUrlUid(userUrl);
            const insertionPositionEl = el.querySelector('div[aria-haspopup]')!
            list.push({userName, userUrl, userId, insertionPositionEl, el})
        }
        shielding.shieldingItemDecorated(list)
    }, {processTips: true, intervalName: '精选新作列表'}),
    //检查首页下wards推荐作品列表
    async checkHomeBelowRecommendWorksList() {
        const list = await getHomeBelowRecommendWorksList()
        shielding.shieldingItemDecorated(list);
    }
}