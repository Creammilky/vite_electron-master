async handleRegister() {
    // 生成密钥对并保存
generateKeyPair().then(async keyPair => {
  const publicKeyPem = await exportPublicKey(keyPair.publicKey);
  const privateKeyPem = await exportPrivateKey(keyPair.privateKey);
  // 保存公钥和私钥
  saveKeyToFile('publicKey.pem', publicKeyPem);
  saveKeyToFile('privateKey.pem', privateKeyPem);
    });
this.loading = true;
this.errorMessage = ''; // 清空错误信息
try {
  fs.readFile('../../log/publicKey.pem', 'utf8', async (err, content) => {
    if (err) {
      this.errorMessage='读取文件失败';
      return;
    }
    this.errorMessage='1111';
    this.fileContent = content; 
    // 构建要发送的数据对象
    // const json_data = {
    //   username: this.userInfo.username,
    //   password: this.userInfo.password,
    //   public_key: fileContent  // 这里直接发送文件内容
    // };
  });
  const registerUrl = 'http://10.21.188.221:5008/sign-up-client'; // 替换为实际的注册 API URL
  const json_data = {
      username: this.userInfo.username,
      password: this.userInfo.password,
      public_key: this.fileContent  // 假设前端可以指定路径，实际操作可能需要不同的处理
    };
  const response =axios({url:registerUrl, 
              method: 'post',
              data:JSON.stringify(json_data),
              headers: { 'content-type': 'application/json' }}
              )
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                });
  if (response.status === 200) {

    // 跳转到登录或其他页面
    this.$router.push({ name: 'Login' }); // 假设登录页面的路由名为 'Login'
    this.loading = false;
  } else {
    this.errorMessage = response.data.message;
    this.loading = false;
  }
} catch (error) {
  this.errorMessage = error.message || 'An error occurred during the registration.';
  this.loading = false;
}

// 定义生成密钥对的函数
function generateKeyPair() {
    try {
        const keyPair = window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,  // 密钥长度
            publicExponent: new Uint8Array([1, 0, 1]),  // 通常为65537
            hash: "SHA-256",  // 使用的哈希算法
        }, 
        true,  // 密钥是否可导出
        ["encrypt", "decrypt"]);  // 密钥用途
        return keyPair;
    } catch (error) {
        console.error("密钥生成错误：", error);
    }
  }

  // 导出公钥
  function exportPublicKey(key) {
      const exported =  window.crypto.subtle.exportKey("spki", key);
      const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
      return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  }

  // 导出私钥
  function exportPrivateKey(key) {
      const exported =window.crypto.subtle.exportKey("pkcs8", key);
      const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
      return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
  }

  // 保存文件到本地
  function saveKeyToFile(filename, content) {
      const filePath = path.join('../../log', filename);
      fs.writeFile(filePath, content, (err) => {
          if (err) {
              console.error('文件保存失败:', err);
          } else {
              console.log(`${filename} 已保存至 ${filePath}`);
          }
      });
  }
}
}
