import ipfs_api
import os
import shutil
import argparse
from tkinter import Tk
from pathlib import Path
from tkinter.filedialog import asksaveasfilename
import time
import new_cypher


# # 下载文件到本地
# def download_file(file_cid: str, path: str):
#    ipfs_api.download(file_cid, path)

def download_file(key, file_name: str, file_cid: str, path='.'):

    # 下载文件到指定路径，假设ipfs_api.download函数会将文件下载到指定目录并返回下载文件的路径
    ipfs_api.download(file_cid, path)
    tmp_path = os.path.join(path, file_cid)
    try:
        
        key = key.split(',')
        key_arr = []
        for i in key:
            key_arr.append(int(i))
        print(key_arr)
        new_cypher.aes_decrypt_file(key_arr=key_arr, file_path=tmp_path)
    except Exception as e:
        # print(key)
        print("Decrypt err: " + str(e))

    file_path = Path(os.path.join(path, file_cid))  # 替换为你的文件路径
    timeout = 30  # 设置超时时间（秒）

    start_time = time.time()
    while not file_path.exists() and (time.time() - start_time < timeout):
        time.sleep(0.5)  # 每0.5秒检查一次文件是否存在

    if file_path.exists():
        print(f"File {file_name}, {file_cid} succeed download")
    else:
        print(f"File {file_name}, {file_cid} timeout in {timeout}s")
    # 获取下载文件的原始后缀
    original_extension = os.path.splitext(path)[1]
    # 如果用户未提供后缀，则使用原始文件的后缀
    if not os.path.splitext(file_name)[1]:
        file_name += original_extension
    # 构建新的文件路径
    new_filepath = os.path.join(path, file_name)
    # 重命名下载的文件
    shutil.move(os.path.join(path, file_cid), new_filepath)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Download content from IPFS using CID and Key.')
    parser.add_argument('cid', type=str, help='The CID of the content to download')
    parser.add_argument('key', type=str, help='The key for the content')

    args = parser.parse_args()
    cid = args.cid
    key = args.key
    # print("ok1")

    # 使用Tkinter打开文件保存对话框
    root = Tk()
    root.withdraw()  # 隐藏主窗口
    file_path = asksaveasfilename(title="Save the downloaded file as", defaultextension="")
    # 临时路径
    tmp_path = "tmp"
    cid = cid.strip('\r\n')
    print("ok")

    if file_path:
        download_file(key, file_path, cid, tmp_path)
        print("File downloaded and saved as {file_path}")
    else:
        print("File download canceled.")

