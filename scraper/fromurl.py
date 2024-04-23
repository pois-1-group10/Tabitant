# URL を指定して，句切りの結果を CSV 形式で出力する
# URL 例: https://www.n-gaku.jp/public/life/zenkokutaikai_24th/

import analyze
import sys

if len(sys.argv) < 2:
    print("URL を指定してください")
    exit(1)
url = sys.argv[1]

import requests
from bs4 import BeautifulSoup

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

elems = soup.select("[class^='award-item'] .txt02")
contents = list(map(lambda x: x.text, elems))

analyze.out_csv(contents)
