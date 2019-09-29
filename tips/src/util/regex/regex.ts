export class Regex {

    public verifyName(name: string): boolean {
        return new RegExp(/\w/).test(name);
    }

    public verifyEmail(email: string): Boolean {
        return new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email);
    }

    public verifyPassword(pass: string): boolean {
        return new RegExp(/\w{6,10}/).test(pass);
    }
}

export const REGEXP = {
    ADDRESS: new RegExp(/^([\u0021-\u007e\u00a0-\u00ff][\u0020-\u007e\u00a0-\u00ff]{0,59})?$/),
    // tslint:disable-next-line:max-line-length
    CELLPHONE: new RegExp(/^(\(1[1-9]\)\s?(?:7|9\d)\d{3}-\d{4}|(?:\(2[12478]\)|\(3[1-578]\)|\([4689][1-9]\)|\(5[13-5]\)|\(7[13-579]\))\s?(?:[6-8]|9\d?)\d{3}-\d{4})$/),
    CEP: new RegExp(/^(\d{5}-\d{3})$/),
    COMPLEMENT: new RegExp(/^([\u0021-\u007e\u00a0-\u00ff][\u0020-\u007e\u00a0-\u00ff]{0,59})?$/),
    EMAIL: new RegExp(/^([A-Za-z0-9._-]{2,})(@[A-Za-z0-9_-]{2,})(\.[A-Za-z]{2,6})+$/),
    ENTITY_NAME: new RegExp(/^([\u0021-\u007e\u00a0-\u00ff][\u0000\u0020-\u007e\u00a0-\u00ff]{0,59})$/),
    GATEWAY_NAME: new RegExp(/^([\u0021-\u007e\u00a0-\u00ff][\u0020-\u007e\u00a0-\u00ff]{0,59})?$/),
    LASTNAME: new RegExp(/^[a-zA-Z\u00C0-\u00FF][\s\w\u00C0-\u00FF]{0,59}$/),
    // tslint:disable-next-line:max-line-length
    NAME: new RegExp(/^(([a-zA-Z\u00C0-\u00FF][\s\w\u00C0-\u00FF]{0,59})|([A-Za-z0-9._-]{2,})(@[A-Za-z0-9_-]{2,})(\.[A-Za-z]{2,6})+)$/),
    PASSWORD: new RegExp(/^[0-9A-Za-z\ !@#$%ˆ*()_+-`=;:',.?/]{6,30}$/),
    // tslint:disable-next-line:max-line-length
    TELEPHONE: new RegExp(/^((?:\([14689][1-9]\)|\(2[12478]\)|\(3[1-578]\)|\(5[13-5]\)|\(7[13-579]\))\s?[2-5]\d{3}-\d{4})?$/),

};