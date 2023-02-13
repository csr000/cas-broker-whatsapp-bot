'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';
import { ncAction } from '../../routes';

export default async function selectContainerNum(recipientPhone, textMessage, message_id, res) {
  connection.query(
    `SELECT latest_question FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
    async (err, rows, fields) => {
      if (err)
        throw err;
      const latest_question = rows[0].latest_question;

      if (latest_question === 'number of containers') {
        ncAction(textMessage, recipientPhone);

        await Whatsapp.markMessageAsRead({
          message_id,
        });
        return res.sendStatus(200);
      }
    }
  );
}
