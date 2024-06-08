import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { host, logPath, dataPath, pemPath, root } from '@/global'
export function DownloadFromIPFS(cid,key,successCallback, errorCallback) {
    const { spawn } = require('child_process');

    // 指定Python脚本的路�?
    const pythonScript = root + '\\src\\scripts\\download.py';

    // 运�?�Python脚本，传递cid和key参数
    const pythonProcess = spawn('python', [pythonScript, cid, key]);

    // 处理Python脚本的标准输�?
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        // 在这里调用successCallback，并把数�?传递给callback
        successCallback(data.toString());
    });

    // 处理Python脚本的标准错�?输出
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        // 在这里调用errorCallback，并把数�?传递给callback
        errorCallback(data.toString());
    });

    // 处理Python脚本的退出事�?
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}


// export function sendJsonDownloadFileToServer(formData, serverIp, successCallback, errorCallback) {
//     const url = `http://${serverIp}:5000/download-file`;
//     const jsonData = {
//         username: formData.username,
//         filename: formData.filename,
//     };

//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(jsonData),
//     })
//     .then(response => response.json())
//     .then(data => {
//         try {
//             // 加载私钥
//             const privateKeyPath = path.join(__dirname, '../log/privateKey.pem');
//             const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

//             // 使用私钥解密返回的加密字符串
//             const encryptedData = Buffer.from(data.encrypted_data, 'base64');
//             const decryptedData = crypto.privateDecrypt(
//                 {
//                     key: privateKey,
//                 },
//                 encryptedData
//             );
//             // 解析解密后的数据
//             const decryptedKey = JSON.parse(decryptedData.toString('utf8'));
      
//             //在这里解密下载的文件

//             successCallback(decryptedKey);
//         } catch (error) {
//             errorCallback(error);
//         }
//     })
//     .catch(error => {
//         errorCallback(error);
//     });
// }
