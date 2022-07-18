import { ListArticle } from "../list-article/list-article";
import { User } from "../user/user";
import { ListLine } from "./list-line";

export interface IList { 
    id: number;
    author?: User;
    name: string;
    desc: string; 
    date_create: Date;
    date_update?: Date;
    is_protected: boolean;
    is_archived: boolean;
    lines: ListLine[];
    user_auth?: User[];
}

export class List {
    private _id: number;
    private _author?: User;
    private _name: string;
    private _desc: string; 
    private _date_create: Date;
    private _date_update?: Date;
    private _is_protected: boolean;
    private _is_archived: boolean;
    private _lines: ListLine[];
    private _user_auth?: User[];

    constructor(list: IList) {
        this._id = list.id;
        this._author = list.author;
        this._name = list.name;
        this._desc = list.desc; 
        this._date_create = list.date_create;
        this._date_update = list.date_update;
        this._is_protected = list.is_protected;
        this._is_archived = list.is_archived;
        this._lines = list.lines;
        this._user_auth = list.user_auth;
    }

    public set id(new_id: number) {
        this._id = new_id;
    }
    public set author(new_author: User | undefined) {
        this._author = new_author;
    }
    public set name(new_name: string) {
        this._name = new_name;
    }
    public set desc(new_desc: string) {
        this._desc = new_desc;
    }
    public set date_create(new_date_create: Date) {
        this._date_create = new_date_create;
    }
    public set date_update(new_date_update: Date | undefined) {
        this._date_update = new_date_update;
    }
    public set is_protected(new_is_protected: boolean) {
        this._is_protected = new_is_protected;
    }
    public set is_archived(new_is_archived: boolean) {
        this._is_archived = new_is_archived;
    }
    public set lines(new_lines: ListLine[]) {
        this._lines = new_lines;
    }
    public set user_auth(new_user_auth: User[] | undefined) {
        this._user_auth = new_user_auth;
    }
    
    
    public get id() {
        return this._id;
    }
    public get author() {
        return this._author;
    }
    public get name() {
        return this._name;
    }
    public get desc() {
        return this._desc;
    }
    public get date_create() {
        return this._date_create;
    }
    public get date_update() {
        return this._date_update;
    }
    public get is_protected() {
        return this._is_protected;
    }
    public get is_archived() {
        return this._is_archived;
    }
    public get lines() {
        return this._lines;
    }
    public get user_auth() {
        return this._user_auth;
    }
}