export default {
    //获取抽屉快捷键
    getDrawerShortcutKeyGm() {
        return GM_getValue('drawer_shortcut_key_gm', '`')
    },
    //获取屏蔽按钮垂直内边距
    getShieldButtonPaddingGm() {
        return GM_getValue('shield_button_padding_gm', 10)
    }
}