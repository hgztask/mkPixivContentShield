import {IntervalExecutor} from "../model/IntervalExecutor";
import shielding from "../shieldingModel/shielding";
import pageCommon from "./pageCommon";

/**
 * 间隔检查已关注用户、正在举办的比赛和每日排行榜的作品列表
 * 不包括漫画页下的已关注用户作品
 * 漫画页下的推荐作品栏，每日排行榜
 * 这里包括了插画页第一栏已关注用户作品，后续看情况排除掉
 *
 */
const intervalIllustrationListExecutor = new IntervalExecutor(async () => {
    const list = await pageCommon.getAListOfWorks('.sc-e07c5bb9-2.eMLzTs')
    //底部tag插画作品
    const bottomTagIllustrationList = await pageCommon.getAListOfWorks('section ul.gIHHFW>li', false);
    list.push(...bottomTagIllustrationList);
    shielding.shieldingItemDecorated(list);
}, {processTips: true, intervalName: '插画列表'});

export default {
    intervalIllustrationListExecutor
}