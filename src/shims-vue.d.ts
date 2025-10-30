declare const __DEV__: boolean;

declare module '*.vue' {
    export default Vue;
}

// 在custom.d.ts中添加
declare module "*.css" {
    const content: string;
    export default content;
}

interface Window {
    mk_win,
    getListData,
    getAListOfWorks,
    parseUrl,
    getWorksList
}

interface SelectedNewWorkType {
    //作品链接
    userName: string | null,
    userUrl: string,
    userId: number,
    tags?: string[]
    insertionPositionEl: Element,
    explicitSubjectEl?: Element,
    el: Element
}

interface CommentType extends SelectedNewWorkType {
    comment: string | null
}


interface DefReturnTempValType {
    state: boolean,
    type?: string,
    matching?: string | number
}

type outputInfoType = {
    msg: string,
    data: any,
    showTime?: string
}


type ruleKeyDataListItemType = {
    name: string,
    key: string,
    pattern: string,
    fullName: string,
    len?: number
}