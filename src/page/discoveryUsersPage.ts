import {IntervalExecutor} from "../model/IntervalExecutor";
import pageCommon from "./pageCommon";
import shielding from "../shieldingModel/shielding";

//间隔检查推荐用户列表
const intervalRecommendedUsersListExecutor = new IntervalExecutor(async () => {
        const list = await pageCommon.getListData('ul.list-none>li')
        shielding.shieldingItemDecorated(list);
    },
    {processTips: true, intervalName: '发现推荐用户列表'});

//发现页的子页推荐用户页
export default {
    isThisPage(url: string) {
        return url.endsWith('//www.pixiv.net/discovery/users')
    },
    intervalRecommendedUsersListExecutor
}