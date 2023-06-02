'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';

export default async function enterPickupDate(
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

            if (latest_question === 'number of truck needed') {
                sdrAction(textMessage, recipientPhone);
                await Whatsapp.sendText({
                    recipientPhone: recipientPhone,
                    message: 'Enter pickup date \n\n format: dd/mm/yyyy \neg: 30/01/2023',
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
        `UPDATE post_load SET no_of_truck_needed = '${message}' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) flag = 1;
        }
    );

    connection.query(
        `UPDATE post_load SET latest_question = 'pickup date' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) flag = 1;
        }
    );
    return !Boolean(flag);
}
