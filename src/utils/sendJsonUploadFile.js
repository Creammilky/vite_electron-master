import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { host, logPath, dataPath, pemPath, root } from '@/global'

export function getFileAbsPath(successCallback, errorCallback) {
    const { spawn } = require('child_process');

    // 指定Python脚本的路??
    const pythonScript = root + '\\src\\scripts\\path.py';

    // 运???Python脚本，打开一个Python进程
    const pythonProcess = spawn('python', [pythonScript]);

    // 处理Python脚本的标准输??
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        // 在这里调用successCallback，并把数??传递给callback
        successCallback(data.toString());
    });

    // 处理Python脚本的标准错??输出
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        // 在这里调用errorCallback，并把数??传递给callback
        errorCallback(data.toString());
    });

    // 处理Python脚本的退出事??
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

export function uploadToIPFS(filepath, key, enc_key, successCallback, errorCallback) {
    const { spawn } = require('child_process');

    // 指定Python脚本的路??
    const pythonScript = root + '\\src\\scripts\\ipfs_upload.py';

    // 运???Python脚本，打开一个Python进程
    const pythonProcess = spawn('python', [pythonScript, filepath, key]);

    // 处理Python脚本的标准输??
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        // 在这里调用successCallback，并把数??传递给callback
        successCallback(data.toString(), enc_key);
    });

    // 处理Python脚本的标准错??输出
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        // 在这里调用errorCallback，并把数??传递给callback
        errorCallback(data.toString());
    });

    // 处理Python脚本的退出事??
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

// export function sendJsonUploadFileToServer(formData, successCallback, errorCallback) {
//     const url = `http://${serverIp}:5000/upload-file`;

//     // 鐢熸垚 AES 瀵嗛挜
//     const aesKey = crypto.randomBytes(32); // 256 浣? AES 瀵嗛挜

//     // 鍔犺浇鍏?閽?
//     const publicKeyPath = path.join(__dirname, '../log/publicKey.pem');
//     const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

//     // 浣跨敤鍏?閽ュ姞瀵? AES 瀵嗛挜
//     const encryptedAesKey = crypto.publicEncrypt(publicKey, aesKey);

//     // 灏嗗姞瀵嗗悗鐨? AES 瀵嗛挜杞?鎹?涓? Base64 瀛楃?︿覆浠ヤ究鍦? JSON 涓?浼犺緭
//     const encryptedKeyBase64 = encryptedAesKey.toString('base64');

//     // 鏋勯�? JSON 鏁版嵁
//     const jsonData = {
//         username: formData.username,
//         cid: formData.cid,
//         filename: formData.fileName,
//         description: formData.description,
//         accessType: formData.sharePermission,
//         share_person: formData.sharePerson,
//         encrypted_key: encryptedKeyBase64,
//     };

//     // 鍙戦�? POST 璇锋眰
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(jsonData),
//     })
//     .then(response => response.json())
//     .then(data => {
//         successCallback(data);
//     })
//     .catch(error => {
//         errorCallback(error);
//     });
// }
