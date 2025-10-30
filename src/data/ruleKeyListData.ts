import ruleKeyDataList from '../res/ruleKVDataList.json'

//获取选项
const getSelectOptions = () => {
    const options = [
        {
            value: '模糊匹配',
            label: '模糊匹配',
            children: [] as any[]
        },
        {
            value: '正则匹配',
            label: '正则匹配',
            children: [] as any[]
        },
        {
            value: '精确匹配',
            label: '精确匹配',
            children: [] as any[]
        }
    ]
    for (const {name, key, pattern, fullName} of ruleKeyDataList) {
        const items = {value: key, label: name, pattern, fullName};
        switch (pattern) {
            case '模糊':
                options[0].children.push(items)
                break;
            case '正则':
                options[1].children.push(items)
                break;
            case '精确':
                options[2].children.push(items)
                break;
        }
    }
    return options
}

/**
 * 获取规则key列表，只获取key，不获取value
 * @returns {string[]} key列表，数组里每一项为key
 */
const getRuleKeyList = (): string[] => {
    return ruleKeyDataList.map(item => {
        return item.key
    })
}


export default {
    getSelectOptions, getRuleKeyList
}


