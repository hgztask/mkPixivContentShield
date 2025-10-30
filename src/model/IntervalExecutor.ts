import {eventEmitter} from "./EventEmitter";

type configType = {
    timeout?: number,
    processTips?: boolean,
    intervalName: string
}

// 间隔执行器
export class IntervalExecutor {
    static #intervalExecutorList: IntervalExecutor[] = [];
    #interval: number | null = null;
    /**
     * @param func {function} 异步执行函数
     */
    #func: Function;
    #config: configType;
    #statusObj: {
        status?: boolean,
        key?: string,
        name?: string
    } = {};
    #keyIntervalName = '';

    /**
     * 创建间隔执行器
     * @param func {function} 异步执行函数
     * @param config {{}} 配置项
     * @param config.timeout {number} 间隔时间
     * @param config.processTips {boolean} 是否打印执行信息
     * @param config.intervalName {string} 间隔名称
     */
    constructor(func: Function, config: configType) {
        if (config === undefined) {
            throw new Error('请传入配置项');
        }
        const defConfig = {timeout: 1500, processTips: false, intervalName: null}
        this.#config = Object.assign(defConfig, config);
        if (this.#config.intervalName === null) {
            throw new Error('请设置间隔名称');
        }
        this.#func = func;
        const intervalName = this.#config.intervalName;
        const intervalExecutorList = IntervalExecutor.#intervalExecutorList;
        const index = intervalExecutorList.length + 1;
        this.#keyIntervalName = `${intervalName}_${index}`;
        this.#statusObj = {status: false, key: this.#keyIntervalName, name: this.#config.intervalName}
        intervalExecutorList.push(this);
    }

    //根据Key名称设置对应执行器状态
    static setIntervalExecutorStatus(keyIntervalName: string, status: boolean) {
        const find = IntervalExecutor.#intervalExecutorList.find(item => item.getKeyIntervalName() === keyIntervalName);
        if (find === undefined) return;
        if (status) {
            find.start();
        } else {
            find.stop();
        }
    }

    getKeyIntervalName = () => {
        return this.#keyIntervalName;
    }

    stop(msg?: string) {
        const i = this.#interval;
        if (i === null) return;
        clearInterval(i);
        this.#interval = null;
        const processTips = this.#config.processTips;
        const intervalName = this.#config.intervalName;
        if (msg) {
            console.log(`stop:手动停止${intervalName}，原因${msg}`);
        }
        if (processTips) {
            console.log(`stop:检测${intervalName}间隔执行器`)
        }
        this.#statusObj.status = false;
        eventEmitter.send('event:update:intervalExecutorStatus', this.#statusObj)
    }

    setTimeout(timeout: number) {
        this.#config.timeout = timeout;
    }

    start() {
        if (this.#interval !== null) return;
        this.#statusObj.status = true;
        this.#interval = setInterval(this.#func, this.#config.timeout);
        const processTips = this.#config.processTips;
        if (processTips) {
            console.log(`start:检测${this.#config.intervalName}间隔执行器`)
        }
        eventEmitter.send('event:update:intervalExecutorStatus', this.#statusObj)
    }
}