# -*- coding: utf-8 -*-

import ipfs_api
import argparse
import new_cypher
import os

def upload_file(file_path: str):
    file_cid = ipfs_api.publish(file_path)
    return file_cid

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Upload content to IPFS and Key for encryption.')
    parser.add_argument('filepath', type=str, help='The file path to upload')
    parser.add_argument('key', type=str, help='The key for the content')
    args = parser.parse_args()
    filepath = args.filepath
    key = args.key
    try:
        if not os.path.exists('./tmp'):
            os.mkdir('tmp')
        filepath = filepath.replace("\\\\", "/").strip()
        filename = filepath.split('/')[-1]
        newpath = os.path.join('./tmp', filename)
        with open(filepath, "rb") as source_file:
            with open(newpath, "wb") as target_file:
                target_file.write(source_file.read())
        
        key = key.split(',')
        key_arr = []
        for i in key:
            key_arr.append(int(i))
        new_cypher.aes_encrypt_file(key_arr = key_arr, file_path=newpath)
        file_cid = upload_file(newpath)
        # print the CID to stdout
        print(file_cid)
    except Exception as e:
        print(str(e))