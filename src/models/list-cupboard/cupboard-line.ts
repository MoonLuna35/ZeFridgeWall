import { IListArticle, ListArticle } from "../list-article/list-article";

export interface ICupboardLine extends IListArticle {
    is_disabled: boolean;
    is_checked: boolean;
    qte: number;
}

export class CupboardLine extends ListArticle { 
    private _is_disabled: boolean;
    private _is_checked: boolean;
    private _qte: number;
    
   
    

    constructor(line: ICupboardLine) {
        super(line);
        this._is_disabled = line.is_disabled;
        this._is_checked = line.is_checked;
        this._qte = line.qte;
    }

    public get is_disabled(): boolean {
        return this._is_disabled;
    }
    public get is_checked(): boolean {
        return this._is_checked;
    }
    public get qte(): number {
        return this._qte;
    }


    public set is_disabled(value: boolean) {
        this._is_disabled = value;
    }
    public set is_checked(value: boolean) {
        this._is_checked = value;
    }
    public set qte(value: number) {
        this._qte = value;
    }
}