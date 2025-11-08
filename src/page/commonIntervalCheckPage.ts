import shielding from "../shieldingModel/shielding";
import {IntervalExecutor} from "../model/IntervalExecutor";
import pageCommon from "./pageCommon";

const selectors = [
    'ul>li.sc-9a31d d94-0',
//编辑部的推荐作品页·是小说类
    'ul>li.sc-f59b1b7b-8',
//为小说页原创热门作品栏右侧查看全部按钮跳转过后的按分类推荐的小说页的列表
    'ul>li.sc-fec4147b-4',
    'ul>li.sc-9111aad9-0',
    'sc-1453b7f5-2.dvNJyE'
];

const selector = selectors.join(',');

//通用间隔检查页模块
export default {
    //是否通用间隔检查页
    isCommonIntervalCheckPage(url: string) {
        return this.isThisPage(url) ||
            //是否是发现小说页或发现页面
            url.includes('www.pixiv.net/novel/discovery') || url.includes('www.pixiv.net/discovery') ||
            //是否是大家的新作页面侧边栏有时显示的是本站的最新作品
            url.includes('//www.pixiv.net/new_illust.php') || url.endsWith('//www.pixiv.net/novel/new.php') ||
            //是否是小说编辑部推荐页面
            url.includes('//www.pixiv.net/novel/editors_picks') ||
            //是否是分类小说页
            url.includes('//www.pixiv.net/genre/novel') ||
            //是否是约稿页面
            url.includes('//www.pixiv.net/request') ||
            //是否是用户企划页面
            url.includes('//www.pixiv.net/user_event.php')
    },
    //判断是否是小说页面
    isThisPage(url: string) {
        return url.endsWith('//www.pixiv.net/novel')
    },
    /**
     * 间隔检查部分页面的列表
     * 作用小说页面和发现页小说页面、编辑部的推荐作品页·小说类、大家的新作插画和漫画、约稿页面的列表
     * 分类小说页的列表
     * 不包括小说页正在举办的比赛
     */
    intervalCheckTheListOfSomePagesListExecutor: new IntervalExecutor(async () => {
        const list = await pageCommon.getListData(
            selector, false)
        shielding.shieldingItemDecorated(list)
    }, {processTips: true, intervalName: '部分页面列表'})
}