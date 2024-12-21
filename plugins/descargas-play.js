// actualizado por xi_crew
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';

const LimitAud = 725 * 1024 * 1024; // 700MB
const LimitVid = 425 * 1024 * 1024; // 425MB

const MESSAGES = {
  NO_TEXT: '🐉 *Ingrese el nombre de un video de YouTube*\n\nEjemplo, !{command} Enemy Tommoee Profitt',
  SENDING_AUDIO: '📽️ *Su Audio se está enviando, espere un momento...*',
  SENDING_VIDEO: '📽️ *Su Video se está enviando, espere un momento...*',
};

const API_URLS = {
  DELIRIUS: 'https://deliriussapi-oficial.vercel.app/download/ytmp4',
  ZENKEY: 'https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey',
  EXONITY: 'https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh',
};

// Main handler function
const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, MESSAGES.NO_TEXT.replace('{command}', command), m);

  await m.react(rwait);
  const ytPlay = await search(args.join(' '));
  const message = generateMessage(ytPlay[0]);

  if (command === 'play' || command === 'mp3') {
    await processAudioDownload(conn, m, ytPlay[0], message);
  } else if (command === 'play2' || command === 'mp4') {
    await processVideoDownload(conn, m, ytPlay[0], message);
  } else if (command === 'play3' || command === 'playdoc') {
    await processDocumentDownload(conn, m, ytPlay[0], message);
  } else if (command === 'play4' || command === 'playdoc2') {
    await processDocumentDownload(conn, m, ytPlay[0], message, true);
  }
};

// Generate message for YouTube video details
function generateMessage(video) {
  return `*_𔓕꯭  ꯭ ꯭𓏲꯭֟፝੭ ꯭⌑𝐊𝐚𝐤𝐚𝐫𝐨𝐭𝐨-𝐁𝐨𝐭-𝐌𝐃⌑꯭ 𓏲꯭֟፝੭ ꯭ ꯭ ꯭𔓕_*

» 📚 *Título:* ${video.title}
» 📆 *Publicado:* ${video.ago}
» 🕒 *Duración:* ${secondString(video.duration.seconds)}
» 👀 *Vistas:* ${MilesNumber(video.views)}
» 👤 *Autor:* ${video.author.name}
» 🎫 *ID:* ${video.videoId}
» 💠 *Tipo:* ${video.type}
» 🔗 *Enlace:* ${video.url}
» 🎞️ *Canal:* ${video.author.url}

${MESSAGES.SENDING_AUDIO}`.trim();
}

// Process audio download
async function processAudioDownload(conn, m, video, message) {
  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption: message,
  });

  try {
    await downloadAudioFromAPI(conn, m, video.url);
  } catch (e) {
    try {
      await downloadAudioFromYoutubedl(conn, m, video.url);
    } catch (e) {
      await conn.react(m.chat, error);
      console.error(e);
    }
  }
}

// Process video download
async function processVideoDownload(conn, m, video, message) {
  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption: message,
  });

  try {
    await downloadVideoFromAPI(conn, m, video.url);
  } catch (e) {
    try {
      await downloadVideoFromYoutubedl(conn, m, video.url);
    } catch (e) {
      await conn.react(m.chat, error);
      console.error(e);
    }
  }
}

// Process document download
async function processDocumentDownload(conn, m, video, message, isVideo = false) {
  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption: message,
  });

  try {
    await downloadDocumentFromAPI(conn, m, video.url, isVideo);
  } catch (e) {
    try {
      await downloadDocumentFromYoutubedl(conn, m, video.url, isVideo);
    } catch (e) {
      await conn.react(m.chat, error);
      console.error(e);
    }
  }
}

// Download audio from API
async function downloadAudioFromAPI(conn, m, url) {
  const apiUrl = `${API_URLS.DELIRIUS}?url=${encodeURIComponent(url)}`;
  const apiResponse = await fetch(apiUrl);
  const delius = await apiResponse.json();
  if (!delius.status) throw new Error('Failed to download audio from API');
  const downloadUrl = delius.data.download.url;
  await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
  await m.react(done);
}

