"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var WhatsappCloudAPI = require("whatsappcloudapi_wrapper");
var Whatsapp = new WhatsappCloudAPI({
  accessToken: process.env.Meta_WA_accessToken,
  senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
  WABA_ID: process.env.Meta_WA_wabaId
});
var _default = Whatsapp;
exports["default"] = _default;
//# sourceMappingURL=whatsapp.js.map