import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let userName = await conn.getName(who + '@s.whatsapp.net')
  let taguser = `@${who.split('@')[0]}`
  

  let chat = global.db.data.chats[m.chat]

  if (chat.welcome) {
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg')
    let img = await (await fetch(pp)).buffer().catch(() => null) || await (await fetch('https://qu.ax/QGAVS.jpg')).buffer();

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `🐉 *Bienvenido* a ${groupMetadata.subject}\n ✰ ${taguser}\n${global.welcom1}\n 𝐒𝐞𝐧𝐭í 𝐞𝐥 𝐩𝐨𝐝𝐞𝐫 𝐝𝐞 𝐮𝐧 𝐧𝐮𝐞𝐯𝐨 𝐢𝐧𝐭𝐞𝐠𝐫𝐚𝐧𝐭𝐞! 😶‍🌫️, 𝐩𝐨𝐝𝐫á 𝐜𝐨𝐧𝐭𝐫𝐚 𝐥𝐨𝐬 𝐦á𝐬 𝐟𝐮𝐞𝐫𝐭𝐞𝐬?.`
      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })
    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let bye = `🐉 *Adiós* De ${groupMetadata.subject}\n ✰ ${taguser}\n${global.welcom2}\n 𝐌𝐞 𝐞𝐪𝐮𝐢𝐯𝐨𝐪𝐮é, 𝐬𝐮 𝐠𝐫𝐚𝐧 𝐩𝐨𝐝𝐞𝐫  𝐟𝐮𝐞 𝐥𝐚 𝐞𝐬𝐭𝐮𝐩𝐢𝐝𝐞𝐳, 𝐁𝐲𝐞 𝐢𝐧𝐟𝐞𝐫𝐢𝐨𝐫 👹.`
  
      await conn.sendMessage(m.chat, { image: img,  caption: bye, mentions: [who] })
    }
  
  }

  return true
}

