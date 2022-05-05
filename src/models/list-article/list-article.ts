import { ListTypeGen } from "../list-type/list-type-gen";
import { IListLine } from "../list/list-line";

export interface IListArticle {
    id: number; 
    label?: string; 
    type?: ListTypeGen; 
    unity?: string;
    user?: number;

}

export class ListArticle {
    protected _id: number; 
    protected _label?: string; 
    protected _type?: ListTypeGen; 
    protected _unity?: string;
    protected _user?: number;

    constructor(article: IListArticle|IListLine) {
        this._id = article.id;
        this._label = article.label;
        this._type = article.type;
        this._unity = article.unity;

    }

    public get id() {
        return this._id;
    }
    public get label() {
        return this._label;
    }
    public get type() {
        return this._type;
    }
    public get unity() {
        return this._unity;
    }

    public set id(new_id: number) {
        this._id = new_id;
    }

    public set label(new_label: string | undefined) {
        this._label = new_label;
    }
    public set type(new_type: ListTypeGen | undefined) {
        console.log("ta race");
        this._type = new_type;
    }

    public set unity(new_unity: string | undefined) {
        this._unity = new_unity;
    }
}