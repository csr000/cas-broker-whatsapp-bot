"use strict";
const mysql = require("mysql");
const router = require("express").Router();

const WhatsappCloudAPI = require("whatsappcloudapi_wrapper");

const Whatsapp = new WhatsappCloudAPI({
  accessToken: process.env.Meta_WA_accessToken,
  senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
  WABA_ID: process.env.Meta_WA_wabaId,
});

const connection = mysql.createConnection({
  host: "mysql.afritradecenter.com",
  user: "tradeafrica",
  password: "###Afritrade124",
  database: "afritrade_dbx",
});

connection.connect();

router.get("/meta_wa_callbackurl", (req, res) => {
  try {
    console.log("GET: Someone is pinging me!");

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (
      mode &&
      token &&
      mode === "subscribe" &&
      process.env.Meta_WA_VerifyToken === token
    ) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
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

        await Whatsapp.sendSimpleButtons({
          message: `Welcome to CAS BROKER, ${recipientName}.\nWhat do you want to do?`,
          recipientPhone: recipientPhone,
          listOfButtons: [
            {
              title: "Get rate",
              id: "get_rate",
            },
            // {
            //   title: "Find load",
            //   id: "find_load",
            // },
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

      //////////////////////  button_reply == "get_rate"  //////////////////////////////////////////////
      if (
        typeOfMsg === "simple_button_message" &&
        incomingMessage.button_reply.id === "get_rate"
      ) {
        // update latest question
        connection.query(
          `UPDATE whatsapp_cloud SET latest_question = 'select destination region' WHERE phone_no = '${recipientPhone}';`,
          (err, res, fields) => {
            if (err) throw err;
          }
        );

        // send "select destination region" + destination regions (emoji list)
        let message = "";
        connection.query(
          `SELECT name FROM regions`,
          async (err, rows, fields) => {
            if (err) throw err;
            rows = JSON.parse(JSON.stringify(rows));
            for (let i = 0; i < rows.length; i++) {
              message = message.concat(
                `${i + 1}. ${titleCase(
                  rows[i].name.toLowerCase().replace(" region", "")
                )}\n`
              );
            }

            await Whatsapp.sendText({
              recipientPhone: recipientPhone,
              message: "Select destination region\n\n" + message,
            });
          }
        );
        await Whatsapp.markMessageAsRead({
          message_id,
        });
        return res.sendStatus(200); // break
      }
      /////////////////////////////////////////////////////////////////////////////////////////

      //////////////////////  if latest_question == "select destination region" //////////////////////////////////////////////
      connection.query(
        `SELECT latest_question FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
        async (err, rows, fields) => {
          if (err) throw err;
          const latest_question = rows[0].latest_question;

          if (latest_question === "select destination region") {
            sdrAction(textMessage, recipientPhone);
            // send "select pickup destination" + pickup destinations (emoji list)
            let message = "";

            connection.query(
              `SELECT destination_region FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
              async (err, rows, fields) => {
                if (err) throw err;

                connection.query(
                  `SELECT name FROM destinationrates WHERE region_id = '${rows[0].destination_region}'`,
                  async (err, rows, fields) => {
                    if (err) throw err;
                    rows = JSON.parse(JSON.stringify(rows));
                    for (let i = 0; i < rows.length; i++) {
                      message = message.concat(
                        `${i + 1}. ${titleCase(rows[i].name.toLowerCase())}\n`
                      );
                    }
                    console.log(res);
                    await Whatsapp.sendText({
                      recipientPhone: recipientPhone,
                      message: "Select pickup destination\n\n" + message,
                    });
                  }
                );
              }
            );
            await Whatsapp.markMessageAsRead({
              message_id,
            });
            return res.sendStatus(200); // break
          }
        }
      );

      /////////////////////////////////////////////////////////////////////////////////////////

      //////////////////////  if latest_question == "select pickup destination": //////////////////////////////////////////////

      connection.query(
        `SELECT latest_question FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
        async (err, rows, fields) => {
          if (err) throw err;
          const latest_question = rows[0].latest_question;

          if (latest_question === "select pickup destination") {
            spdAction(textMessage, recipientPhone);

            // send "select pickup destination" + pickup destinations (emoji list)
            await Whatsapp.sendSimpleButtons({
              message: `Select the type of container preferred`,
              recipientPhone: recipientPhone,
              message_id,
              listOfButtons: [
                { id: 20, title: "20ft" },
                { id: 40, title: "40ft" },
              ].map((category) => ({
                title: category.title,
                id: `container_${category.id}`,
              })),
            });

            await Whatsapp.markMessageAsRead({
              message_id,
            });
            return res.sendStatus(200); // break
          }
        }
      );
      /////////////////////////////////////////////////////////////////////////////////////////

      //////////////////////  if latest_question == "select type of container"  //////////////////////////////////////////////
      if (
        typeOfMsg === "simple_button_message" &&
        ["container_20", "container_40"].includes(
          incomingMessage.button_reply.id
        )
      ) {
        stcAction(incomingMessage.button_reply.id, recipientPhone);

        // send "select destination region" + destination regions (emoji list)
        await Whatsapp.sendText({
          recipientPhone: recipientPhone,
          message: "What number of containers do you want?",
        });
        await Whatsapp.markMessageAsRead({
          message_id,
        });
        return res.sendStatus(200); // break
      }
      /////////////////////////////////////////////////////////////////////////////////////////

      //////////////////////  if latest_question == "number of containers"  //////////////////////////////////////////////
      connection.query(
        `SELECT latest_question FROM whatsapp_cloud WHERE phone_no = '${recipientPhone}'`,
        async (err, rows, fields) => {
          if (err) throw err;
          const latest_question = rows[0].latest_question;

          if (latest_question === "number of containers") {
            ncAction(textMessage, recipientPhone);

            await Whatsapp.markMessageAsRead({
              message_id,
            });
            return res.sendStatus(200); // break
          }
        }
      );
      /////////////////////////////////////////////////////////////////////////////////////////
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error({ error });
    return res.sendStatus(500);
  }

  //   connection.end()
});

function sdrAction(message, recipientPhone) {
  let flag = 0;
  connection.query(
    `UPDATE whatsapp_cloud SET destination_region = '${message}' WHERE phone_no = '${recipientPhone}';`,
    (err, res, fields) => {
      if (err) flag = 1;
    }
  );

  connection.query(
    `UPDATE whatsapp_cloud SET latest_question = 'select pickup destination' WHERE phone_no = '${recipientPhone}';`,
    (err, res, fields) => {
      if (err) flag = 1;
    }
  );
  return !Boolean(flag);
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

          let pickups = ["_"];

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

function stcAction(message, recipientPhone) {
  let flag = 0;
  connection.query(
    `UPDATE whatsapp_cloud SET container_type = '${message}' WHERE phone_no = '${recipientPhone}';`,
    (err, res, fields) => {
      if (err) flag = 1;
    }
  );

  connection.query(
    `UPDATE whatsapp_cloud SET latest_question = 'number of containers' WHERE phone_no = '${recipientPhone}';`,
    (err, res, fields) => {
      if (err) flag = 1;
    }
  );
  return !Boolean(flag);
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
      let container_type = rows[0].container_type;
      let destination_region = rows[0].destination_region;
      let pickup_destination = rows[0].pickup_destination;

      if (container_type === "container_20") {
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
      
       if (container_type === "container_40") {
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

function titleCase(str) {
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

module.exports = router;
