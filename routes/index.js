'use strict';

import Whatsapp from '../config/whatsapp';
import connection from '../config/db';
import testWaCallbackUrl from '../helpers/testWaCallbackUrl';
import getRate from '../functions/getRate';
import selectDestination from '../functions/getRate/SelectDestination';
import selectPickup from '../functions/getRate/selectPickup';
import selectContainerType from '../functions/getRate/selectContainerType';
import selectContainerNum from '../functions/getRate/selectContainerNum';

const router = require('express').Router();

router.get('/meta_wa_callbackurl', (req, res) => {
    try {
        testWaCallbackUrl(req, res);
    } catch (error) {
        console.error({ error });
        return res.sendStatus(500);
    }
});

router.post('/meta_wa_callbackurl', async (req, res) => {
    console.log('POST: Someone is pinging me!');

    try {
        let data = Whatsapp.parseMessage(req.body);

        console.log('dataxx', data);
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
                ['hi', 'hello'].includes(textMessage.trim().toLowerCase())
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
                            title: 'Get rate',
                            id: 'get_rate',
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
            await getRate(
                typeOfMsg,
                incomingMessage.button_reply.id,
                recipientPhone,
                message_id,
                res
            );
            /////////////////////////////////////////////////////////////////////////////////////////

            //////////////////////  if latest_question == "select destination region" ///////////////////////////
            await selectDestination(
                recipientPhone,
                textMessage,
                res,
                message_id
            );
            /////////////////////////////////////////////////////////////////////////////////////////

            //////////////////////  if latest_question == "select pickup destination": /////////////////////////
            await selectPickup(recipientPhone, textMessage, message_id, res);
            /////////////////////////////////////////////////////////////////////////////////////////

            //////////////////////  if latest_question == "select type of container"  /////////////////////////
            await selectContainerType(
                typeOfMsg,
                incomingMessage,
                recipientPhone,
                message_id,
                res
            );
            /////////////////////////////////////////////////////////////////////////////////////////

            //////////////////////  if latest_question == "number of containers"  /////////////////////////
            await selectContainerNum(
                recipientPhone,
                textMessage,
                message_id,
                res
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

export function sdrAction(message, recipientPhone) {
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

export function spdAction(message, recipientPhone) {
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

export function stcAction(message, recipientPhone) {
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

export function ncAction(message, recipientPhone) {
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

export function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] =
            splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

module.exports = router;
