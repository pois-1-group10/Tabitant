from .load import get_pipe

def decode(dict_list):
    res = {}
    scores = {}
    for d in dict_list:
        n = d["label"][-1]
        if '0' <= n <= '9':
            n = int(n)
            label = d["label"][:-2]
            sc = -1e8
            if label in scores:
                _, sc = scores[label]
            if d["score"] > sc:
                scores[label] = (n, d["score"])
        else:
            res[d["label"]] = d["score"]
    for label in scores:
        v, _ = scores[label]
        res[label] = v
    return res

def eval(text):
    '''
    return:
    {
        "emotion.happy": 0,1,2
        ... (funny, calm, sad, lonely, angry)
        "tag.daily": 0-1
        ... (relationship, work, life, family, love, travel, nature, current)
    }
    '''
    pipe = get_pipe()
    res = pipe(text)
    return decode(res[0])

def main():
    pipe = get_pipe()
    print(pipe("寂しい"))

if __name__ == "__main__":
    main()
