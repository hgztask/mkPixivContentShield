import ruleMatchingUtil from "../utils/ruleMatchingUtil";
import {returnTempVal} from "../data/globalValue";
import {eventEmitter} from "../model/EventEmitter";

type blockExactAndFuzzyMatchingType = {
    //精确匹配规则在存储中的键名
    exactKey?: string,
    //精确匹配类型的显示名称
    exactTypeName?: string,
    //精确匹配规则数组（可选，若未提供则通过exactKey从存储获取）
    exactRuleArr?: string[] | number[],
    //模糊匹配规则在存储中的键名
    fuzzyKey?: string,
    //模糊匹配类型的显示名称
    fuzzyTypeName?: string,
    //模糊匹配规则数组（可选，若未提供则通过fuzzyKey从存储获取）
    fuzzyRuleArr?: string[],
    //正则匹配规则在存储中的键名
    regexKey?: string,
    //正则匹配类型的显示名称
    regexTypeName?: string,
    //正则匹配规则数组（可选，若未提供则通过regexKey从存储获取）
    regexRuleArr?: string[]
}

/**
 * 执行精确、模糊和正则匹配的通用屏蔽检查函数
 * 根据提供的配置项依次执行三种类型的匹配检查，优先级为：精确 > 模糊 > 正则
 * @param val {string} 待匹配的字符串值
 * @param config {blockExactAndFuzzyMatchingType} 配置项对象
 * @returns {DefReturnTempValType}
 *          匹配成功返回包含状态、匹配类型和匹配值的对象；
 *          无匹配时返回returnTempVal（预定义的默认返回值对象）
 */
const blockExactAndFuzzyMatching = (val: string, config: blockExactAndFuzzyMatchingType): DefReturnTempValType => {
    if (!val) return returnTempVal
    const {
        exactKey, exactTypeName, fuzzyKey, fuzzyTypeName,
        regexKey, regexTypeName
    } = config;
    let matching;
    if (exactKey) {
        if (ruleMatchingUtil.exactMatch(GM_getValue(exactKey, []), val)) {
            return {state: true, type: exactTypeName, matching: val}
        }
    }
    if (fuzzyKey) {
        matching = ruleMatchingUtil.fuzzyMatch(GM_getValue(fuzzyKey, []), val);
        if (matching) {
            return {state: true, type: fuzzyTypeName, matching}
        }
    }
    if (regexKey) {
        matching = ruleMatchingUtil.regexMatch(GM_getValue(regexKey, []), val);
        if (matching) {
            return {state: true, type: regexTypeName, matching}
        }
    }
    return returnTempVal
}

//根据用户名检查屏蔽
export const blockUserName = (name: string) => {
    return blockExactAndFuzzyMatching(name, {
        exactKey: 'username_precise', exactTypeName: '精确用户名', fuzzyKey: 'username', fuzzyTypeName: '模糊用户名',
        regexKey: 'username_regex', regexTypeName: '正则用户名'
    })
}

//根据用户id检查屏蔽
export const blockUserId = (id: number) => {
    if (ruleMatchingUtil.exactMatch(GM_getValue('userId_precise', []), id)) {
        return {state: true, type: '精确用户id', matching: id};
    }
    return returnTempVal;
}


const shieldingItem = (itemData: SelectedNewWorkType): DefReturnTempValType => {
    let res = blockUserId(itemData.userId);
    if (res.state) return res;
    const {userName} = itemData;
    if (userName) {
        res = blockUserName(userName);
    }
    if (res.state) return res;
    if (res.state) return res;
    return returnTempVal
}

const shieldingItemDecorated = (list: SelectedNewWorkType[]) => {
    for (const itemData of list) {
        const testResults = shieldingItem(itemData)
        const {state, type, matching} = testResults;
        if (state) {
            const {el, userName} = itemData;
            el.remove();
            eventEmitter.send('event:print-msg', `${type}规则【${matching}】屏蔽${userName}作品`)
            continue;
        }
        eventEmitter.emit('event:插入屏蔽按钮', itemData);
    }
}

eventEmitter.on('event:插入屏蔽按钮', (itemData: SelectedNewWorkType) => {
    const {insertionPositionEl, el} = itemData;
    let but: HTMLButtonElement | null = el.querySelector('button[gz_type]');
    if (but !== null) return;
    but = document.createElement('button')
    but.setAttribute('gz_type', '');
    but.textContent = '屏蔽';
    but.addEventListener('click', (event) => {
        event.stopImmediatePropagation(); // 阻止事件冒泡和同一元素上的其他事件处理器
        event.preventDefault(); // 阻止默认行为
        if (__DEV__) {
            console.log('点击了屏蔽按钮', itemData);
        }
        eventEmitter.emit('event:mask_options_dialog_box', itemData)
    })
    insertionPositionEl.appendChild(but);
    //当没有显隐主体元素，则主动隐藏，不添加鼠标经过显示移开隐藏事件
    let explicitSubjectEl = itemData?.explicitSubjectEl;
    if (explicitSubjectEl === undefined) {
        explicitSubjectEl = el;
    }
    if (insertionPositionEl) {
        but.style.display = "none";
        explicitSubjectEl.addEventListener("mouseout", () => but.style.display = "none");
        explicitSubjectEl.addEventListener("mouseover", () => but.style.display = "");
    }
});


export default {
    shieldingItem, shieldingItemDecorated
}