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

### 作業環境

VSCode の [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 拡張機能を利用すると，Docker で作成したコンテナの中に入って作業ができる．
- コンテナが起動している状態で左下の「><」マークから「実行中のコンテナにアタッチ…」を選択する．

コンテナ内での変更はローカルファイルにも自動で反映される．

#### Docker 関連

`docker compose up -d` で作成したコンテナは `docker compose down` で削除できる．DockerFile や compose.yml など，Docker 関連のファイルを編集した場合は `docker compose down && docker compose build --no-cache && docker compose up -d` として再度起動するとコンテナに反映される．
