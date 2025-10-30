import {eventEmitter} from "./EventEmitter";
import ruleUtil from "../utils/ruleUtil";

eventEmitter.on('event:mask_options_dialog_box', (data: SelectedNewWorkType) => {
    const {userId, userName} = data;
    const showList = []
    if (userId) {
        showList.push({label: `用户id精确屏蔽=${userId}`, value: 'userId_precise'})
    }
    if (userName) {
        showList.push({label: `用户名精确屏蔽=${userName}`, value: 'username_precise'});
    }
    eventEmitter.send('sheet-dialog', {
        title: "屏蔽选项",
        list: showList,
        optionsClick: (item: { label: string, value: string }) => {
            const {value} = item
            let results
            if (value === 'userId_precise') {
                results = ruleUtil.addRule(userId, value);
            } else if (value === 'username_precise') {
                results = ruleUtil.addRule(userName as string, value);
            } else {
                eventEmitter.send('el-msg', "出现意外的选项值");
                return
            }
            if (results) {
                eventEmitter.emit('el-msg', results.res)
                    .emit('event:刷新规则信息', false)
            }
        }
    })
})
