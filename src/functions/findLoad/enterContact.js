'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';

export default async function (recipientPhone, message_id, res) {
    // update latest question
    connection.query(
        `UPDATE post_load SET latest_question = 'contact' WHERE phone_no = '${recipientPhone}';`,
        (err, res, fields) => {
            if (err) throw err;
        }
    );

    // send "select transaction type" + transaction types (list)
    await Whatsapp.sendText({
        recipientPhone: recipientPhone,
        message: "Enter your mobile number",
    });

    await Whatsapp.markMessageAsRead({
        message_id,
    });
    // break
    return res.sendStatus(200);
}
