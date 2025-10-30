//获取抽屉快捷键
export const getDrawerShortcutKeyGm = () => {
    return GM_getValue('drawer_shortcut_key_gm', '`')
}