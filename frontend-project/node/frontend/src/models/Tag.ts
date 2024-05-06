const EMOTION_PREFIX = "emo:";

export class Tag {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    isEmotion(): boolean {
        return this.name.startsWith(EMOTION_PREFIX);
    }

    getDisplayName(): string {
        if (this.isEmotion()) {
            return this.name.substring(EMOTION_PREFIX.length);
        } else {
            return this.name;
        }
    }
}