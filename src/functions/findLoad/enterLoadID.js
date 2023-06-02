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


      if (latest_question === "find_load contact") {
        sdrAction(textMessage, recipientPhone)
          .then(async (result) => {
            console.log(result); // Output: 'found', 'not-found', or 'error'
            if (result === "not-found") {
              await Whatsapp.sendText({
                recipientPhone: recipientPhone,
                message: "Your phone number is not found in our registry, please visit our website www.casbroker.com to register as a driver or transport manager or call our offices on 0264630671 for assistance.",
              });
            } else {
              await Whatsapp.sendText({
                recipientPhone: recipientPhone,
                message: "Enter Load ID",
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
    const query = `SELECT phone_no from post_load WHERE phone_no = '${message}';`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error:", err);
        reject("error");
      } else {
        if (results.length > 0) {
          connection.query(
            `UPDATE post_load SET latest_question = 'find_load load id' WHERE phone_no = '${recipientPhone}';`,
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
