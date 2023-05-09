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

function ncAction(message, recipientPhone) {
  let flag = 0;
  let no_of_container = message;
  connection.query(
      `UPDATE whatsapp_cloud SET no_of_container = '${no_of_container}' WHERE phone_no = '${recipientPhone}';`,
      (err, res, fields) => {
          if (err) flag = 1;
      }
  );

  connection.query(
      `UPDATE whatsapp_cloud SET latest_question = 'new' WHERE phone_no = '${recipientPhone}';`,
      (err, res, fields) => {
          if (err) flag = 1;
      }
  );

  // calc rate
  connection.query(
      `SELECT * FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
      async (err, rows, fields) => {
          if (err) throw err;
          let { container_type } = rows[0];
          let { destination_region } = rows[0];
          let { pickup_destination } = rows[0];

          if (container_type === 'container_20') {
              connection.query(
                  `SELECT rate_twenty FROM destinationrates WHERE region_id = '${destination_region}' AND name = '${pickup_destination}'`,
                  async (err, rows, fields) => {
                      if (err) throw err;
                      let rate = rows[0].rate_twenty * no_of_container;

                      await Whatsapp.sendText({
                          recipientPhone: recipientPhone,
                          message: `The rate is: GHC ${rate}`,
                      });
                  }
              );
          }

          if (container_type === 'container_40') {
              connection.query(
                  `SELECT rate_forty FROM destinationrates WHERE region_id = '${destination_region}' AND name = '${pickup_destination}'`,
                  async (err, rows, fields) => {
                      if (err) throw err;
                      let rate = rows[0].rate_forty * no_of_container;

                      await Whatsapp.sendText({
                          recipientPhone: recipientPhone,
                          message: `The rate is: GHC ${rate}`,
                      });
                  }
              );
          }
      }
  );

  return !Boolean(flag);
}
