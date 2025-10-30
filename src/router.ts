import homePage from "./page/homePage";
import illustrationAndMangaCommon from "./page/illustrationAndMangaCommon";
import commonIntervalCheckPage from "./page/commonIntervalCheckPage";
import pageCommon from "./page/pageCommon";
import discoveryUsersPage from "./page/discoveryUsersPage";
import tagTopPage from "./page/tagTopPage";
import artworksPage from "./page/artworksPage";
import {eventEmitter} from "./model/EventEmitter";
import rankingPage from "./page/rankingPage";
import usersPage from "./page/usersPage";

export default {
    /**
     * 静态路由
     * @param title {string} 标题
     * @param url {string} url地址
     */
    staticRoute(title: string, url: string) {
        console.log("静态路由", title, url)
        if (homePage.isHomeThisPage(url)) {
            homePage.intervalHomeWorksListExecutor.start();
            homePage.checkHomeBelowRecommendWorksList();
        }
        const urlIsIllustratedMangaPage = homePage.isHomeIllustrationThisPage(url) || homePage.isHomeMangaThisPage(url);
        const urlIsNovelPage = commonIntervalCheckPage.isThisPage(url);
        if (urlIsIllustratedMangaPage || urlIsNovelPage) {
            pageCommon.intervalListOfRequestedWorksExecutor.start();
        }
        if (urlIsIllustratedMangaPage) {
            illustrationAndMangaCommon.intervalIllustrationListExecutor.start();
        }
        if (homePage.isHomeIllustrationThisPage(url)) {
            homePage.checkHomeRecommendIllustrationList()
        }
        if (commonIntervalCheckPage.isCommonIntervalCheckPage(url)) {
            commonIntervalCheckPage.intervalCheckTheListOfSomePagesListExecutor.start();
        }
        if (discoveryUsersPage.isThisPage(url)) {
            discoveryUsersPage.intervalRecommendedUsersListExecutor.start();
        }
        const isUrlArtWorksPage = artworksPage.isThisPage(url);
        if (tagTopPage.isThisPage(url) || isUrlArtWorksPage) {
            tagTopPage.intervalIllustrationListExecutor.start();
        }
        if (isUrlArtWorksPage) {
            artworksPage.intervalCheckCommentListExecutor.start()
        }
        if (usersPage.isThisPage(url) || isUrlArtWorksPage) {
            eventEmitter.emit('event:right_sidebar_show', true);
        }
        if (tagTopPage.isSearchUserPage(url)) {
            tagTopPage.checkTagUserList();
        }
        if (rankingPage.isThisPage(url)) {
            rankingPage.intervalCheckRankingWorksListExecutor.start();
        }
    },
    /**
     * 动态路由
     * @param title {string} 标题
     * @param url {string} url地址
     */
    dynamicRouting(title: string, url: string) {
        console.log("动态路由", title, url);
        if (homePage.isHomeThisPage(url)) {
            homePage.intervalHomeWorksListExecutor.start();
            homePage.checkHomeBelowRecommendWorksList();
        } else {
            homePage.intervalHomeWorksListExecutor.stop();
        }
        const urlIsIllustratedMangaPage = homePage.isHomeIllustrationThisPage(url) || homePage.isHomeMangaThisPage(url);
        if (commonIntervalCheckPage.isThisPage(url) || urlIsIllustratedMangaPage) {
            pageCommon.intervalListOfRequestedWorksExecutor.start();
        } else {
            pageCommon.intervalListOfRequestedWorksExecutor.stop();
        }
        if (urlIsIllustratedMangaPage) {
            illustrationAndMangaCommon.intervalIllustrationListExecutor.start();
        } else {
            illustrationAndMangaCommon.intervalIllustrationListExecutor.stop();
        }
        if (homePage.isHomeIllustrationThisPage(url)) {
            homePage.checkHomeRecommendIllustrationList()
        }
        if (commonIntervalCheckPage.isCommonIntervalCheckPage(url)) {
            commonIntervalCheckPage.intervalCheckTheListOfSomePagesListExecutor.start();
        } else {
            commonIntervalCheckPage.intervalCheckTheListOfSomePagesListExecutor.stop();
        }
        if (discoveryUsersPage.isThisPage(url)) {
            discoveryUsersPage.intervalRecommendedUsersListExecutor.start();
        } else {
            discoveryUsersPage.intervalRecommendedUsersListExecutor.stop();
        }
        if (tagTopPage.isThisPage(url)) {
            tagTopPage.intervalIllustrationListExecutor.start();
        } else {
            tagTopPage.intervalIllustrationListExecutor.stop();
        }
        if (tagTopPage.isSearchUserPage(url)) {
            tagTopPage.checkTagUserList();
        }
        const isArtWorksPage = artworksPage.isThisPage(url);
        eventEmitter.emit('event:right_sidebar_show', isArtWorksPage || usersPage.isThisPage(url));
        if (isArtWorksPage) {
            artworksPage.intervalCheckCommentListExecutor.start()
        } else {
            artworksPage.intervalCheckCommentListExecutor.stop()
        }
    }
}
