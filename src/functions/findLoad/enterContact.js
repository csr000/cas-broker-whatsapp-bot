"use strict";
import Whatsapp from "../../config/whatsapp";
import connection from "../../config/db";

export default async function enterContact(
  typeOfMsg,
  buttonReplyID,
  recipientPhone,
  message_id,
  res
) {
  if (typeOfMsg === "simple_button_message" && buttonReplyID === "find_load") {
    // update latest question
    connection.query(
      `UPDATE post_load SET latest_question = 'find_load contact' WHERE phone_no = '${recipientPhone}';`,
      (err, res, fields) => {
        if (err) throw err;
      }
    );

    // send "select transaction type" + transaction types (list)
    await Whatsapp.sendText({
      recipientPhone: recipientPhone,
      message: "Enter your mobile number \nAdd country code. \neg: 233245108888",
    });

    await Whatsapp.markMessageAsRead({
      message_id,
    });
    
    return res.sendStatus(200);
  }
}
