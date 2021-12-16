(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "events", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.requestGPIOAccess = exports.OperationError = exports.InvalidAccessError = exports.GPIOPort = exports.GPIOPortMap = exports.GPIOAccess = void 0;
    const events_1 = require("events");
    const fs_1 = require("fs");
    const path = require("path");
    /**
     * Interval of file system polling, in milliseconds.
     */
    const PollingInterval = 100;
    const SysfsGPIOPath = '/sys/class/gpio';
    const GPIOPortMapSizeMax = 1024;
    const Uint16Max = 65535;
    function parseUint16(string) {
        const n = Number.parseInt(string, 10);
        if (0 <= n && n <= Uint16Max)
            return n;
        else
            throw new RangeError(`Must be between 0 and ${Uint16Max}.`);
    }
    class GPIOAccess extends events_1.EventEmitter {
        _ports;
        onchange;
        constructor(ports) {
            super();
            this._ports = ports == null ? new GPIOPortMap() : ports;
            this._ports.forEach((port) => port.on('change', (event) => {
                this.emit('change', event);
            }));
            this.on('change', (event) => {
                if (this.onchange !== undefined)
                    this.onchange(event);
            });
        }
        get ports() {
            return this._ports;
        }
        /**
         * Unexport all exported GPIO ports.
         */
        async unexportAll() {
            await Promise.all([...this.ports.values()].map((port) => port.exported ? port.unexport() : undefined));
        }
    }
    exports.GPIOAccess = GPIOAccess;
    /**
     * Different from Web GPIO API specification.
     */
    class GPIOPortMap extends Map {
    }
    exports.GPIOPortMap = GPIOPortMap;
    class GPIOPort extends events_1.EventEmitter {
        _portNumber;
        _pollingInterval;
        _direction;
        _exported;
        _exportRetry;
        _value;
        _timeout;
        onchange;
        constructor(portNumber) {
            super();
            this._portNumber = parseUint16(portNumber.toString());
            this._pollingInterval = PollingInterval;
            this._direction = new OperationError('Unknown direction.');
            this._exported = new OperationError('Unknown export.');
            this._exportRetry = 0;
            this.on('change', (event) => {
                if (this.onchange !== undefined)
                    this.onchange(event);
            });
        }
        get portNumber() {
            return this._portNumber;
        }
        get portName() {
            return `gpio${this.portNumber}`;
        }
        get pinName() {
            // NOTE: Unknown pinName.
            return '';
        }
        get direction() {
            if (this._direction instanceof OperationError)
                throw this._direction;
            return this._direction;
        }
        get exported() {
            if (this._exported instanceof OperationError)
                throw this._exported;
            return this._exported;
        }
        async export(direction) {
            if (!/^(in|out)$/.test(direction)) {
                throw new InvalidAccessError(`Must be "in" or "out".`);
            }
            try {
                await fs_1.promises.access(path.join(SysfsGPIOPath, this.portName));
                this._exported = true;
            }
            catch {
                this._exported = false;
            }
            try {
                clearInterval(this._timeout);
                if (!this.exported) {
                    await fs_1.promises.writeFile(path.join(SysfsGPIOPath, 'export'), String(this.portNumber));
                }
                await fs_1.promises.writeFile(path.join(SysfsGPIOPath, this.portName, 'direction'), direction);
                if (direction === 'in') {
                    this._timeout = setInterval(
                    // eslint-disable-next-line
                    this.read.bind(this), this._pollingInterval);
                }
            }
            catch (error) {
                if (this._exportRetry == 0) {
                    await sleep(100);
                    console.warn('May be the first time port access. Retry..');
                    ++this._exportRetry;
                    await this.export(direction);
                }
                else {
                    throw new OperationError(error);
                }
            }
            this._direction = direction;
            this._exported = true;
        }
        async unexport() {
            clearInterval(this._timeout);
            try {
                await fs_1.promises.writeFile(path.join(SysfsGPIOPath, 'unexport'), String(this.portNumber));
            }
            catch (error) {
                throw new OperationError(error);
            }
            this._exported = false;
        }
        async read() {
            if (!(this.exported && this.direction === 'in')) {
                throw new InvalidAccessError(`The exported must be true and value of direction must be "in".`);
            }
            try {
                const buffer = await fs_1.promises.readFile(path.join(SysfsGPIOPath, this.portName, 'value'));
                const value = parseUint16(buffer.toString());
                if (this._value !== value) {
                    this._value = value;
                    this.emit('change', { value, port: this });
                }
                return value;
            }
            catch (error) {
                throw new OperationError(error);
            }
        }
        async write(value) {
            if (!(this.exported && this.direction === 'out')) {
                throw new InvalidAccessError(`The exported must be true and value of direction must be "out".`);
            }
            try {
                await fs_1.promises.writeFile(path.join(SysfsGPIOPath, this.portName, 'value'), parseUint16(value.toString()).toString());
            }
            catch (error) {
                throw new OperationError(error);
            }
        }
    }
    exports.GPIOPort = GPIOPort;
    class InvalidAccessError extends Error {
        constructor(message) {
            super(message);
            this.name = this.constructor.name;
        }
    }
    exports.InvalidAccessError = InvalidAccessError;
    class OperationError extends Error {
        constructor(message) {
            super(message);
            this.name = this.constructor.name;
        }
    }
    exports.OperationError = OperationError;
    // Web GPIOの仕様に基づく意図的なasync関数の使用なので、ルールを無効化
    // eslint-disable-next-line
    async function requestGPIOAccess() {
        const ports = new GPIOPortMap([...Array(GPIOPortMapSizeMax).keys()].map((portNumber) => [
            portNumber,
            new GPIOPort(portNumber),
        ]));
        return new GPIOAccess(ports);
    }
    exports.requestGPIOAccess = requestGPIOAccess;
    function sleep(ms) {
        return new Promise((resolve) => {
            return setTimeout(resolve, ms);
        });
    }
});