// Download video from API
async function downloadVideoFromAPI(conn, m, url) {
  const apiUrl = `${API_URLS.DELIRIUS}?url=${encodeURIComponent(url)}`;
  const apiResponse = await fetch(apiUrl);
  const delius = await apiResponse.json();
  if (!delius.status) throw new Error('Failed to download video from API');
  const downloadUrl = delius.data.download.url;
  const fileSize = await getFileSize(downloadUrl);
  if (fileSize > LimitVid) {
    await conn.sendMessage(m.chat, { document: { url: downloadUrl }, fileName: `${video.title}.mp4`, caption: `☁️ Aquí está tu video.` }, { quoted: m });
  } else {
    await conn.sendMessage(m.chat, { video: { url: downloadUrl }, fileName: `${video.title}.mp4`, caption: `☁️ Aquí está tu video.`, thumbnail: video.thumbnail, mimetype: 'video/mp4' }, { quoted: m });
  }
  await m.react(done);
}

// Download document from API
async function downloadDocumentFromAPI(conn, m, url, isVideo) {
  const apiUrl = `${API_URLS.DELIRIUS}?url=${encodeURIComponent(url)}`;
  const apiResponse = await fetch(apiUrl);
  const delius = await apiResponse.json();
  if (!delius.status) throw new Error('Failed to download document from API');
  const downloadUrl = delius.data.download.url;
  await conn.sendMessage(m.chat, { document: { url: downloadUrl }, mimetype: isVideo ? 'video/mp4' : 'audio/mpeg', fileName: `${video.title}.${isVideo ? 'mp4' : 'mp3'}` }, { quoted: m });
  await m.react(done);
}

// Download audio using youtubedl
async function downloadAudioFromYoutubedl(conn, m, url) {
  const yt = await youtubedl(url).catch(async _ => await youtubedlv2(url));
  const dlUrl = await yt.audio['128kbps'].download();
  const ttl = await yt.title;
  await conn.sendFile(m.chat, dlUrl, `${ttl}.mp3`, null, m, false, { mimetype: 'audio/mp4' });
  await m.react(done);
}

// Download video using youtubedl
async function downloadVideoFromYoutubedl(conn, m, url) {
  const yt = await youtubedl(url).catch(async _ => await youtubedlv2(url));
  const dlUrl = await yt.video['360p'].download();
  const ttl = await yt.title;
  await conn.sendFile(m.chat, dlUrl, `${ttl}.mp4`, null, m, false, { mimetype: 'video/mp4' });
  await m.react(done);
}

// Download document using youtubedl
async function downloadDocumentFromYoutubedl(conn, m, url, isVideo) {
  const yt = await youtubedl(url).catch(async _ => await youtubedlv2(url));
  const dlUrl = isVideo ? await yt.video['360p'].download() : await yt.audio['128kbps'].download();
  const ttl = await yt.title;
  await conn.sendFile(m.chat, dlUrl, `${ttl}.${isVideo ? 'mp4' : 'mp3'}`, null, m, false, { mimetype: isVideo ? 'video/mp4' : 'audio/mp4' });
  await m.react(done);
}

handler.help = ['play', 'play2', 'play3', 'play4', 'playdoc'];
handler.tags = ['descargas'];
handler.command = ['play', 'lay2', 'cray3', 'maay4', 'mp3', 'mp4', 'playdoc', 'playdoc2'];
handler.group = true;
export default handler;

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
  return search.videos;
}

function MilesNumber(number) {
  const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  const rep = '$1.';
  const arr = number.toString().split('.');
  arr[0] = arr[0].replace(exp, rep);
  return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

const getBuffer = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error("Error al obtener el buffer", error);
    throw new Error("Error al obtener el buffer");
  }
};

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : 0;
  } catch (error) {
    console.error("Error al obtener el tamaño del archivo", error);
    return 0;
  }
}
