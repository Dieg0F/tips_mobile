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