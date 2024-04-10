# Tabitant

## 開発

### 環境構築

1. [Docker Desktop](https://docs.docker.jp/desktop/) をインストール．
    - Linux なら Docker Engine でも可．
    - Windows は WSL 2 が必要．
1. GitHub から Tabitant レポジトリを clone．
    - レポジトリを作成するディレクトリに移動して，`git clone https://github.com/pois-1-group10/Tabitant.git`
1. `cd Tabitant` で Tabitant ディレクトリに移動して，以下のコマンドを順に実行．
    - `docker compose build --no-cache`
    - `docker compose up -d`

コンテナが起動して，（デフォルトでは）http://localhost:8000 でロケット，http://localhost:3000 で React のロゴがそれぞれ表示されていれば成功．
