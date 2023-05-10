import selectTransactionType from './selectTransactionType';
import enterContact from './enterContact';
import enterEmail from './enterEmail';
import enterBLNumber from './enterBLNumber';
import enterDestinationCity from './enterDestinationCity';
import selectLoadingFormat from './selectLoadingFormat';
import enterNumberOfTruckNeeded from './enterNumberOfTruckNeeded';
import enterPickupDate from './enterPickupDate';
import enterRecieversContact from './enterRecieversContact';
import selectT_and_C from './selectT_and_C';
import final from './final';

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
