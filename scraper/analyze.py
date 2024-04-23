from pykakasi import kakasi
import re

kakasi = kakasi()
note_re = re.compile("[!""#$%&\'\\\\()*+,-./:;<=>?@[\\]^_`{|}~「」〔〕“”〈〉『』【】＆＊・（）＄＃＠。、？！｀＋￥％ゃゅょ]")

def countNotes(text):
    return len(re.sub(note_re, "", text))

# content を句ごとに区切り，損失の数と区切り結果を返す．短歌でなければ None を返す
def separate(content):
    result = kakasi.convert(content)
    for i in result:
        i['note'] = countNotes(i['hira'])
    notes = sum(map(lambda x: x['note'], result))
    if not 26 <= notes <= 36:
        return None
    
    # なるべく損失が少ない区切りを見つける
    NOTES_NORMAL = [5, 7, 5, 7, 7]
    # dp[i][j]: i+1 番目の句の j 音目まで見たときの最小損失と区切り位置の組
    dp = [[None for _ in range(12)] for _ in range(5)]
    dp[0][0] = (0, [])
    for r in range(len(result)):
        note = result[r]['note']
        if note >= len(dp[0]): return None
        nxt = [[None for _ in range(12)] for _ in range(5)]
        for i in range(len(dp)):
            for j in range(len(dp[0])):
                if dp[i][j] == None: continue
                if i != len(dp) - 1:
                    loss = dp[i][j][0] + abs(j - NOTES_NORMAL[i])
                    if nxt[i + 1][note] == None or loss < nxt[i + 1][note][0]:
                        nxt[i + 1][note] = (loss, dp[i][j][1] + [r])
                if j + note >= len(dp[0]): continue
                if nxt[i][j + note] == None or dp[i][j][0] < nxt[i][j + note][0]:
                    nxt[i][j + note] = (dp[i][j][0], dp[i][j][1])
        dp = nxt

    min_loss = 1e8
    sep = None
    for i in range(len(dp[-1])):
        if dp[-1][i] == None: continue
        loss = dp[-1][i][0] + abs(i - NOTES_NORMAL[-1])
        if loss < min_loss:
            min_loss = loss
            sep = dp[-1][i][1]
    
    # 区切り位置をもとに復元する
    ans = ["".join(map(lambda x: x['orig'], result[:sep[0]]))]
    for i in range(len(sep) - 1):
        ans.append("".join(map(lambda x: x['orig'], result[sep[i]:sep[i + 1]])))
    ans.append("".join(map(lambda x: x['orig'], result[sep[-1]:])))
    return min_loss, ans

def out_csv(contents):
    for content in contents:
        res = separate(content)
        if res == None: continue
        print(f'{res[0]},{",".join(res[1])}')
