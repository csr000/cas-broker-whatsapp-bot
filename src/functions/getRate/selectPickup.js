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

function spdAction(message, recipientPhone) {
    let flag = 0;

    connection.query(
        `SELECT destination_region FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
        async (err, rows, fields) => {
            if (err) throw err;

            connection.query(
                `SELECT name FROM destinationrates WHERE region_id = '${rows[0].destination_region}'`,
                async (err, rows, fields) => {
                    if (err) throw err;

                    let pickups = ['_'];

                    for (let i = 0; i < rows.length; i++) {
                        pickups.push(rows[i].name);
                    }

                    connection.query(
                        `UPDATE whatsapp_cloud SET pickup_destination = '${pickups[message]}' WHERE phone_no = '${recipientPhone}';`,
                        (err, res, fields) => {
                            if (err) flag = 1;
                        }
                    );
                }
            );

            connection.query(
                `UPDATE whatsapp_cloud SET latest_question = 'select type of container' WHERE phone_no = '${recipientPhone}';`,
                (err, res, fields) => {
                    if (err) flag = 1;
                }
            );
        }
    );
    return !Boolean(flag);
}