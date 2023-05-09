// const WhatsappCloudAPI = require("whatsappcloudapi_wrapper");
import WhatsappCloudAPI from "whatsappcloudapi_wrapper"

const Whatsapp = new WhatsappCloudAPI({
  accessToken: process.env.Meta_WA_accessToken,
  senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
  WABA_ID: process.env.Meta_WA_wabaId,
});

export default Whatsapp