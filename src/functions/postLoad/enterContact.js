'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';

export default async function enterContact(
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

            if (latest_question === 'transaction type') {
                sdrAction(textMessage, recipientPhone);
                await Whatsapp.sendText({
                    recipientPhone: recipientPhone,
                    message: 'Enter your active number',
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
        `UPDATE post_load SET transaction_type = '${message}' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) flag = 1;
        }
    );

    connection.query(
        `UPDATE post_load SET latest_question = 'contact' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) flag = 1;
        }
    );
    return !Boolean(flag);
}
