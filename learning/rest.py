import csv

csv_file = "data/rest.csv"
out_file = "data/rest.txt"

def main():
    with open(out_file, 'w', encoding="utf8") as fw:
        with open(csv_file, encoding="utf8") as f:
            reader = csv.reader(f)
            for line in reader:
                if line[0]:
                    fw.write("".join([line[i] for i in range(5)]) + "\n")

if __name__ == "__main__":
    main()
