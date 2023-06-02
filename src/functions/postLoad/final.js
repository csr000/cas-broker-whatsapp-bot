"use strict";
import Whatsapp from "../../config/whatsapp";
import connection from "../../config/db";
import crypto from "crypto";

function generateHash() {
  const timestamp = Date.now().toString();
  console.log(timestamp);
  const hash = crypto.createHash("sha256").update(timestamp).digest("hex");
  const truncatedHash = hash.slice(0, 6);

  return truncatedHash;
}

const hash = generateHash();

export default async function final(
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

      if (latest_question === "t and c") {
        sdrAction(textMessage, recipientPhone);
        await Whatsapp.sendText({
          recipientPhone: recipientPhone,
          message: "Load Posted Successful, here's your load ID: " + hash,
        });

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
    `UPDATE post_load SET t_and_c = '${message}' WHERE phone_no = '${recipientPhone}';`,
    (err, res, fields) => {
      if (err) flag = 1;
    }
  );
  
  connection.query(
    `UPDATE post_load SET load_id = '${hash}' WHERE phone_no = '${recipientPhone}';`,
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
