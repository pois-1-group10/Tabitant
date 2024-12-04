import csv
import json

csv_file = "data/tanka.csv"
json_file = "data/tanka.json"

def load_csv():
    data = []
    with open(csv_file, encoding="utf8") as f:
        reader = csv.DictReader(f)
        for line in reader:
            if not line["初句"]:
                if not reader.fieldnames: continue
                emotions = filter(lambda s: s.startswith("感情:"), reader.fieldnames)
                for e in emotions:
                    if not 1 <= int(line[e]) <= 10:
                        print(f"emotion の値が 1~10 の範囲にありません: 短歌番号={len(data)}, 評価者={line['結句']}")
                continue
            data.append({
                "content": "".join([line[i] for i in ["初句","二句","三句","四句","結句"]]),
                "emotion": {
                    "happy": float(line["感情:嬉しい"]),
                    "funny": float(line["感情:面白い"]),
                    "calm": float(line["感情:穏やか"]),
                    "sad": float(line["感情:しみじみ"]),
                    "lonely": float(line["感情:寂しい"]),
                    "angry": float(line["感情:怒り"]),
                },
                "tag": {
                    "daily": int(line["タグ:日常"]),
                    "relationship": int(line["タグ:人間関係"]),
                    "work": int(line["タグ:仕事"]),
                    "life": int(line["タグ:人生"]),
                    "family": int(line["タグ:家族"]),
                    "love": int(line["タグ:恋愛"]),
                    "travel": int(line["タグ:旅行"]),
                    "nature": int(line["タグ:自然"]),
                    "current": int(line["タグ:時事"]),
                }
            })
    return data

def write():
    data = load_csv()
    with open(json_file, 'w', encoding='utf8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def load():
    with open(json_file, 'r', encoding='utf8') as f:
        return json.load(f)


if __name__ == "__main__":
    write()
