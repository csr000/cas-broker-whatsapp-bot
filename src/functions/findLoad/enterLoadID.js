'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';

export default async function enterLoadID(
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

            if (latest_question === 'contact') {
                if (sdrAction(textMessage, recipientPhone) === 'not-found') {
                    // send "Enter your active number"
                    await Whatsapp.sendText({
                        recipientPhone: recipientPhone,
                        message: 'Number not found',
                    });
                } else {
                    // send "Enter your active number"
                    await Whatsapp.sendText({
                        recipientPhone: recipientPhone,
                        message: 'Enter Load ID',
                    });
                }

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
    const rows = connection.query(
        `SELECT contact from post_load WHERE contact = '${message}';`,
        (err, res, fields) => {
            if (err) flag = 1;
        }
    );

    if (!rows.length) {
        return 'not-found';
    } else {
        connection.query(
            `UPDATE post_load SET latest_question = 'load id' WHERE phone_no = '${recipientPhone}';`,
            (err, res, fields) => {
                if (err) flag = 1;
            }
        );
    }

    return !Boolean(flag);
}
