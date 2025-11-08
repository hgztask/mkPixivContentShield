import {IntervalExecutor} from "../model/IntervalExecutor";
import shielding from "../shieldingModel/shielding";
import pageCommon from "./pageCommon";
import elUtil from "../utils/elUtil";

/**
 * 获取指定区域元素并给元素添加属性区域元素名
 * 方便定位元素
 * 仅测试适用首页中的插画漫画小说页
 * @param areaName
 */
const getAreaElement = async (areaName: string): Promise<{ areaNameEl: Element, parentEl: Element } | null> => {
    let find = document.querySelector(`[area-name=${areaName}]`);
    if (find) {
        return {areaNameEl: find, parentEl: find.parentElement!}
    }
    const els = await elUtil.findElements('section>div:first-of-type');
    find = els.find(el => el.textContent.includes(areaName)) ?? null;
    if (find === null) {
        return null;
    }
    find.setAttribute('area-name', areaName);
    return {
        areaNameEl: find,
        parentEl: find.parentElement!
    }
}
//首页中插画和漫画的公共模块
export default {
    /**
     * 间隔检查作品列表
     * 不包括已关注用户作品
     * 漫画页下的推荐作品栏，每日排行榜
     * 插画和漫画的、约稿作品
     * 插画页下的瞩目的企划目录、tag的推荐插画作品、正在举办的比赛
     */
    intervalIllustrationListExecutor: new IntervalExecutor(async () => {
        /**
         * 第一段css选择器为旧的css选择器，第二段为新的css选择器
         */
        const list = await pageCommon.getAListOfWorks(
            '.sc-e07c5bb9-2.eMLzTs,.sc-bf8cea3f-2',
            false)

        const dailyRanking = await getAreaElement('每日排行榜');
        if (dailyRanking) {
            list.push(...await pageCommon.getAListOfWorks('ul>div', false, dailyRanking.parentEl))
        }

        shielding.shieldingItemDecorated(list);
    }, {processTips: true, intervalName: '首页插画漫画列表'})
}