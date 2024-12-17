let handler = async (m, { conn, command, usedPrefix }) => {
let staff = `✨ *EQUIPO DE AYUDANTES*
🤖 *Bot:* ${global.botname}
🌟 *Versión:* ${global.vs}

👑 *Propietario:*

• Antonio
🤴 *Rol:* Propietario
📱 *Número:* wa.me/18098781279
✨️ *GitHub:* https://github.com/INVICTO-RD 

🚀  *Colaboradores:*

• Antonio
🦁 *Rol:* Developer
📱 *Número:* Wa.me/18292588251

• Niño Piña
🐯 *Rol:* Contribuidor
📱 *Número:* Wa.me/18099072577

• Nicol
💻 *Rol:* Soporte 
📱 *Número:* Wa.me/18292588251
`
await conn.sendFile(m.chat, icons, 'yaemori.jpg', staff.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: true,
renderLargerThumbnail: false,
title: `🥷 Developers 👑`,
body: `✨ Staff Oficial`,
mediaType: 1,
sourceUrl: redes,
thumbnailUrl: icono
}}
}, { mentions: m.sender })
m.react(emoji)

}
handler.help = ['staff']
handler.command = ['colaboradores', 'staff']
handler.register = true
handler.tags = ['main']

export default handler
