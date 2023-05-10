'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';

export default async function selectT_and_C(
    recipientPhone,
    textMessage,
    res,
    message_id
) {
    connection.query(
        `SELECT latest_question FROM post_load WHERE phone_no = '${recipientPhone}'`,
        async (err, rows, fields) => {
            if (err) throw err;
            const { latest_question } = rows[0];

            if (latest_question === 'recievers contact') {
                sdrAction(textMessage, recipientPhone);
                // send "Enter your active number"
                await Whatsapp.sendText({
                    recipientPhone: recipientPhone,
                    message: `TERMS AND CONDITIONS \nDetermination of Charges. The Customer is responsible for all charges payable for Customer’s shipment(s). Such charges may include transportation, fuel and other applicable accessorial charges, any charges made by the Carrier(s) after the shipment, and all duties, customs assessments, governmental penalties, fines and taxes. We will have no obligation to make any payments or honor any rate quotes in any of the following instances: (i) the unauthorized alteration or use of the BOL, or (ii) tendering of shipments to any Carrier other than that designated by us for the Order, or (iii) the use of any BOL not authorized or issued by us. We reserve the right to amend or adjust charges and to re-invoice the Customer in the following events: (a) if the original quoted amount was based upon incorrect information provided by the Customer; (b) if additional services by the Carrier were required; and or (c) if the Customer authorized the Carrier to perform the pickup, transportation and delivery functions other than contemplated by the BOL. \nReply with: \n\n 1. I Agree 2. I Don't Agree`,
                });

                await Whatsapp.markMessageAsRead({
                    message_id,
                });
                return res.sendStatus(200);
            }
        }
    );
}

function sdrAction(message, recipientPhone) {
    let flag = 0;
    connection.query(
        `UPDATE post_load SET recievers_contact = '${message}' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) flag = 1;
        }
    );

    connection.query(
        `UPDATE post_load SET latest_question = 't and c' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) flag = 1;
        }
    );
    return !Boolean(flag);
}
