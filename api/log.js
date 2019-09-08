
exports.printLog = function printLog(req) {
    const today = new Date();
    
    const clientIp = function (req) {
        let ipAddress;
        let forwardedIpsStr = req.header('x-forwarded-for'); 
        if (forwardedIpsStr) {
          const forwardedIps = forwardedIpsStr.split(',');
          ipAddress = forwardedIps[0];
        }
        if (!ipAddress) {
          ipAddress = req.connection.remoteAddress;
        }
        return ipAddress.split("::ffff:")[1];
      }(req);

    console.log(`IP ${clientIp}\n${req.url}  >>  ${today.toString()}`);
}