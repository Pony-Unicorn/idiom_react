import checkpointData from '../../resource/config/c_1.json';

// 单个文字的信息
interface IOriginalWordInfo {
    gx: number,
    gy: number,
    word: string,
    isVis: boolean,
    isShelter: boolean
};

export default class CheckpointDataTool {

    private _data = {
        data: [],
        range: [0, 0]
    }

    private _curAllIdiom: Array<string> = [];

    private _testDataRange(test: number): boolean {
        if (test >= this._data.range[0] && test <= this._data.range[1]) {
            return true;
        }
        return false;
    }

    getCheckPoint(checkpoint: number): IOriginalWordInfo[][] {

        if (!this._testDataRange(checkpoint)) {
            const rawDate = checkpointData;
            this._data.data = rawDate['data'] as [];
            this._data.range = rawDate['des'].split(',').map((v: any) => Number(v));
        }

        let index = (checkpoint % 40 - 1);
        index = index === -1 ? 39 : index;

        const data = this._data.data[index] as Array<any>;

        const result = [];
        this._curAllIdiom.length = 0;

        for (let i = 0, l = data.length; i < l; i++) {

            const d = data[i];

            this._curAllIdiom.push(d.idiom);

            const itemArr = [];
            const idioms = d.idiom.split('');
            const pos = d.pos.split(';');
            const vis = d.vis.split('');
            const shelter = d.shelter.split('');

            for (let k = 0, ll = idioms.length; k < ll; k++) {

                const obj: IOriginalWordInfo = {} as IOriginalWordInfo;

                const ps = pos[k].split(',');
                obj['gx'] = ps[0];
                obj['gy'] = ps[1];
                obj['word'] = idioms[k];
                obj['isVis'] = vis[k] == '0' ? false : true;
                obj['isShelter'] = shelter[k] == '0' ? false : true;
                itemArr.push(obj);
            }

            result.push(itemArr);
        }

        return result;
    }

    getIdioms(): Array<string> {
        return this._curAllIdiom;
    }
}
