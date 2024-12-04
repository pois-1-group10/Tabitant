import matplotlib.pyplot as plt

# データを格納するリスト
eval_loss_values = []
eval_f1_values = []
epochs = []

# テキストファイルからデータを読み込む
with open('cout.log', 'r') as file:
    lines = file.readlines()

# 各行の内容を辞書にパースし、リストに追加する
for line in lines:
    try:
        data_dict = eval(line)  # 文字列を辞書に変換
        eval_loss_values.append(data_dict['eval_loss'])
        eval_f1_values.append(data_dict['eval_f1'])
        epochs.append(data_dict['epoch'])
    except:
        pass

# グラフを作成
plt.plot(epochs, eval_loss_values, label='eval_loss')
plt.plot(epochs, eval_f1_values, label='eval_f1')
plt.xlabel('Epoch')
plt.ylabel('Value')
plt.title('Evaluation Metrics')
plt.legend()
plt.savefig("train/out.png")
