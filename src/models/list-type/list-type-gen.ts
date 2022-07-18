export interface IListTypeGen {
    id?: number; 
    lang?: string; 
    name?: string;
    logo_color?: number | string;
    logo_patern?: number;
    is_gen?: boolean;
    is_deletable?: boolean;
}

export class ListTypeGen {
    private _id?: number; 
    private _lang?: string; 
    private _name?: string;
    private _logo_color?: number | string;
    private _logo_patern?: number;
    private _is_gen?: boolean;
    private _is_deletable?: boolean;

    constructor(listTypeGen: IListTypeGen) {
        this._id = listTypeGen.id;
        this._lang = listTypeGen.lang;
        this._name = listTypeGen.name;
        this._logo_patern = listTypeGen.logo_patern;
        this._logo_color = listTypeGen.logo_color;
        this._is_gen = listTypeGen.is_gen;
        this._is_deletable = listTypeGen.is_deletable;
        
    }

    public get id(): number | undefined{
        return this._id;
    } 
    public get lang(): string | undefined{
        return this._lang;
    } 
    public get name(): string | undefined{
        return this._name;
    } 
    public get logo_patern(): number | undefined{
        return this._logo_patern;
    }
    public get color(): number | string | undefined {
        return this._logo_color; 
    } 
    public get is_gen(): boolean | undefined{
        return this._is_gen;
    } 
    public get is_deletable(): boolean | undefined{
        return this._is_deletable;
    } 
    public get color_to_hex() {
        let out = "#";
        let color_str = this._logo_color?.toString(16);
        let delta = 6 - (color_str?.length || 0) ;
        
         
        if (delta > 0) { //SI il y a des 0 avant ALORS
            for(let i = 0; i < delta; i++) {//On les rajoute
                out += "0";
            }
        }
        out += this._logo_color?.toString(16)
        if (out.indexOf("##") !== -1) {
            out = out.replace("##", "#");
        }
        return out;


    }

    public set id(new_id: number | undefined){
        this._id = new_id;
    } 
    public set name(new_name: string | undefined){
        this._name = new_name;
    } 
    public set color(new_color: number | string | undefined ){
        this._logo_color = new_color;
    } 
    public set logo_patern(new_logo_patern: number | undefined) {
        this._logo_patern = new_logo_patern;
    }
    public set is_deletable(new_is_deletable: boolean | undefined) {
        this._is_deletable = new_is_deletable;
    }
    public set color_to_int(color: any) {
        color = color.replace("#", "0x"); 
        this._logo_color = parseInt(color);
    }

}