export const dateToStringByMinute = (date: Date): string => {
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString(); // getMonth()は0から始まるため1を加える
    let day = date.getDate().toString();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();

    // 2桁になるように0を追加
    minutes = ('0' + minutes).slice(-2);

    let dateString = `${year}/${month}/${day} ${hours}:${minutes}`;
    return dateString;
}

export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInYear = 31536000;

    if (diffInSeconds < secondsInMinute) {
        return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < secondsInHour) {
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes}分前`;
    } else if (diffInSeconds < secondsInDay) {
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours}時間前`;
    } else if (diffInSeconds < secondsInDay * 3) {
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days}日前`;
    } else if (diffInSeconds < secondsInYear) {
        return date.toLocaleDateString('ja-JP', {
            month: 'numeric',
            day: 'numeric',
        });
    } else {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });
    }
}
