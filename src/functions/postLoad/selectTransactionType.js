'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';

export default async function (recipientPhone, message_id, res) {
    // update latest question
    connection.query(
        `UPDATE post_load SET latest_question = 'transaction type' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) throw err;
        }
    );

    // send "select transaction type" + transaction types (list)
    await Whatsapp.sendText({
        recipientPhone: recipientPhone,
        message: `Select Transaction type \n1. Pick up Import \n2. Drop off Export`,
    });

    await Whatsapp.markMessageAsRead({
        message_id,
    });
    // break
    return res.sendStatus(200);
}
