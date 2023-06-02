"use strict";
import Whatsapp from "../../config/whatsapp";
import connection from "../../config/db";

export default async function enterLoadID(
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

      if (latest_question === "find_load load id") {
        sdrAction(textMessage, recipientPhone)
          .then(async (result) => {
            console.log(result); // Output: 'found', 'not-found', or 'error'
            if (result === "not-found") {
              await Whatsapp.sendText({
                recipientPhone: recipientPhone,
                message: "ID not found",
              });
            } else {
              await Whatsapp.sendText({
                recipientPhone: recipientPhone,
                message: "Enter truck number",
              });
            }
          })
          .catch((err) => {
            console.error("Error:", err);
          });

        await Whatsapp.markMessageAsRead({
          message_id,
        });
        return res.sendStatus(200);
      }
    }
  );
}

async function sdrAction(message, recipientPhone) {
  return new Promise((resolve, reject) => {
    const query = `SELECT load_id from post_load WHERE load_id = '${message}';`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error:", err);
        reject("error");
      } else {
        if (results.length > 0) {
          connection.query(
            `UPDATE post_load SET latest_question = 'find_load truck no' WHERE phone_no = '${recipientPhone}';`,
            (err, res, fields) => {
              resolve("found");
            }
          );
        } else {
          resolve("not-found");
        }
      }
    });
  });
}
