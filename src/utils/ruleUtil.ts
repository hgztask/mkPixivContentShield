import {eventEmitter} from "../model/EventEmitter";
import ruleKeyDataList from '../res/ruleKVDataList.json'

/**
 *验证输入框的值
 * @param ruleValue 规则的实际值
 * @param type 类型
 * @returns {{status: boolean, res: string|number}} 返回验证结果
 */
const verificationInputValue = (ruleValue: string | number, type: string):
    { status: boolean, res: string | number } => {
    if (ruleValue === null) return {status: false, res: '内容不能为空'};
    if (type === "userId_precise") {
        ruleValue = parseInt(ruleValue as string);
        if (isNaN(ruleValue)) {
            return {status: false, res: '请输入数字！'};
        }
    } else {
        typeof ruleValue === 'string' && (ruleValue = ruleValue.trim());
    }
    if (ruleValue === '') {
        return {status: false, res: '内容不能为空'};
    }
    return {status: true, res: ruleValue};
}

/**
 * 添加规则
 * @param ruleValue {string|number} 规则的实际值
 * @param type {string} 类型
 */
const addRule = (ruleValue: string | number, type: string) => {
    const verificationRes = verificationInputValue(ruleValue, type);
    if (!verificationRes.status) {
        return verificationRes
    }
    const arr: any[] = GM_getValue(type, []);
    if (arr.includes(verificationRes.res)) {
        return {status: false, res: '已存在此内容'};
    }
    arr.push(verificationRes.res);
    GM_setValue(type, arr);
    return {status: true, res: '添加成功'};
}

/**
 * 删除单个规则值
 * @param type {string}
 * @param value {string|number}
 * @returns {{status: boolean, res: (string|number)}|{res: string, status: boolean}}
 */
const delRule = (type: string, value: string | number): { status: boolean, res: string | number } => {
    const verificationRes = verificationInputValue(value, type);
    if (!verificationRes.status) {
        return verificationRes
    }
    const res = verificationRes.res
    const arr: (string | number)[] = GM_getValue(type, []);
    const indexOf = arr.indexOf(res);
    if (indexOf === -1) {
        return {status: false, res: '不存在此内容'};
    }
    arr.splice(indexOf, 1);
    GM_setValue(type, arr);
    return {status: true, res: "移除成功"}
}

/**
 * 验证规则内容并获取核心的规则
 * @param content {string}
 */
const verificationRuleMap = (content: string): { [key: string]: string } | null => {
    let parse: { [key: string]: string };
    try {
        parse = JSON.parse(content);
    } catch (e) {
        alert('规则内容有误');
        return null;
    }
    const newRule: { [key: string]: string } = {};
    for (const key in parse) {
        if (!Array.isArray(parse[key])) {
            continue;
        }
        if (parse[key].length === 0) {
            continue;
        }
        newRule[key] = parse[key];
    }
    if (Object.keys(newRule).length === 0) {
        alert('规则内容为空');
        return null;
    }
    return newRule;
}

/**
 * 添加规则项
 * @param arr {[]} 要添加的内容数组
 * @param key {string}
 * @param coverage {boolean} 是否覆盖，默认true，如果为false则追加
 */
const addItemRule = (arr: any[], key: string, coverage: boolean = true) => {
    const complianceList = []
    for (let v of arr) {
        const {status, res} = verificationInputValue(v, key)
        if (!status) return {status: false, msg: `内容中有误:${res}`}
        complianceList.push(v)
    }
    if (coverage) {
        GM_setValue(key, complianceList)
        return {status: true, msg: `添加成功-覆盖模式，数量：${complianceList.length}`}
    }
    const oldArr: any[] = GM_getValue(key, []);
    const newList = complianceList.filter(item => !oldArr.includes(item))
    if (newList.length === 0) {
        return {status: false, msg: '内容重复'}
    }
    GM_setValue(key, oldArr.concat(newList))
    return {status: true, msg: '添加成功-追加模式，新增数量：' + newList.length}
}

