'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';
import { spdAction } from '../../routes';

export default async function selectPickup(recipientPhone, textMessage, message_id, res) {
  connection.query(
    `SELECT latest_question FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
    async (err, rows, fields) => {
      if (err)
        throw err;
      const latest_question = rows[0].latest_question;

      if (latest_question === 'select pickup destination') {
        spdAction(textMessage, recipientPhone);

        // send "select pickup destination" + pickup destinations (emoji list)
        await Whatsapp.sendSimpleButtons({
          message: `Select the type of container preferred`,
          recipientPhone: recipientPhone,
          message_id,
          listOfButtons: [
            { id: 20, title: '20ft' },
            { id: 40, title: '40ft' },
          ].map((category) => ({
            title: category.title,
            id: `container_${category.id}`,
          })),
        });

        await Whatsapp.markMessageAsRead({
          message_id,
        });
        return res.sendStatus(200);
      }
    }
  );
}
