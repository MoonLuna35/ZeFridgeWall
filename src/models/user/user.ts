export interface IUser {
    id?: number;
    pseudo?: string;
    is_using_name?: boolean | null;
    civility?: string; 
    name?: string;
    surname?: string;
    birthday?: Date | null;
    mail?: string;
    pass?: string;
    is_double_auth?: boolean | null;
    tel?: string;
    is_call_by_name?: boolean | null;
    is_tu?: boolean | null;
    pronum?: string;
    talk_about_me?: string; 
    is_plural?: boolean| null;
    activate?: string;
    is_activated?: boolean; 
    token?: string;
    first_log_token?: string; 
    is_root?: boolean
}

export interface IUserForAuthList extends IUser {
    is_grey: boolean;
    is_checked: boolean;
}


export class User {
    private _id?: number;
    private _pseudo?: string;
    private _is_using_name?: boolean | null;
    private _civility?: string; 
    private _name?: string;
    private _surname?: string;
    private _birthday?: Date | null;
   
  
    private _pass?: string | undefined;
    private _is_double_auth?: boolean | null | undefined;
    private _tel?: string | undefined;
    private _mail?: string | undefined;
    
    private _is_call_by_name?: boolean | null;
    private _is_tu?: boolean | null;
    private _pronum?: string;
    private _talk_about_me?: string; 
    private _is_plural?: boolean | null;
    private _activate?: string | undefined;
    private _is_activated?: boolean | undefined; 
    private _token?: string | undefined;
    private _first_log_token?: string | undefined; 
    private _is_root?: boolean | undefined;
    public get is_root(): boolean | undefined {
        return this._is_root;
    }
    public set is_root(value: boolean | undefined) {
        this._is_root = value;
    }
   
    constructor(user: IUser | IUserForAuthList) {
        this._id = user.id;
        this._pseudo = user.pseudo;
        this._is_using_name = user.is_using_name;
        this._civility = user.civility; 
        this._name = user.name;
        this._surname = user.surname;
        this._birthday = user.birthday
        this._pass = user.pass;
        this._is_double_auth = user.is_double_auth;
        this._tel = user.tel;
        this._mail = user.mail;
        this._is_call_by_name = user.is_call_by_name;
        this._is_tu = user.is_tu;
        this._pronum = user.pronum;
        this._talk_about_me = user.talk_about_me; 
        this._is_plural = user.is_plural;
        this._activate = user.activate;
        this._is_activated = user.is_activated; 
        this._token = user.token;
        this._first_log_token = user.first_log_token; 
        this._is_root = user.is_root;
    }

    public get id(): number | undefined {
        return this._id;
    }
    public get pseudo(): string | undefined {
        return this._pseudo;
    }
    public get is_using_name(): boolean | null | undefined {
        return this._is_using_name;
    }
    public get civility(): string | undefined {
        return this._civility;
    }
    public get name(): string | undefined {
        return this._name;
    }
    public get surname(): string | undefined {
        return this._surname;
    }
    public get birthday(): Date | null | undefined {
        return this._birthday;
    }
    public get pass(): string | undefined {
        return this._pass;
    }
    public get is_double_auth(): boolean | null | undefined {
        return this._is_double_auth;
    }
    public get tel(): string | undefined {
        return this._tel;
    }
    public get mail(): string | undefined {
        return this._mail;
    }
    public get is_call_by_name(): boolean | null | undefined {
        return this._is_call_by_name;
    }
    public get is_tu(): boolean | null | undefined {
        return this._is_tu;
    }
    public get pronum(): string | undefined {
        return this._pronum;
    }
    public get talk_about_me(): string | undefined {
        return this._talk_about_me;
    }
    public get is_plural(): boolean | null | undefined {
        return this._is_plural;
    }
    public get activate(): string | undefined {
        return this._activate;
    }
    public get is_activated(): boolean | undefined {
        return this._is_activated;
    }
    public get token(): string | undefined {
        return this._token;
    }
    public get first_log_token(): string | undefined {
        return this._first_log_token;
    }

    public get printed_name(): string | undefined {
        if(this._is_using_name === true) {
            if(this.is_call_by_name === true) {
                return this._civility + " " + this.name
            } 
            else {
                return this._surname;
            }
        }
        else {
            
            return this._pseudo;
        }
    }

    //Setters
    public set id(value: number | undefined) {
        this._id = value;
    }
    public set pseudo(value: string | undefined) {
        this._pseudo = value;
    }
    public set is_using_name(value: boolean | null | undefined) {
        this._is_using_name = value;
    }
    public set civility(value: string | undefined) {
        this._civility = value;
    }
    public set name(value: string | undefined) {
        this._name = value;
    }
    public set surname(value: string | undefined) {
        this._surname = value;
    }
    public set birthday(value: Date | null | undefined) {
        this._birthday = value;
    }
    public set pass(value: string | undefined) {
        this._pass = value;
    }
    public set is_double_auth(value: boolean | null | undefined) {
        this._is_double_auth = value;
    }
    public set tel(value: string | undefined) {
        this._tel = value;
    }
    public set mail(value: string | undefined) {
        this._mail = value;
    }
    public set is_call_by_name(value: boolean | null | undefined) {
        this._is_call_by_name = value;
    }
    public set is_tu(value: boolean | null | undefined) {
        this._is_tu = value;
    }
    public set pronum(value: string | undefined) {
        this._pronum = value;
    }
    public set talk_about_me(value: string | undefined) {
        this._talk_about_me = value;
    }
    public set is_plural(value: boolean | null | undefined) {
        this._is_plural = value;
    }
    public set activate(value: string | undefined) {
        this._activate = value;
    }
    public set token(value: string | undefined) {
        this._token = value;
    }
    public set first_log_token(value: string | undefined) {
        this._first_log_token = value;
    }


}

export class UserForAuthList extends User {
    private _is_grey: boolean;
    private _is_checked: boolean;
    
    constructor(user: IUserForAuthList) {
        super(user);
        this._is_grey = user.is_grey;
        this._is_checked = user.is_checked;
    }

    public get is_grey(): boolean {
        return this._is_grey;
    }
    public get is_checked(): boolean {
        return this._is_checked;
    }


    public set is_grey(value: boolean) {
        this._is_grey = value;
    }
    public set is_checked(value: boolean) {
        this._is_checked = value;
    }
}