import defUtil from "../utils/defUtil";
import homePage from "../page/homePage";

export default {
    /**
     * 监听url变化
     * @param callback {function} 回调函数
     */
    addEventListenerUrlChange(callback: (newUrl: string, oldUrl: string, title: string) => void)  {
    let oldUrl = window.location.href;
    setInterval(() => {
        const newUrl = window.location.href;
        if (oldUrl === newUrl) return;
        oldUrl = newUrl;
        const title = document.title;
        callback(newUrl, oldUrl, title)
    }, 1000);
},
    //监听滚动
    addEventListenerScroll() {
        window.addEventListener('scroll', defUtil.debounce(() => {
            const href = location.href;
            if (homePage.isHomeThisPage(href)) {
                homePage.checkHomeBelowRecommendWorksList();
            }
        }));
    }
}
