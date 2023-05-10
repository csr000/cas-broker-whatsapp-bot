import selectTransactionType from './selectTransactionType';
import enterContact from './enterContact';
import enterEmail from './enterEmail';

export default async function computePostLoad(
    recipientPhone,
    message_id,
    res,
    textMessage
) {
    await selectTransactionType(recipientPhone, message_id, res);

    await enterContact(recipientPhone, textMessage, res, message_id);

    await enterEmail(recipientPhone, textMessage, res, message_id);

    await enterBLNumber(recipientPhone, textMessage, res, message_id);

    await enterDestinationCity(recipientPhone, textMessage, res, message_id);

    await selectLoadingFormat(recipientPhone, textMessage, res, message_id);

    await enterNumberOfTruckNeeded(
        recipientPhone,
        textMessage,
        res,
        message_id
    );

    await enterPickupDate(recipientPhone, textMessage, res, message_id);

    await enterRecieversContact(recipientPhone, textMessage, res, message_id);

    await selectT_and_C(recipientPhone, textMessage, res, message_id);

    await final(recipientPhone, textMessage, res, message_id);
}
