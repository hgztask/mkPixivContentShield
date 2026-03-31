import {IntervalExecutor} from "../model/IntervalExecutor";
import pageCommon from "./pageCommon";
import shielding from "../shieldingModel/shielding";
import urlUtil from "../utils/urlUtil";

//检查tag页中的用户页列表
const checkTagUserList = async () => {
    const list = await pageCommon.getListData('div.grid>.list-none')
    shielding.shieldingItemDecorated(list);
}

//符合的item名称
const complyWithItemName = ['illustrations', 'manga', 'novels', 'artworks']

//tag顶部页，类似于搜索页
export default {
    isThisPage(url: string) {
        if (!url.includes('//www.pixiv.net/tags/')) {
            return false;
        }
        const parseUrl = urlUtil.parseUrl(url);
        const pathSegments = parseUrl.pathSegments;
        if (pathSegments.length <= 2) {
            //一般为顶部，例子：https://www.pixiv.net/tags/维吉尔
            return true;
        }
        const tabName = pathSegments[2];
        return complyWithItemName.includes(tabName);
    },
    //tag搜索页中的用户页
    isSearchUserPage(url: string) {
        return url.includes('https://www.pixiv.net/search/users');
    },
    checkTagUserList,
    /**
     * 定时检查tag页面中插画·漫画·小说列表
     */
    intervalIllustrationListExecutor: new IntervalExecutor(async () => {
        const list = await pageCommon.getAListOfWorks('section>div ul>li', false)
        shielding.shieldingItemDecorated(list);
    }, {processTips: true, intervalName: '插画·漫画列表'})
}