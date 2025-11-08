import elUtil from "../utils/elUtil";
import urlUtil from "../utils/urlUtil";
import {IntervalExecutor} from "../model/IntervalExecutor";
import shielding from "../shieldingModel/shielding";

window.parseUrl = urlUtil.parseUrl;
/**
 * 获取插画列表
 * @param selector 选择器
 * @param intervalFind 是否间隔检查
 * @param doc 从哪个元素对象开始查找，默认为document
 */
const getAListOfWorks = async (selector: string, intervalFind: boolean = true, doc: Element | Document = document) => {
    let els
    if (intervalFind) {
        els = await elUtil.findElements(selector)
    } else {
        els = doc.querySelectorAll(selector);
    }
    const list: SelectedNewWorkType[] = []
    for (let el of els) {
        const userAel: HTMLAreaElement | null = el.querySelector('div[aria-haspopup]>a[href^="/users/"]')
        if (userAel === null) continue
        let userName;
        const userNameEl: Element | null = userAel.lastElementChild;
        if (userNameEl !== null) {
            userName = userNameEl.getAttribute('title');
        } else {
            userName = userAel.textContent.trim();
        }

        const userUrl = userAel.href
        const userId = urlUtil.getUrlUid(userUrl)
        list.push({insertionPositionEl: userAel.parentElement!, userName, userUrl, userId, el})
    }
    return list;
}

window.getAListOfWorks = getAListOfWorks;

/**
 * 获取列表数据
 * @param selector 选择器
 * @param intervalFind 是否间隔检查
 * @returns Promise<SelectedNewWorkType[]> 列表数据，包括用户名，用户id，用户链接，插入位置元素，元素本身
 */
const getListData = async (selector: string, intervalFind: boolean = true): Promise<SelectedNewWorkType[]> => {
    let els
    if (intervalFind) {
        els = await elUtil.findElements(selector)
    } else {
        els = document.querySelectorAll(selector)
    }
    const list: SelectedNewWorkType[] = []
    for (const el of els) {
        const userAEl: HTMLAreaElement = el.querySelector('a[href^="/users/"][data-ga4-label="user_name_link"]')!
        const userName = userAEl.textContent.trim()
        const userUrl = userAEl.href
        const userId = urlUtil.getUrlUid(userUrl)
        list.push({userName, userId, el, userUrl, insertionPositionEl: userAEl.parentElement!})
    }
    return list
}

window.getListData = getListData;


//获取约稿作品列表-插画、漫画、小说
const getListOfRequestedWorks = async (): Promise<SelectedNewWorkType[]> => {
    //这里的选择器，前一段是原先的选择器，后一段是用于新的情况匹配的选择器
    const els = await elUtil.findElements('.sc-1453b7f5-2.dvNJyE,.sc-9ce51bf9-2.hDpden')
    const list: SelectedNewWorkType[] = []
    for (let el of els) {
        const userAEl: HTMLAreaElement | null = el.querySelector('a[href^="/users/"][data-ga4-label="user_name_link"]')
        const tagEls = el.querySelectorAll('a[href^="/tags/"]')!
        let userName = null;
        if (userAEl) {
            userName = userAEl.textContent.trim()
        } else {
            continue
        }
        const userUrl = userAEl.href
        const userId = urlUtil.getUrlUid(userUrl)
        const tags: string[] = []
        for (const tagEl of tagEls) {
            tags.push(tagEl.textContent.trim())
        }
        list.push({insertionPositionEl: userAEl.parentElement!, userName, userUrl, userId, tags, el})
    }
    return list
}


//间隔检查约稿作品列表-插画、漫画、小说
const intervalListOfRequestedWorksExecutor = new IntervalExecutor(async () => {
    const list = await getListOfRequestedWorks()
    shielding.shieldingItemDecorated(list);
}, {processTips: true, intervalName: '约稿列表'})


export default {
    getAListOfWorks, intervalListOfRequestedWorksExecutor, getListData
}