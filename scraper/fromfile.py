# ファイル名を 1 つ以上指定して，句切りの結果を CSV 形式で出力する

import analyze
import sys

if len(sys.argv) < 2:
    print("ファイル名を指定してください")
    exit(1)

for i in range(1, len(sys.argv)):
    file = sys.argv[i]
    contents = []
    with open(file, encoding='utf8') as f:
        for line in f:
            contents.append(line[:-1])
    analyze.out_csv(contents)
