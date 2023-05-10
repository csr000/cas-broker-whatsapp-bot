'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';
import { titleCase } from '../../routes';

/**
    This function updates the customer's latest question in the database
    and sends a message asking them to select a destination region.
*/

export default async function (
    recipientPhone,
    message_id,
    res
) {
    // update latest question
    connection.query(
        `UPDATE whatsapp_cloud SET latest_question = 'select destination region' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) throw err;
        }
    );

    // send "select destination region" + destination regions (list)
    let message = '';
    connection.query(`SELECT name FROM regions`, async (err, rows, fields) => {
        if (err) throw err;
        rows = JSON.parse(JSON.stringify(rows));
        for (let i = 0; i < rows.length; i++) {
            message = message.concat(
                `${i + 1}. ${titleCase(
                    rows[i].name.toLowerCase().replace(' region', '')
                )}\n`
            );
        }

        await Whatsapp.sendText({
            recipientPhone: recipientPhone,
            message: 'Select destination region\n\n' + message,
        });
    });
    await Whatsapp.markMessageAsRead({
        message_id,
    });
    // break
    return res.sendStatus(200);
}
