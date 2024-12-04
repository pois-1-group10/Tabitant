import csv
import sys
import traceback
from typing import Any
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset
from torch.utils.data import DataLoader
import load
import sbert

def get_tensor(data) -> 'list[Any]':
    """ツイートの内容をベクトル化する"""
    print('文章のベクトル化を開始します')

    contents = [data[i]['content'] for i in range(len(data))]

    model = sbert.make_sbert()
    tensors = model.encode(contents, batch_size=8).numpy()

    print('文章のベクトル化が完了しました')
    return tensors

def learn(data, tensors):
    print('データをロードします')

    def getLabelNames(item):
        ans = []
        for i in ["emotion", "tag"]:
            for j in item[i]:
                ans.append(i + "." + j)
        return ans

    def getLabels(item):
        ans = []
        for i in ["emotion", "tag"]:
            for j in item[i]:
                ans.append(item[i][j])
        return ans
    
    train_tensors = []
    train_labels = []
    val_tensors = []
    val_labels = []
    test_data = []
    test_tensors = []
    test_labels = []
    for i in range(len(tensors)):
        if i % 6 == 0:
            test_data.append(data[i])
            test_tensors.append(tensors[i])
            test_labels.append(getLabels(data[i]))
        elif i % 3 == 0:
            val_tensors.append(tensors[i])
            val_labels.append(getLabels(data[i]))
        else:
            train_tensors.append(tensors[i])
            train_labels.append(getLabels(data[i]))

    train_X = torch.FloatTensor(train_tensors).cuda()
    train_y = torch.FloatTensor(train_labels).cuda()
    val_X = torch.FloatTensor(val_tensors).cuda()
    val_y = torch.FloatTensor(val_labels).cuda()
    test_X = torch.FloatTensor(test_tensors).cuda()
    test_y = torch.FloatTensor(test_labels).cuda()

    train = TensorDataset(train_X, train_y)
    val = TensorDataset(val_X, val_y)
    test = TensorDataset(test_X, test_y)

    print('ロードが完了しました')
    print('学習を開始します')

    # ミニバッチのサイズ
    BATCH_SIZE = 128

    # Dataloader を作成
    train_dataloader = DataLoader(
        train,
        batch_size=BATCH_SIZE,
        shuffle=True
    )
    val_dataloader = DataLoader(
        val,
        batch_size=BATCH_SIZE
    )
    test_dataloader = DataLoader(
        test,
        batch_size=1
    )

    # 文章ベクトルの次元数
    tensor_dim = len(tensors[0])

    # モデル定義
    neuron_size = 256
    class Net(nn.Module):
        def __init__(self):
            super(Net, self).__init__()
            self.linear_relu_stack = nn.Sequential(
                nn.Linear(tensor_dim, neuron_size),
                nn.ReLU(),
                nn.Linear(neuron_size, neuron_size),
                nn.ReLU(),
                nn.Linear(neuron_size, len(train_y[0])),
                nn.Sigmoid()
            )

        # 順伝播
        def forward(self, x):
            return self.linear_relu_stack(x)

    # インスタンス化
    net = Net().cuda()

    # 最適化手法の選択 (SGD)
    learning_rate = 1e-1
    optimizer = torch.optim.SGD(net.parameters(), lr=learning_rate)

    # 損失関数
    # emotion_count = len(data[0]["emotion"])
    # mse_loss = nn.MSELoss()
    # bce_loss = nn.BCELoss()
    # def get_loss(pred, label):
    #     # shape = [batch_size, 15]
    #     ans = None
    #     for i in range(len(pred)):
    #         ans += mse_loss(pred[i][:emotion_count], label[i][:emotion_count])
    #         ans += bce_loss(pred[i][emotion_count:], label[i][emotion_count:])
    #     return ans
    def get_loss():
        return nn.MSELoss()

    # y 軸方向リスト
    loss_list_train = []
    loss_list_val = []

    epoch_count = 800
    with open("result/metrics.csv", 'w', encoding='utf8') as f:
        writer = csv.writer(f)
        writer.writerow(['epoch', 'mode', 'loss'])

        for epoch in range(1, epoch_count + 1):
            # 訓練ループ
            avg_loss = 0
            for batch, label in train_dataloader:
                optimizer.zero_grad()
                t_p = net(batch)
                loss = get_loss()(t_p, label)
                loss.backward()
                avg_loss += float(loss * len(batch))
                optimizer.step()

            avg_loss /= len(train_tensors)
            loss_list_train.append(avg_loss)

            writer.writerow([epoch, 'train', avg_loss])

            # 検証ループ
            avg_loss = 0
            for batch, label in val_dataloader:
                t_p = net(batch)
                loss = get_loss()(t_p, label)
                avg_loss += float(loss * len(batch))

            avg_loss /= len(val_tensors)
            loss_list_val.append(avg_loss)

            writer.writerow([epoch, 'val', avg_loss])

    print('学習が終了しました')

    # モデルを保存
    model_file = "result/model.pth"
    torch.save(net.state_dict(), model_file)
    print(f'パラメータを保存しました: {model_file}')

    # x 軸方向リスト
    x_axis_list = list(range(epoch_count))

    # グラフの描画
    plt.cla()
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.plot(x_axis_list, loss_list_train, label="train")
    plt.plot(x_axis_list, loss_list_val, label="val")
    plt.legend()
    plt.savefig("result/loss.png")

    # テスト
    columns = getLabelNames(data[0])
    test_file = "result/test.csv"
    with open(test_file, 'w', encoding='utf8') as f:
        writer = csv.writer(f)
        writer.writerow(['content', 'loss'] + columns)

        with torch.no_grad():
            index = 0
            avg_loss = 0
            for batch, label in test_dataloader:
                t_p = net(batch)
                loss = get_loss()(t_p, label)
                avg_loss += float(loss * len(batch))
                writer.writerow([test_data[index]['content'], loss.item()] + list(t_p[0].cpu().numpy()))
                index += 1
            
            avg_loss /= len(test_tensors)

    print(f'パラメータを保存しました: {test_file}')
    print(f'test loss={avg_loss}')


def main():
    data = load.load()
    # 感情の 1-10 を 0-1 に変換
    for i in data:
        for j in i['emotion']:
            i['emotion'][j] = (i['emotion'][j] - 1.) / 9.
    tensors = get_tensor(data)
    learn(data, tensors)

try:
    main()

except Exception as e:
    print('エラーが発生しました')
    print(''.join(traceback.format_exception(*sys.exc_info())))
