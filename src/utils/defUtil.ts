import Vue from "vue";

export default {
    //防抖函数
    debounce(func: Function, wait: number = 1000) {
        let timeout: any;
        return function (this: any, ...args: any[]) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    /**
     * 返回当前时间
     * @returns {String}
     */
    toTimeString(): string {
        return new Date().toLocaleString();
    },
    initVueApp(el: Element, App: any, props = {}) {
        return new Vue({
            render: h => h(App, {props})
        }).$mount(el);
    },
    /**
     *封装file标签handle的回调，用于读取文件内容
     * @param event
     */
    handleFileReader(event: any): Promise<{ file: File, content: string | any }> {
        return new Promise((resolve, reject) => {
            const file = event.target.files[0];
            if (!file) {
                reject('未读取到文件');
                return;
            }
            let reader: FileReader | null = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const fileContent = e.target!.result;
                resolve({file, content: fileContent});
                reader = null;
            };
            reader.readAsText(file);
        });
    },
    /**
     * 保存大文本到文件
     * @param text {string} 文本内容
     * @param filename {string} 文件名
     */
    saveTextAsFile(text: string, filename = 'data.txt') {
        // 创建Blob对象（处理大文本）
        const blob = new Blob([text], {type: 'text/plain'});
        // 创建下载链接
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;
        // 触发下载
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // 清理
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);
        }, 100);
    }
}
