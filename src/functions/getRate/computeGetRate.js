import getRate from ".";
import selectDestination from "./selectDestination";
import selectPickup from "./selectPickup";
import selectContainerType from "./selectContainerType";
import selectContainerNum from "./selectContainerNum";

export default async function computeGetRate(params) {
  const {
    typeOfMsg,
    buttonReplyID,
    recipientPhone,
    message_id,
    res,
    textMessage,
    incomingMessage,
  } = params;
  
  await getRate(recipientPhone, message_id, res);
  /////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////  if latest_question == "select destination region" ///////////////////////////
  await selectDestination(recipientPhone, textMessage, res, message_id);
  /////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////  if latest_question == "select pickup destination": /////////////////////////
  await selectPickup(recipientPhone, textMessage, message_id, res);
  /////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////  if latest_question == "select type of container"  /////////////////////////
  await selectContainerType(
    typeOfMsg,
    incomingMessage,
    recipientPhone,
    message_id,
    res
  );
  /////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////  if latest_question == "number of containers"  /////////////////////////
  await selectContainerNum(recipientPhone, textMessage, message_id, res);
}
