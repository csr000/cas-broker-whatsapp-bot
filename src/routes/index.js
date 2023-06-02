"use strict";

import Whatsapp from "../config/whatsapp";
import connection from "../config/db";
import testWaCallbackUrl from "../helpers/testWaCallbackUrl";
import computeGetRate from "../functions/getRate/computeGetRate";
import express from "express";
import computePostLoad from "../functions/postLoad/computePostLoad";
import computeFindLoad from "../functions/findLoad/computeFindLoad";


const router = express.Router();

router.get("/meta_wa_callbackurl", (req, res) => {
  try {
    testWaCallbackUrl(req, res);
  } catch (error) {
    console.error({ error });
    return res.sendStatus(500);
  }
});

router.post("/meta_wa_callbackurl", async (req, res) => {
  console.log("POST: Someone is pinging me!");

  try {
    let data = Whatsapp.parseMessage(req.body);

    console.log("dataxx", data);
    // console.log('req.body', req.body.entry[0].changes)
    // data.notificationMessage && console.log("CONVERSATIONXX", data.notificationMessage.conversation.origin )

    if (data?.isMessage) {
      let incomingMessage = data.message;
      let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
      let recipientName = incomingMessage.from.name;
      let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
      let message_id = incomingMessage.message_id; // extract the message id
      let textMessage = incomingMessage.text?.body; // extract text message body

      // if msg === "hi" ///////////////////////////////////////////////////////////////
      if (
        textMessage &&
        ["hi", "hello"].includes(textMessage.trim().toLowerCase())
      ) {
        connection.query(
          `INSERT INTO whatsapp_cloud (phone_no, username) VALUES ('${recipientPhone}', '${recipientName}');`,
          (err, res, fields) => {
            if (err) {
              connection.query(
                `UPDATE whatsapp_cloud SET latest_question = 'new' WHERE phone_no = '${recipientPhone}';`,
                (err, res, fields) => {
                  if (err) throw err;
                }
              );
            }
          }
        );
        connection.query(
          `INSERT INTO post_load (phone_no, username) VALUES ('${recipientPhone}', '${recipientName}');`,
          (err, res, fields) => {
            if (err) {
              connection.query(
                `UPDATE post_load SET latest_question = 'new' WHERE phone_no = '${recipientPhone}';`,
                (err, res, fields) => {
                  if (err) throw err;
                }
              );
            }
          }
        );

        await Whatsapp.sendSimpleButtons({
          message: `Welcome to CAS BROKER, ${recipientName}.\nWhat do you want to do?`,
          recipientPhone: recipientPhone,
          listOfButtons: [
            {
              title: "Get rate",
              id: "get_rate",
            },
            {
              title: "Find load",
              id: "find_load",
            },
            {
              title: "Post load",
              id: "post_load",
            },
            // {
            //   title: "Speak to a human",
            //   id: "speak_to_human",
            // },
          ],
        });
        await Whatsapp.markMessageAsRead({
          message_id,
        });
        return res.sendStatus(200); // break
      }
      // End if msg === "hi" ////////////////////////////////////////////////////////////////////////
      console.log({ typeOfMsg });

      // button_reply == "get_rate"
      await computeGetRate({
        typeOfMsg,
        buttonReplyID: incomingMessage.button_reply && incomingMessage.button_reply.id,
        recipientPhone,
        message_id,
        res,
        textMessage,
        incomingMessage,
      });

      // button_reply == "find_load"
      await computeFindLoad({
        typeOfMsg,
        buttonReplyID: incomingMessage.button_reply && incomingMessage.button_reply.id,
        recipientPhone,
        message_id,
        res,
        textMessage,
        incomingMessage,
      });
      
      // button_reply == "post_load"
      await computePostLoad({
        typeOfMsg,
        buttonReplyID: incomingMessage.button_reply && incomingMessage.button_reply.id,
        recipientPhone,
        message_id,
        res,
        textMessage,
        incomingMessage,
      });

     
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error({ error });
    return res.sendStatus(500);
  }

  //   connection.end()
});

export function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

// module.exports = router;
export default router;
