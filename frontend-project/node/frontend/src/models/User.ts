export class User {
    id: string;
    username: string;
    icon: string | null;

    constructor(id: string, username: string, icon: string | null) {
        this.id = id;
        this.username = username;
        this.icon = icon;
    }
}