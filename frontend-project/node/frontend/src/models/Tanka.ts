export class Tanka {
    content: string[];

    constructor(content: string[]) {
        this.content = content;
    }

    toString(): string {
        return this.content.join(" ");
    }
}