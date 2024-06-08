import tkinter as tk
from tkinter import filedialog
import os

def select_file():
    root = tk.Tk()
    root.withdraw()  # 隐藏主窗口
    file_path = filedialog.askopenfilename()  # 弹出文件选择对话框

    if file_path:  # 如果选择了文件
        abs_path = os.path.abspath(file_path)  # 获取文件的绝对路径
        abs_path_double_backslashes = abs_path.replace("\\", "\\\\")  # 将单斜杠替换为双斜杠
        print(abs_path_double_backslashes)
    else:
        print("No file selected")

if __name__ == "__main__":
    select_file()