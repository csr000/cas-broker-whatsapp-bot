import getRate from '../functions/getRate';
import selectDestination from '../functions/getRate/selectDestination';
import selectPickup from '../functions/getRate/selectPickup';
import selectContainerType from '../functions/getRate/selectContainerType';
import selectContainerNum from '../functions/getRate/selectContainerNum';

export default async function computeGetRate(
    typeOfMsg,
    incomingMessage,
    recipientPhone,
    message_id,
    res,
    textMessage
) {
    await getRate(
        typeOfMsg,
        incomingMessage.button_reply.id,
        recipientPhone,
        message_id,
        res
    );
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
