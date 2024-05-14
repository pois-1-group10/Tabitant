import { LatLng, Post, Tanka, User } from "./models";

// ランダムに1文字を選択する関数
function randomCharFromCode(start: number, end: number): string {
    const charCode = Math.floor(Math.random() * (end - start + 1)) + start;
    return String.fromCharCode(charCode);
}

function getDummyUserName(minLength = 2, maxLength = 8): string {
    let username = '';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const isAlphabet = Math.random() < 0.5; // 1/2の確率で英文字のみ
    if (isAlphabet) {
        for (let i = 0; i < length; i++) {
            username += randomCharFromCode("a".charCodeAt(0), "z".charCodeAt(0));
        }
    } else {
        const japaneseChars = [
            ["あ".charCodeAt(0), "ん".charCodeAt(0)],
            ["ア".charCodeAt(0), "ン".charCodeAt(0)],
        ];
        const randomRange = japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
        for (let i = 0; i < length; i++) {
            username += randomCharFromCode(randomRange[0], randomRange[1]);
        }
    }
    return username;
}

function getDummyTanka(): Tanka {
    let content: string[] = [];
    const length = [5, 7, 5, 7, 7];

    for (let i = 0; i < length.length; i++) {
        let s = "";
        for (let j = 0; j < length[i]; j++) {
            s += randomCharFromCode("あ".charCodeAt(0), "ん".charCodeAt(0));
        }
        content.push(s);
    }
    return new Tanka(content);
}

// ユーザーのダミーデータを作成する
export function getDummyUsers(size: number = 100): User[] {
    let ans: User[] = [];
    for (let i = 0; i < size; i++) {
        ans.push(new User(i.toString(), getDummyUserName(), null));
    }
    return ans;
}

interface getDummyPostsProps {
    users: User[],
    center?: LatLng,
    radius?: number,
    size?: number,
}

// 投稿のダミーデータを作成する
export function getDummyPosts({ users, center = new LatLng(35, 135), radius = 0.1, size = 100 }: getDummyPostsProps): Post[] {
    let ans: Post[] = []
    for (let i = 0; i < size; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        let theta = Math.random() * Math.PI * 2;
        let distance = Math.random() * radius;
        let location = new LatLng(center.lat + Math.cos(theta) * distance, center.lng + Math.sin(theta) * distance);
        ans.push(new Post(i.toString(), user, getDummyTanka(), location));
    }
    return ans;
}
