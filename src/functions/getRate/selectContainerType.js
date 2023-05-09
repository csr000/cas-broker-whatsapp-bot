'use strict';
import Whatsapp from '../../config/whatsapp';
import { stcAction } from '../../routes';

export default async function selectContainerType(typeOfMsg, incomingMessage, recipientPhone, message_id, res) {

  if (typeOfMsg === 'simple_button_message' &&
    ['container_20', 'container_40'].includes(
      incomingMessage.button_reply.id
    )) {
    stcAction(incomingMessage.button_reply.id, recipientPhone);

    // send "select destination region" + destination regions (emoji list)
    await Whatsapp.sendText({
      recipientPhone: recipientPhone,
      message: 'What number of containers do you want?',
    });
    await Whatsapp.markMessageAsRead({
      message_id,
    });
    return res.sendStatus(200);
  }

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