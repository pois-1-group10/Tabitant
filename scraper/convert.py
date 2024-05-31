import sys

if len(sys.argv) < 2:
    print("ファイル名を指定してください")
    exit(1)

file = sys.argv[1]

with open(file, encoding='utf8') as f:
    for line in f:
        print(line[line.find(',') + 1:], end='')
        for _ in range(4): print(",,,,")
