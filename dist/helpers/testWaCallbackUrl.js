"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(req, res) {
  console.log('GET: Someone is pinging me!');
  var mode = req.query['hub.mode'];
  var token = req.query['hub.verify_token'];
  var challenge = req.query['hub.challenge'];
  if (mode && token && mode === 'subscribe' && process.env.Meta_WA_VerifyToken === token) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
}
//# sourceMappingURL=testWaCallbackUrl.js.map