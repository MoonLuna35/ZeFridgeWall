export class regEx {
    public static AUTH_FOR_LIST_PATERN = /^(?:\d+;)*$/;
    public static ALPHANUM_PATERN = "^[a-zA-Z0-9-_ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØŒŠþÙÚÛÜÝŸàáâãäåæçèéêëìíîïðñòóôõöøœšÞùúûüýÿ/ ]+$"
    public static MAIL_PATERN = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+.[a-z]{2,}$/;
    public static TEL_PATERN = /^\d{9,12}$/;
    public static TEL_CHAR_TO_REMOVE = /[-.() ]+/;
    public static CONTAIN_UPPER_PATERN = /[A-Z]+/;
    public static CONTAIN_UNDER_PATERN = /[a-z]+/;
    public static CONTAIN_NUM_PATERN = /[0-9+]+/;
    public static CONTAIN_SPECIAL_PATERN = /\W+/;
}