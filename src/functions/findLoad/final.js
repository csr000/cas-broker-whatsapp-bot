"use strict";
import Whatsapp from "../../config/whatsapp";
import connection from "../../config/db";

export default async function final(
  recipientPhone,
  textMessage,
  res,
  message_id
) {
  connection.query(
    `SELECT latest_question, load_id FROM post_load WHERE phone_no = '${recipientPhone}'`,
    async (err, rows, fields) => {
      if (err) throw err;
      const { latest_question, load_id } = rows[0];

      if (latest_question === "find_load truck no") {
        if (
          ["GN32423", "GR55518", "NR456719", "AS22223", "BA171720"].includes(
            textMessage
          )
        ) {
          sdrAction(textMessage, recipientPhone);
          await Whatsapp.sendText({
            recipientPhone: recipientPhone,
            message:
              "Load " +
              load_id +
              " has been issued to you successfully and is pending confirmation. Please contact 0264630671 for final arrangements's. Thank you or using casbroker. Visit www.casbroker.com for further details.",
          });
        } else {
          await Whatsapp.sendText({
            recipientPhone: recipientPhone,
            message:
              "Your vehicle is not found in our registry. We require all vehicles to be registered as this guarantees safety protocols for both our cherished drivers and customers. Please visit our website www.casbroker.com or call 0264630671 for further assistance.",
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

  connection.query(
    `UPDATE post_load SET is_issued = '1' WHERE phone_no = '${recipientPhone}';`,
    (err, res, fields) => {
      if (err) flag = 1;
    }
  );

  connection.query(
    `UPDATE post_load SET latest_question = 'new' WHERE phone_no = '${recipientPhone}';`,
    (err, res, fields) => {
      if (err) flag = 1;
    }
  );
  return !Boolean(flag);
}
