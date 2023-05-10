export default async function computeGetRate(
    recipientPhone,
    message_id,
    res,
    textMessage
) {
    await enterContact(recipientPhone, textMessage, res, message_id);
    await enterLoadID(recipientPhone, textMessage, res, message_id);
    await selectLoadID(recipientPhone, textMessage, res, message_id);
    await enterTruckNumber(recipientPhone, textMessage, res, message_id);
    await final(recipientPhone, textMessage, res, message_id);
}
