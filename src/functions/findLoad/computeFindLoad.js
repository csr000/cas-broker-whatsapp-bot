import enterContact from "./enterContact";
import enterLoadID from "./enterLoadID";
import enterTruckNumber from "./enterTruckNumber";
import final from "./final";
import selectLoadID from "./selectLoadID";

export default async function computePostLoad(params) {
  const {
    typeOfMsg,
    buttonReplyID,
    recipientPhone,
    message_id,
    res,
    textMessage,
    incomingMessage,
  } = params;
  await enterContact(
    typeOfMsg,
    buttonReplyID,
    recipientPhone,
    textMessage,
    res,
    message_id
  );
  await enterLoadID(recipientPhone, textMessage, res, message_id);
  // await selectLoadID(recipientPhone, textMessage, res, message_id);
  await enterTruckNumber(recipientPhone, textMessage, res, message_id);
  await final(recipientPhone, textMessage, res, message_id);
}
