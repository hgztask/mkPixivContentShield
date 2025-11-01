import './menu'
import "./layout_init";
import router from './router'
import watch from './watch/watch'
import './model/maskOptionsDialogBox'
import defaultStyle from './css/def.css';
import gzStyle from './css/gz-style.css'
import elUtil from "./utils/elUtil";

window.addEventListener('load', () => {
    console.log('页面加载完成');
    watch.addEventListenerScroll();
})

//页面元素加载完成
window.addEventListener('DOMContentLoaded', () => {
    console.log('页面元素加载完成');
    router.staticRoute(document.title, window.location.href);
    watch.addEventListenerUrlChange((newUrl: string, oldUrl: string, title: string) => {
        router.dynamicRouting(title, newUrl);
    })
    GM_addStyle(defaultStyle)
    GM_addStyle(gzStyle)
    elUtil.updateCssVModal();
})