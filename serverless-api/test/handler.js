const https = require('https');

const getNaver = () => new Promise((resolve, reject) => {
    https.get('https://www.naver.com', (resp) => {
      let data = '';
    
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });
    
    }).on("error", (err) => {
      reject(err);
    });
});

exports.handler = async (event) => {
    
    // TODO implement
    return await getNaver();
};
