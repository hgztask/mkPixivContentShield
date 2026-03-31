import elUtil from "../utils/elUtil";
import urlUtil from "../utils/urlUtil";
import shielding from "../shieldingModel/shielding";
import {IntervalExecutor} from "../model/IntervalExecutor";
import pageCommon from "./pageCommon";

//获取评论列表
const getCommentList = async (): Promise<CommentType[]> => {
    const els = await elUtil.findElements('section ul[class^="CommentList"]>li')
    const list: CommentType[] = []
    for (const el of els) {
        const userAEl: HTMLAreaElement = el.querySelector('a[href^="/users/"]')!
        const insertionPositionEl = el.querySelector('div[class^="Comment_commentActionContainer"]')
        const commentEl = el.querySelector('p');
        let comment = null;
        const userName = userAEl.getAttribute('data-user_name')!
        const userUrl = userAEl.href
        const userId = urlUtil.getUrlUid(userUrl)
        if (commentEl) {
            comment = commentEl.textContent.trim()
        }
        if (insertionPositionEl === null) {
            console.error('未找到插入位置元素', el);
            continue
        }
        list.push({comment, insertionPositionEl, userName, userId, el, userUrl})
    }
    return list
}

//作品展示页
export default {
    //是否是作品展示页
    isThisPage(url: string) {
        return url.includes('//www.pixiv.net/artworks/')
    },
    //间隔检查评论列表
    intervalCheckCommentListExecutor: new IntervalExecutor(async () => {
        const list = await getCommentList();
        shielding.shieldingItemDecorated(list)
    }, {processTips: true, intervalName: '作品展示页-评论列表'}),
    //获取作者信息
    getAuthorInfo() {
        const el = document.querySelector('aside>section a[href^="/users"]>div[title]')
        if (el === null) return null;
        const userAEl = el.parentElement as HTMLAreaElement;
        const userName = el.getAttribute('title') as string;
        const userUrl = userAEl.href;
        const userId = urlUtil.getUrlUid(userUrl);
        return {userName, userUrl, userId}
    }, /**
     * 定时检查作品展示页底下的相关作品列表
     */
    intervalIllustrationListExecutor: new IntervalExecutor(async () => {
        const sectionEl = await elUtil.getSectionLabel('h2', '相关作品')
        const list = await pageCommon.getAListOfWorks('ul>li', false, sectionEl)
        shielding.shieldingItemDecorated(list);
    }, {processTips: true, intervalName: '作品展示页·相关作品列表'})
}