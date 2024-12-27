const criptoEncoding = (data) =>{
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(privateKey), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  const criptoDecoding = (data) => {
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(privateKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

export {criptoEncoding, criptoDecoding}