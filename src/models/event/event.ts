export interface IEventBase {
    id?: number;
    type?: string;
    time_begin?: Date; 
    label?: string
}
export interface IVoiceReminder extends IEventBase {
    sentance?: string; 
    ring?: boolean;
    assistant_device?: "alexa" | "google assitant" | "autre";
}

export class EventBase {
    private _id: number = -1;
    private _type: string = "assistant_device";
    private _time_begin: Date = new Date(); 
    private _label: string = "";
    
    
    constructor(baseEvt: IEventBase) {
        this._id = baseEvt.id || -1;
        this._type = baseEvt.type || "assistant_device";
        this._time_begin = baseEvt.time_begin || new Date(); 
        this._label = baseEvt.label || "";
    }
    
    public set id(value: number) {
        this._id = value;
    }
    public set type(value: string) {
        this._type = value;
    }
    public set time_begin(value: Date) {
        this._time_begin = value;
    }
    public set label(value: string) {
        this._label = value;
    }

    public get id(): number {
        return this._id;
    }
    public get type(): string {
        return this._type;
    }
    public get time_begin(): Date {
        return this._time_begin;
    }
    public get label(): string {
        return this._label;
    }
}

export class VoiceReminder extends EventBase {
    private _sentance?: string; 
    private _ring?: boolean;
    private _assistant_device?: "alexa" | "google assitant" | "autre";
    
    constructor(reminder: IVoiceReminder) {
        super(reminder);
        this._sentance = reminder.sentance || ""; 
        this._ring = reminder.ring || false;
        this._assistant_device = reminder.assistant_device || "autre";
    }
}