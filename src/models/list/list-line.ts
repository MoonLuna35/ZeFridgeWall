import { IListArticle, ListArticle } from "../list-article/list-article";

export interface IListLine extends IListArticle {
    qte?: number;
    striked?: boolean;
    is_from_cupboard?: boolean; 
}

export class ListLine extends ListArticle {
    private _qte: number= 0;
    private _striked?: boolean | undefined;
    private _is_from_cupboard: boolean = false;
    
    
   
    constructor(line: IListLine) {
        super(line);
        this._qte = line.qte || 0;
        this._striked = line.striked;
        this._is_from_cupboard = line.is_from_cupboard || false;
    }

    //getter
    public get qte(): number {
        return this._qte;
    }
    public get striked(): boolean | undefined {
        return this._striked;
    }
    public get is_from_cupboard(): boolean {
        return this._is_from_cupboard;
    }

    //setter 
    public set qte(value: number) {
        this._qte = value;
    }
    public set striked(value: boolean | undefined) {
        this._striked = value;
    }
    public set is_from_cupboard(value: boolean) {
        this._is_from_cupboard = value;
    }
}