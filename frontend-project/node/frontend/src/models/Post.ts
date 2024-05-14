import { Tanka, User, LatLng } from ".";

export class Post {
    id: string;
    userId: string;
    content: Tanka;
    location: LatLng;

    // external data
    user: User | null = null;

    constructor(id: string, user: string | User, content: Tanka, location: LatLng) {
        this.id = id;
        this.content = content;
        this.location = location;
        if (user instanceof User) {
            this.user = user;
            this.userId = user.id;
        } else {
            this.userId = user;
        }
    }
}