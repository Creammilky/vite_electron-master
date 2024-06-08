import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { host, logPath, dataPath, pemPath, root } from '@/global'

export function getFileAbsPath(successCallback, errorCallback) {
    const { spawn } = require('child_process');

    // ָ��Python�ű���·??
    const pythonScript = root + '\\src\\scripts\\path.py';

    // ��???Python�ű�����һ��Python����
    const pythonProcess = spawn('python', [pythonScript]);

    // ����Python�ű��ı�׼��??
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        // ���������successCallback��������??���ݸ�callback
        successCallback(data.toString());
    });

    // ����Python�ű��ı�׼��??���
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        // ���������errorCallback��������??���ݸ�callback
        errorCallback(data.toString());
    });

    // ����Python�ű����˳���??
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

export function uploadToIPFS(filepath, key, enc_key, successCallback, errorCallback) {
    const { spawn } = require('child_process');

    // ָ��Python�ű���·??
    const pythonScript = root + '\\src\\scripts\\ipfs_upload.py';

    // ��???Python�ű�����һ��Python����
    const pythonProcess = spawn('python', [pythonScript, filepath, key]);

    // ����Python�ű��ı�׼��??
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        // ���������successCallback��������??���ݸ�callback
        successCallback(data.toString(), enc_key);
    });

    // ����Python�ű��ı�׼��??���
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        // ���������errorCallback��������??���ݸ�callback
        errorCallback(data.toString());
    });

    // ����Python�ű����˳���??
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

// export function sendJsonUploadFileToServer(formData, successCallback, errorCallback) {
//     const url = `http://${serverIp}:5000/upload-file`;

//     // 生成 AES 密钥
//     const aesKey = crypto.randomBytes(32); // 256 �? AES 密钥

//     // 加载�?�?
//     const publicKeyPath = path.join(__dirname, '../log/publicKey.pem');
//     const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

//     // 使用�?钥加�? AES 密钥
//     const encryptedAesKey = crypto.publicEncrypt(publicKey, aesKey);

//     // 将加密后�? AES 密钥�?�?�? Base64 字�?�串以便�? JSON �?传输
//     const encryptedKeyBase64 = encryptedAesKey.toString('base64');

//     // 构�? JSON 数据
//     const jsonData = {
//         username: formData.username,
//         cid: formData.cid,
//         filename: formData.fileName,
//         description: formData.description,
//         accessType: formData.sharePermission,
//         share_person: formData.sharePerson,
//         encrypted_key: encryptedKeyBase64,
//     };

//     // 发�? POST 请求
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
