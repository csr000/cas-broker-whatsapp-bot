'use strict';
import Whatsapp from '../../config/whatsapp';
import connection from '../../config/db';
import { sdrAction, titleCase } from '../../routes';

export default async function selectDestination(recipientPhone, textMessage, res, message_id) {
  connection.query(
    `SELECT latest_question FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
    async (err, rows, fields) => {
      if (err)
        throw err;
      const latest_question = rows[0].latest_question;

      if (latest_question === 'select destination region') {
        sdrAction(textMessage, recipientPhone);
        // send "select pickup destination" + pickup destinations (list)
        let message = '';

        connection.query(
          `SELECT destination_region FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
          async (err, rows, fields) => {
            if (err)
              throw err;

            connection.query(
              `SELECT name FROM destinationrates WHERE region_id = '${rows[0].destination_region}'`,
              async (err, rows, fields) => {
                if (err)
                  throw err;
                rows = JSON.parse(JSON.stringify(rows));
                for (let i = 0; i < rows.length; i++) {
                  message = message.concat(
                    `${i + 1}. ${titleCase(
                      rows[i].name.toLowerCase()
                    )}\n`
                  );
                }
                console.log(res);
                await Whatsapp.sendText({
                  recipientPhone: recipientPhone,
                  message: 'Select pickup destination\n\n' +
                    message,
                });
              }
            );
          }
        );
        await Whatsapp.markMessageAsRead({
          message_id,
        });
        return res.sendStatus(200);
      }
    }
  );
}
