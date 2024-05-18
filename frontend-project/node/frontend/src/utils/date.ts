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