export default {
    addRule,
    /**
     * 批量添加指定类型
     * @param ruleValues {string[]|number[]}
     * @param type {string}
     * @returns {{successList: [], failList: []}}
     */
    batchAddRule<T>(ruleValues: T[], type: string): { successList: T[], failList: T[] } {
        const successList = [];
        const failList = [];
        const arr: T[] = GM_getValue(type, []);
        //是否是id类型
        const isUidType = type.includes('userId_precise');
        for (let v of ruleValues) {
            if (isUidType) {
                if (typeof v !== 'string' && typeof v !== 'number') {
                    failList.push(v);
                    continue;
                }
                if (Number.isNaN(v)) {
                    failList.push(v);
                    continue;
                }
                if (arr.includes(v)) {
                    failList.push(v);
                    continue;
                }
                arr.push(v);
                successList.push(v); // 保留原始输入到成功列表
            } else {
                if (arr.includes(v)) {
                    failList.push(v);
                    continue;
                }
                arr.push(v);
                successList.push(v);
            }
        }
        if (successList.length > 0) {
            GM_setValue(type, arr);
        }
        return {
            successList,
            failList
        }
    },
    /**
     * 删除规则对话框
     * @param type {string}
     */
    async showDelRuleInput(type: string): Promise<void> {
        let ruleValue;
        try {
            const {value} = await eventEmitter.invoke('el-prompt', '请输入要删除的规则内容', '删除指定规则');
            ruleValue = value
        } catch (e) {
            return
        }
        const {status, res} = delRule(type, ruleValue)
        eventEmitter.send('el-msg', res)
        status && eventEmitter.emit('刷新规则信息', false);
    },
    /**
     *获取本地规则内容
     * @param isToStr {boolean} 是否转为字符串，默认true
     * @param space {number} 缩进
     * @return {string|{[string]: [string|number]}}
     */
    getRuleContent(isToStr: boolean = true, space: number = 0):
        string | { [key: string]: (string | number)[] } {
        const ruleMap: { [key: string]: (string | number)[] } = {};
        for (let ruleKeyListDatum of ruleKeyDataList) {
            const key: string = ruleKeyListDatum.key;
            const data = GM_getValue(key, []);
            if (data.length === 0) continue;
            ruleMap[key] = data;
        }
        if (isToStr) {
            return JSON.stringify(ruleMap, null, space);
        }
        return ruleMap;
    },
    /**
     * 覆盖导入规则
     * @param content {string}
     */
    overwriteImportRules(content: string) {
        const map = verificationRuleMap(content);
        if (map === null) return false;
        for (let key of Object.keys(map)) {
            const arr = map[key];
            GM_setValue(key, arr);
        }
        return true;
    },
    /**
     * 追加导入规则
     * @param content {string}
     */
    appendImportRules(content: string) {
        const map = verificationRuleMap(content);
        if (map === null) return false;
        for (let key of Object.keys(map)) {
            const arr: any[] = GM_getValue(key, []);
            for (let item of map[key]) {
                if (!arr.includes(item)) {
                    arr.push(item);
                }
            }
            GM_setValue(key, arr);
        }
        return true;
    },
    /**
     * 添加精确用户id
     * @param userId {number}
     * @param isTip {boolean} 是否提示，默认true，则默认提示，如果为false则不提示，返回结果
     * @returns {{res: string|number, status: boolean}}
     */
    addRulePreciseUserId(userId: number, isTip: boolean = true):
        { res: string | number, status: boolean } {
        const results = addRule(userId, "userId_precise");
        if (isTip) {
            eventEmitter.send('el-notify', {
                title: '添加精确用户id操作提示',
                message: results.res,
                type: 'success'
            })
            return results
        }
        return results;
    },
    /**
     * 添加精确name
     * @param name {string}
     * @param tip {boolean} 是否提示,默认true，则默认提示，如果为false则不提示，返回结果
     * @returns {{status: boolean, res: string}|null}
     */
    addRulePreciseName(name: string, tip: boolean = true):
        { status: boolean, res: string | number } | null {
        const results = addRule(name, "precise_name");
        if (tip) {
            eventEmitter.send('el-msg', results.res)
        }
        return results;
    },
    /**
     * 删除精确用户id
     * @param userId {number}
     * @param isTip {boolean} 是否提示，默认true，则默认提示，如果为false则不提示，返回结果
     * @returns {{status: boolean, res: string|number}|null}
     */
    delRUlePreciseUserId(userId: number, isTip: boolean = true):
        { status: boolean, res: string | number } | null {
        const results = delRule('userId_precise', userId)
        if (isTip) {
            eventEmitter.send('el-alert', results.res)
            return null
        }
        return results
    },
    /**
     * 查找规则项，返回匹配的值，如果找不到则返回null
     * @param type {string}
     * @param value {string|number}
     * @returns {number|string|null}
     */
    findRuleItemValue(type: string, value: string | number): number | string | null {
        return GM_getValue(type, []).find(item => item === value) || null
    },
    addItemRule,
    /**
     * 批量添加精确用户id项
     * @param userIdArr {number[]} 用户id数组
     * @param isTip {boolean} 是否提示，默认true，则默认提示，如果为false则不提示，返回结果
     * @param coverage {boolean} 是否覆盖，默认true，如果为false则追加
     * @returns {{msg:string, status: boolean}|null|boolean}
     */
    addPreciseUserIdItemRule(userIdArr: number[], isTip: boolean = true, coverage: boolean = true)
        : { status: boolean, msg: string } | null | boolean {
        const {status, msg} = addItemRule(userIdArr, 'userId_precise', coverage)
        if (isTip) {
            eventEmitter.send('el-alert', msg)
            return status
        }
        return {status, msg}
    }
}
