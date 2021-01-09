 /*
* Thanks For ChandraID
*/

const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal") //ANAK ASU
const moment = require("moment-timezone") //TOBAT SU
const fs = require("fs") //SU
const { color, bgcolor } = require('./lib/color')
const { help } = require('./lib/help')
const { donasi } = require('./lib/donasi')
const { codebahasa } = require('./lib/codebahasa')
const { join } = require('./lib/join')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, simih, getBuffer, bucin, namaninja, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' // ANAK ANJING MAU NGAPAIN?
            + 'VERSION:3.0\n' // NGAPAIN LAGI KALO GA MAU NUMPANG NAMA DOANG XIXIXIXI
            + 'FN: Rafi Adi Chandra\n' //Owner
            + 'ORG:Creator Chandra;\n' // KASIH CREDITS GUA SU!!!
            + 'TEL;type=CELL;type=VOICE;waid=6288238528389:+62 882-3852-8389\n' //Chandra Ganteng 
            + 'END:VCARD' // Chandra ID
prefix = '¡'
blocked = []
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const arrayBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const bulan = arrayBulan[moment().format('MM') - 1]

const config = {
    A187: '👾ChanzBOT👾', // TOBAT SU ASU
    instagram: 'https://instagram.com/rafiadichandra', // INFO JANGAN DI UBAH
    nomer: 'wa.me/6281218898489', // INFO SU JNGAN DI UBAH
    youtube: 'Tidak Ada Youtube!', // KINTIL
    whatsapp: 'https://chat.whatsapp.com/DFyqVSqwxvfCVcpy2VAxg3', // BABI
    tanggal: `TANGGAL: ${moment().format('DD')} ${bulan} ${moment().format('YYYY')}`,
    waktu: time
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}


const { tanggal, waktu, instagram, whatsapp, youtube, nomer, ontime } = config



const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR code Chanz'BOT is ready, Bot By : Chandra ID`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

// client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by ig:@rafiadichandra`)

client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `*Hallo!* @${num.split('@')[0]}\👋 \nSelamat datang di *${mdata.subject}* \n\n*Jangan lupa intro ya!* \n*Nama* : \n*Asal* : \n*Cewek* / *Cowok* : \n\nSemoga Betah Sayang❤️.`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Al-Fatihah buat @${num.split('@')[0]} \nSemoga Tenang Dialam Sana Ya. Aamiin...🤲🏼😇`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '❬❗❭ 𝗪𝗔𝗜𝗧, 𝗹𝗮𝗴𝗶 𝗽𝗿𝗼𝘀𝗲𝘀',
				success: '️❬ ✔ ❭ 𝘀𝘂𝗰𝗰𝗲𝘀𝘀 𝘁𝗼𝗱🖤',
				error: {
					stick: '𝗬𝗲𝗮𝗵 𝗴𝗮𝗴𝗮𝗹 ;(, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘆𝗮𝗵 𝘁𝗼𝗱 ^_^',
					Iv: '𝗠𝗮𝗮𝗳 𝗹𝗶𝗻𝗸 𝘁𝗶𝗱𝗮𝗸 𝘃𝗮𝗹𝗶𝗱☹️'
				},
				only: {
					group: '❬❗❭ 𝗚𝗥𝗢𝗨𝗣 𝗢𝗡𝗟𝗬 𝗧𝗢𝗗',
					ownerG: '❬❗❭ 𝗢𝗪𝗡𝗘𝗥 𝗢𝗡𝗟𝗬 𝗧𝗢𝗗',
					ownerB: '❬❗❭  𝗢𝗪𝗡𝗘𝗥 𝗢𝗡𝗟𝗬 𝗧𝗢𝗗',
					admin: '❬❗❭ 𝗔𝗗𝗠𝗜𝗡 𝗢𝗡𝗟𝗬 𝗧𝗢𝗗',
					Badmin: '❬❗❭ 𝗕𝗢𝗧 𝗛𝗔𝗥𝗨𝗦 𝗝𝗔𝗗𝗜 𝗔𝗗𝗠𝗜𝗡 𝗧𝗢𝗗'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["6288238528389@s.whatsapp.net"] // ganti nomer lu
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help': 
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
				case 'donasi':
				case 'donate':
					client.sendMessage(from, donasi(), text)
					break
					case 'codebahasa':
                                client.sendMessage(from, codebahasa(), text)
                                break
				case 'join':
				client.sendMessage(from, join(), text)
					break
case 'Iri':
					case 'iri?':
            case 'iri':
                client.sendMessage(from, './aris/iri.mp3', {quoted: mek, ptt:true})
                break
                
            case 'abgjago':
            case 'abangjago':
                client.sendMessage(from, './aris/abangjago.mp3', {quoted: mek, ptt:true})
                break
            case 'tarekses':
            case 'tariksis':
            case 'tareksis':
            case 'tareeksis':
            case 'tareekses':
                client.sendMessage(from, './aris/tarekses.mp3', {quoted: mek, ptt:true})
                break
            case 'welotka':
            case 'welutka':
            case 'kangcopet':
                client.sendMessage(dari, './aris/welot.mp3',{quoted: mek, ptt:true})
                break
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `𝗡𝗮𝗺𝗮 𝗯𝗼𝘁 : ${me.name}\n*𝗡𝗼𝗺𝗲𝗿 𝗯𝗼𝘁* : @${me.jid.split('@')[0]}\n*𝗣𝗿𝗲𝗳𝗶𝘅* : ${prefix}\n𝗧𝗼𝘁𝗮𝗹 𝗕𝗹𝗼𝗰𝗸 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 : ${blocked.length}\n𝗧𝗵𝗲 𝗯𝗼𝘁 𝗶𝘀 𝗮𝗰𝘁𝗶𝘃𝗲 𝗼𝗻 : ${kyun(uptime)}\n𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗠𝗵𝗮𝗻𝗸𝗕𝗮𝗿𝗕𝗮𝗿`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist': 
					teks = '𝗕𝗟𝗢𝗖𝗞 𝗟𝗜𝗦𝗧 :\n'
					for (let block of blocked) {
						teks += `┣➢ @${block.split('@')[0]}\n`
					}
					teks += `𝗧𝗼𝘁𝗮𝗹 : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr': 
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('𝗸𝗶𝗿𝗶𝗺 𝗳𝗼𝘁𝗼 𝗱𝗲𝗻𝗴𝗮𝗻 𝗰𝗲𝗽𝘁𝗶𝗼𝗻 ${prefix}𝗼𝗰𝗿')
					}
					break
				case 'ownergrup':
				case 'ownergroup':
              nom = `${from}`
              kent = `${nom.split("-")[0]}`
					const tagged = {
					text: `Neh owner grupmu @${kent.split('@')[0]}`,
					contextInfo: { mentionedJid: [kent] }
					}
					client.sendMessage(from, tagged, text, {quoted: mek})
					break
				case 'ytmp3':
				if (args.length < 1) return reply('link YouTube nya mana?')
					tels = body.slice(7)				
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/yta?url=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.thumb)
					hasil = `*Judul ➼* ${anu.title}\n*Filesize ➼* ${anu.filesize}\n*Tipe ➼* ${anu.ext}\n*Link ➼* ${anu.result}`					
					client.sendMessage(from, buffer, image, {quoted: mek, caption: hasil})
					break				
					case 'ytmp4':
				if (args.length < 1) return reply('link YouTube nya mana?')
					tels = body.slice(7)				
					reply(mess.wait)
					buffer = await getBuffer(anu.thumb)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/ytv?url=${tels}`, {method: 'get'})
					hasil = `*Judul ➼* ${anu.title}\n*Filesize ➼* ${anu.filesize}\n*resolution ➼* ${anu.resolution}\n*Tipe ➼* ${anu.ext}\n*Link ➼* ${anu.result}`					
					client.sendMessage(from, buffer, image,  {quoted: mek, caption: hasil})
					break		
				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								let buff = fs.readFileSync(ranw)
								client.sendMessage(from, buff, sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
						case 'gtts':	
				case 'tts':
					if (args.length < 1) return client.sendMessage(from, '𝗱𝗶𝗽𝗲𝗿𝗹𝘂𝗸𝗮𝗻 𝗸𝗼𝗱𝗲 𝗯𝗮𝗵𝗮𝘀𝗮 𝘁𝗼𝗱!', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, '𝗧𝗲𝗸𝘀 𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶𝗷𝗮𝗱𝗶𝗶𝗻 𝘀𝘂𝗮𝗿𝗮 𝗺𝗮𝗻𝗮 𝘁𝗼𝗱? 𝘁𝘆𝘁𝗱 𝗸𝗮𝗵?', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('𝗜𝗱𝗶𝗵 𝗻𝗴𝗲𝗹𝘂𝗻𝗷𝗮𝗸 𝗻𝗴𝗲𝗻𝘁𝗼𝗱, 𝘁𝗲𝗸𝘀𝗻𝘆𝗮 𝗷𝗮𝗻𝗴𝗮𝗻 𝗸𝗲𝗽𝗮𝗻𝗷𝗮𝗻𝗴𝗮𝗻 😤')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							let buff = fs.readFileSync(rano)
							if (err) return reply('𝗬𝗲𝗮𝗵 𝗴𝗮𝗴𝗮𝗹 ;(, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘆𝗮𝗵 𝘁𝗼𝗱 ^_^')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'logowolf':                                                           var gh = body.slice(11)
var teks1 = gh.split("|")[0];
var teks2 = gh.split("|")[1];
if (args.length < 1) return reply(`teksnya mana? contoh *${prefix}logowolf |Chandra|Ganss*`)
reply(mess.wait)
anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=wolflogo1&text1=${teks1}&text2=${teks2}`, {method: 'get'})
buffer = await getBuffer(anu.result)
client.sendMessage(from, buffer, image, {quoted: mek})
break
			case 'ttp':
					if (args.length < 1) return reply('Textnya mana um?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(5).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						client.sendMessage(from, buffer, sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'indohot':
                   anu = await fetchJson(`https://arugaz.herokuapp.com/api/indohot`, {method: 'get'})                       
                   if (anu.error) return reply(anu.error)
                   hasil = `*judul* \n${anu.result.judul} *genre* \n${anu.result.genre} *durasi* \n${anu.result.durasi} *url* \n${anu.result.url}`                       
                   client.sendMessage(from, hasil, text, {quoted: mek,})
                   break
			case 'cerpen':
					gatauda = body.slice(7)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/cerpen`, {method: 'get'})
					reply(anu.result.result)
					break
				case 'qrcode':
					const tex = encodeURIComponent(body.slice(8))
					if (!tex) return client.sendMessage(from, 'masukan teks/url!', text, {quoted: mek})
					const buff = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${tex}`)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'map':
					if (args.length < 1) return reply('𝐋𝐨𝐤𝐚𝐬𝐢 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢𝐜𝐚𝐫𝐢 𝐝𝐢𝐦𝐚𝐧𝐚 𝐤𝐚𝐤?')
					tels = body.slice(5)
					reply(mess.wait)
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.gambar)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
				case 'waifu':
					gatauda = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image,{quoted: mek})
					break
				case 'loli':
					gatauda = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomloli`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image,{quoted: mek})
					break
				case 'spamsms':
					if (args.length < 1) return reply('𝐍𝐨𝐦𝐞𝐫 𝐭𝐚𝐫𝐠𝐞𝐭')
					tels = body.slice(9)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamsms?no=${tels}&jum=10`, {method: 'get'})
					reply(anu.logs)
					break	
				case 'spamgmail':
					if (args.length < 1) return reply('𝐠𝐦𝐚𝐢𝐥 𝐭𝐚𝐫𝐠𝐞𝐭')
					tels = body.slice(11)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamgmail?target=${tels}&jum=10`, {method: 'get'})
					reply(anu.logs)
					break	
				case 'spamcall':
					if (args.length < 1) return reply('𝐍𝐨𝐦𝐞𝐫 𝐭𝐚𝐫𝐠𝐞𝐭')
					tels = body.slice(10)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=${tels}`, {method: 'get'})
					reply(anu.logs)
					break			
				case 'randomanime':
					gatauda = body.slice(13)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomanime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break	
				case 'neko':
					gatauda = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break				 						
				case 'nama':
					tels = body.slice(6)					
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/arti?nama=${tels}`, {method: 'get'})
					reply(anu.result)
					break
				case 'shortlink':
					tels = body.slice(11)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/shorturl?url=${tels}`, {method: 'get'})
					reply(anu.result)
					break									
				case 'tagme':
					var nom = mek.participant
					const tag = {
					text: `@${nom.split("@s.whatsapp.net")[0]} 𝐓𝐮𝐡 𝐝𝐚𝐡 𝐚𝐤𝐮 𝐭𝐚𝐠!`,
					contextInfo: { mentionedJid: [nom] }
					}
					client.sendMessage(from, tag, text, {quoted: mek})
					break	
					case 'bucin':
					gatauda = body.slice(7)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					reply(anu.desc)
					break	
				case 'pushname':
					const num = mek.participant
					pushnam = client.contacts[num]
					const teg = {
					text: `${pushnam} || @${num.split("@s.whatsapp.net")[0]}`,
					contextInfo: { mentionedJid: [num] }
					}
					client.sendMessage(from, teg, text, {quoted: mek})
					break
					case 'quotes':
					gatauda = body.slice(8)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/randomquotes`, {method: 'get'})
					reply(anu.quotes)
					break		
				case 'chord':
					if (args.length < 1) return reply('𝐣𝐮𝐝𝐮𝐥 𝐥𝐚𝐠𝐮 𝐤𝐚𝐤')
					tels = body.slice(7)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/chord?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break						 
				case 'wiki':
					if (args.length < 1) return reply('𝐦𝐚𝐬𝐮𝐤𝐤𝐚𝐧 𝐤𝐚𝐭𝐚 𝐤𝐮𝐧𝐜𝐢')
					tels = body.slice(6)					
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/wiki?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break	
				case 'wikien':
					if (args.length < 1) return reply('𝐦𝐚𝐬𝐮𝐤𝐤𝐚𝐧 𝐤𝐚𝐭𝐚 𝐤𝐮𝐧𝐜𝐢')
					tels = body.slice(8)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/wikien?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break	
					case 'url2img': 
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('𝐏𝐢𝐥𝐢𝐡 𝐭𝐢𝐩𝐞 𝐧𝐲𝐚 𝐤𝐚𝐤?')
					if (!tipelist.includes(args[0])) return reply('𝐓𝐢𝐩𝐞 𝐚𝐩𝐚 𝐝𝐞𝐤𝐬𝐭𝐨𝐩|𝐭𝐚𝐛𝐥𝐞𝐭|𝐦𝐨𝐛𝐢𝐥𝐞')
					if (args.length < 2) return reply('𝐮𝐫𝐥𝐧𝐲𝐚  𝐦𝐚𝐧𝐚 𝐤𝐚𝐤?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})					 
							break 
				case 'tingkat': {
        if (args.length === 1) {
    client.reply(from, 'pilih menu!!!', id)
    } else if (args[1] === 'gay') {
    let name = body.trim().split(' ').slice(1).toString().replace(/,/g, ' ')
    const random = await Math.floor(Math.random() * (100 - 1) + 1)
    if(random < 15) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*\n*reason* : _baik_`, id)
    if(random < 50) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*\n*reason* : _normal_ `,id)
    if(random < 75) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*.\n*reason* : _parah_`, id)
    if(random <= 100) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*\n*reason* : _sangat parah_`, id)
    } else if (args[1] === 'bucin') {
    let name = body.trim().split(' ').slice(1).toString().replace(/,/g, ' ')
    const random = await Math.floor(Math.random() * (100 - 1) + 1)
    if(random < 15) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*\n*reason* : _baik_`, id)
    if(random < 50) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*\n*reason* : _normal_ `,id)
    if(random < 75) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*.\n*reason* : _parah_`, id)
    if(random <= 100) return await client.reply(from, `Tingkat *${name}* adalah *${random}%*\n*reason* : _sangat parah_`, id)
    }}
    break

				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`𝗣𝗿𝗲𝗳𝗶𝘅 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶 𝘂𝗯𝗮𝗵 𝗺𝗲𝗻𝗷𝗮𝗱𝗶 : ${prefix}`)
					break 	
				case '--meme--': 
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case '--memeindo--': 
					memeindo = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case '--nsfwloli--': 
				    try {
						if (!isNsfw) return reply('𝗠𝗮𝗮𝗳 𝗳𝗶𝘁𝘂𝗿 𝗶𝗻𝗶 𝗯𝗲𝗹𝘂𝗺 𝗱𝗶 𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻/𝗸𝗲𝘀𝗮𝗹𝗮𝗵𝗮𝗻 𝘀𝗲𝗿𝘃𝗲𝗿𝗻𝘆𝗮 𝘁𝗼𝗱')
						res = await fetchJson(`https://api.lolis.life/random?nsfw=true`, {method: 'get'})
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝗘𝗥𝗥𝗢𝗥 𝗧𝗢𝗗')
					}
					break
				case 'hilih':
					if (args.length < 1) return reply('𝗸𝗮𝘀𝗶𝗵 𝘁𝗲𝗸𝘀 𝗹𝗮𝗵 𝘁𝗼𝗱!!!')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
				case '--yt--': 
				case 'youtube':
					if (args.length < 1) return reply('𝘂𝗿𝗹𝗻𝘆𝗮 𝗺𝗮𝗻𝗮 𝘁𝗼𝗱?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case '--ytsearch--': 
				case 'searchyt':
					if (args.length < 1) return reply('𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶𝗰𝗮𝗿𝗶 𝗮𝗽𝗮 𝘁𝗼𝗱? 𝘁𝘆𝘁𝗱 𝗸𝗮𝗵?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
				case '--tiktok--': 
				case 'tik':
					if (args.length < 1) return reply('𝘂𝗿𝗹𝗻𝘆𝗮 𝗺𝗮𝗻𝗮 𝘁𝗼𝗱?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case '--tiktokstalk--':
				case 'tikstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, '𝘂𝘀𝗲𝗿𝗻𝗮𝗺𝗲 𝗺𝗮𝗻𝗮 𝘁𝗼𝗱?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('[𝗘𝗥𝗥𝗢𝗥] 𝗸𝗲𝗺𝘂𝗻𝗴𝗸𝗶𝗻𝗮𝗻 𝘂𝘀𝗲𝗿𝗻𝗮𝗺𝗲 𝘁𝗶𝗱𝗮𝗸 𝘃𝗮𝗹𝗶𝗱')
					}
					break
				case '--nulis--': 
				case '--tulis--':
					if (args.length < 1) return reply('𝘁𝗲𝗿𝘂𝘀 𝗮𝗸𝘂 𝘀𝘂𝗿𝘂𝗵 𝗻𝘂𝗹𝗶𝘀 𝗮𝗽𝗮 𝘁𝗼𝗱? 𝗻𝘂𝗹𝗶𝘀 𝘁𝘆𝘁𝗱 𝗴𝗶𝘁𝘂?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				case '--url2img--': 
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('𝗧𝗶𝗽𝗲𝗻𝘆𝗮 𝗮𝗽𝗮 𝘁𝗼𝗱??')
					if (!tipelist.includes(args[0])) return reply('𝗧𝗶𝗽𝗲 𝗱𝗲𝘀𝗸𝘁𝗼𝗽|𝘁𝗮𝗯𝗹𝗲𝘁|𝗺𝗼𝗯𝗶𝗹𝗲')
					if (args.length < 2) return reply('𝘂𝗿𝗹𝗻𝘆𝗮 𝗺𝗮𝗻𝗮 𝘁𝗼𝗱?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case '--tstiker--':
				case '--tsticker--': 
					case 'ttp':
					if (args.length < 1) return reply('𝗸𝗮𝘀𝗶𝗵 𝘁𝗲𝗸𝘀 𝗹𝗮𝗵 𝘁𝗼𝗱!!!')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						client.sendMessage(from, buffer, sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
			case 'fitnah':
if (!isGroup) return reply('duh bang parah botnya cuma mau di group')
arg = body.substring(body.indexOf(' ') + 1)
				isi = arg.split(' |')[0] // 629999999@s.whatsapp.net
				pesan = arg.split('|')[1] // Ini di Reply Nya bang
				pesan2 = arg.split('|')[2] // Ini Text Di Bot Bang 👍
costum(pesan, isi, pesan2)
break

				case 'linkgroup':
                                case 'linkgrup':
                                case 'linkgc':                                               client.updatePresence(from, Presence.composing)                                    
if (!isGroup) return reply(mess.only.group)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
linkgc = await client.groupInviteCode (from)
yeh = `https://chat.whatsapp.com/${linkgc}\n\nLink Group *${groupName}*`                                        
client.sendMessage(from, yeh, text, {quoted: mek, detectLinks: false})                                       
break
				case 'tagall':
				case 'getall':
				case 'mentionall':
				case 'all':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n- 📢 *MENTION MEMBER* -\n'
					for (let mem of groupMembers) {
						teks += `*>* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'clearall':
					if (!isOwner) return reply('𝙡𝙪 𝙨𝙞𝙖𝙥𝙖 𝙩𝙤𝙙?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('𝗰𝗹𝗲𝗮𝗿 𝗮𝗹𝗹 𝘀𝘂𝗸𝘀𝗲𝘀 𝘆𝗮𝗵 𝘁𝗼𝗱 :)')
					break
			   	case 'block':
                                        client.updatePresence(from, Presence.composing)
                                       if (!isGroup) return reply(mess.only.group)
                                        if (!isOwner) return reply(mess.only.ownerB)                                        
					client.blockUser (`${body.slice(8)}@c.us`, "add")
                                        client.sendMessage(from, `perintah Diterima, memblokir ${body.slice(8)}@c.us`, text)
                                        break
                                case 'joox':
				case 'play':
		reply(mess.wait)
                data = await fetchJson(`https://tobz-api.herokuapp.com/api/joox?q=${body.slice(6)}`, {method: 'get'})
               if (data.error) return reply(data.error)
                 infomp3 = `*Lagu Ditemukan!!!*\nJudul : ${data.result.judul}\nAlbum : ${data.result.album}\nDipublikasi : ${data.result.dipublikasi}`
                buffer = await getBuffer(data.result.thumb)
                lagu = await getBuffer(data.result.mp3)
                client.sendMessage(from, buffer, image, {quoted: mek, caption: infomp3})
                client.sendMessage(from, lagu, audio, {mimetype: 'audio/mp4', filename: `${data.result.title}.mp3`, quoted: mek})
                break


					case 'unblock':
                                        client.updatePresence(from, Presence.composing)
                                        if (!isGroup) return reply(mess.only.group)                                        
					if (!isOwner) return reply(mess.only.ownerB) 
                                        client.blockUser (`${body.slice(10)}@c.us`, "remove")
                                        client.sendMessage(from, `perintah Diterima, membuka blokir ${body.slice(10)}@c.us`, text)
                                        break
				   case '--block--':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					client.blockUser (`${body.slice(7)}@c.us`, "add")
					client.sendMessage(from, `𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝗗𝗶𝘁𝗲𝗿𝗶𝗺𝗮, 𝗺𝗲𝗺𝗯𝗹𝗼𝗸𝗶𝗿 ${body.slice(7)}@c.us`, text)
					break
                    case '--unblock--':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				    client.blockUser (`${body.slice(9)}@c.us`, "remove")
					client.sendMessage(from, `𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝗗𝗶𝘁𝗲𝗿𝗶𝗺𝗮, 𝗺𝗲𝗺𝗯𝘂𝗸𝗮 ${body.slice(9)}@c.us`, text)
				break
				case 'bc': 
					if (!isOwner) return reply('𝙡𝙪 𝙨𝙞𝙖𝙥𝙖 𝙩𝙤𝙙?') 
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `❮ 𝙋𝙀𝙎𝘼𝙉 𝘽𝙍𝙊𝘼𝘿𝘾𝘼𝙎𝙏 ❯\n\n${body.slice(4)}`})
						}
						reply('𝙨𝙪𝙘𝙘𝙚𝙨𝙨 𝙗𝙧𝙤𝙖𝙙𝙘𝙖𝙨𝙩 ')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ *Chandra Broadcast* ]\n\n${body.slice(4)}\n\n- Chanz'BOT`)
						}
						reply('𝙨𝙪𝙘𝙘𝙚𝙨𝙨 𝙗𝙧𝙤𝙖𝙙𝙘𝙖𝙨𝙩 ')
					}
					break
			       	case 'setpp': 
                        if (!isGroup) return reply(mess.only.group)
                       if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                       media = await client.downloadAndSaveMediaMessage(mek)
                         await client.updateProfilePicture (from, media)
                        reply('𝗦𝘂𝗸𝘀𝗲𝘀 𝗺𝗲𝗻𝗴𝗴𝗮𝗻𝘁𝗶 𝗶𝗰𝗼𝗻 𝗚𝗿𝘂𝗽')
                                        break						
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('𝗽𝗮𝘀𝘁𝗶 𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶 𝗮𝗱𝗱 𝗮𝗻𝗮𝗸 𝗽𝘂𝗻𝗴𝘂𝘁?')
					if (args[0].startsWith('08')) return reply('𝗚𝘂𝗻𝗮𝗸𝗮𝗻 𝗸𝗼𝗱𝗲 𝗻𝗲𝗴𝗮𝗿𝗮 𝘁𝗼𝗱')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('𝗴𝗮𝗴𝗮𝗹 𝗺𝗲𝗻𝗮𝗺𝗯𝗮𝗵𝗸𝗮𝗻, 𝗺𝘂𝗻𝗴𝗸𝗶𝗻 𝗸𝗮𝗿𝗲𝗻𝗮 𝗱𝗶 𝗽𝗿𝗶𝘃𝗮𝘁𝗲')
					}
					break
					case 'grup':
					case 'group':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args[0] === 'buka') {
					    reply(`𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗠𝗲𝗺𝗯𝘂𝗸𝗮 𝗚𝗿𝗼𝘂𝗽 𝗧𝗼𝗱`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'tutup') {
						reply(`𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗠𝗲𝗻𝘂𝘁𝘂𝗽 𝗚𝗿𝗼𝘂𝗽 𝗧𝗼𝗱`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
                    
            case 'admin':
            case 'owner':
            case 'creator':
                  client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
       client.sendMessage(from, '𝗧𝘂𝗵 𝗱𝗮𝗵 𝗮𝗸𝘂 𝗸𝗮𝘀𝗶𝗵 𝗻𝗼𝗺𝗲𝗿 𝗖𝗢 👾ChanzBOT👾,𝗝𝗔𝗡𝗚𝗔𝗡 𝗟𝗨𝗣𝗔 𝗗𝗜 𝗦𝗔𝗩𝗘 𝗘𝗔 ><',MessageType.text, { quoted: mek} )
           break    
           case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝗧𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗶𝗻𝗴𝗶𝗻 𝗱𝗶 𝘁𝗲𝗻𝗱𝗮𝗻𝗴!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `𝘆𝗮𝗵𝗵 𝗷𝗮𝗯𝗮𝘁𝗮𝗻 𝗮𝗱𝗺𝗶𝗻 𝗸𝗮𝗺𝘂 𝘀𝘂𝗱𝗮𝗵 𝗱𝗶 𝗰𝗼𝗽𝗼𝘁🏃 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`𝘆𝗮𝗵𝗵 @${mentioned[0].split('@')[0]} 𝗷𝗮𝗯𝗮𝘁𝗮𝗻 𝗮𝗱𝗺𝗶𝗻 𝗸𝗮𝗺𝘂 𝘀𝘂𝗱𝗮𝗵 𝗱𝗶 𝗰𝗼𝗽𝗼𝘁🏃`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'bcgc':
					client.updatePresence(from, Presence.composing) 
					if (!isOwner) return reply(mess.only.ownerB)
					if (args.length < 1) return reply('.......')
					anu = await groupMembers
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `*「 BROADCAST GROUP 」*\n\n${body.slice(6)}`})
						}
						reply('')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `*「 BROADCAST GROUP 」*\n\n${body.slice(6)}`)
						}
						reply('Suksess broadcast group')
					}
					break
					case 'bugreport':
                                client.updatePresence(from, Presence.composing)
                                if (args.length < 1) return reply('Bugnya apa kak?')
                                        tek = body.slice(10)
                                        bug = {
                                        text: `*[BUG REPORT]*\n\n*Pengirim :* @${sender.split("@")[0]}\n*Pada Jam :* ${time}\n*Pesan :* ${tek}`,
                                        contextInfo: { mentionedJid: [sender] }
					}
                                        client.sendMessage(ownerNumber, bug, text, {quoted: mek})                       
                                        client.sendMessage(from, 'Laporan mu telah dikirim ke owner BOT, laporan palsu/main2 tidak akan ditanggapi.', text, {quoted: mek})                       
                                        break
					case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝗧𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗶𝗻𝗴𝗶𝗻 𝗱𝗶 𝘁𝗲𝗻𝗱𝗮𝗻𝗴!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `𝗦𝗲𝗹𝗮𝗺𝗮𝘁🥳 𝗮𝗻𝗱𝗮 𝗻𝗮𝗶𝗸 𝗺𝗲𝗻𝗷𝗮𝗱𝗶 𝗮𝗱𝗺𝗶𝗻 𝗴𝗿𝗼𝘂𝗽 (+_+) :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`𝗦𝗲𝗹𝗮𝗺𝗮𝘁🥳 @${mentioned[0].split('@')[0]} 𝗮𝗻𝗱𝗮 𝗻𝗮𝗶𝗸 𝗺𝗲𝗻𝗷𝗮𝗱𝗶 𝗮𝗱𝗺𝗶𝗻 𝗴𝗿𝗼𝘂𝗽 (+_+)`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break	
			     	case 'kick':
				case 'bye':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝗧𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗶𝗻𝗴𝗶𝗻 𝗱𝗶 𝘁𝗲𝗻𝗱𝗮𝗻𝗴!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `𝗔𝘀𝗲𝗸 𝗱𝗮𝗽𝗮𝘁 𝗺𝗮𝗸𝗮𝗻𝗮𝗻,𝗼𝘁𝘄 𝗸𝗶𝗰𝗸 𝘁𝗼𝗱🏃 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`𝗔𝘀𝗲𝗸 𝗱𝗮𝗽𝗮𝘁 𝗺𝗮𝗸𝗮𝗻𝗮𝗻,𝗼𝘁𝘄 𝗸𝗶𝗰𝗸 @${mentioned[0].split('@')[0]} 𝘁𝗼𝗱🏃`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'hidetag':
                client.updatePresence(from, Presence.composing)      
		if (!isGroupAdmins) return reply(mess.only.admin)          
                if (!isGroup) return reply(mess.only.group)
		if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                teks = body.slice(9)
                group = await client.groupMetadata(from);
		member = group['participants']
                jids = [];
                member.map( async adm => {
                jids.push(adm.id.replace('c.us', 's.whatsapp.net'));
                 })
                 options = {
                 text: teks,
                contextInfo: {mentionedJid: jids},
		quoted: mek
                }
              await client.sendMessage(from, options, text)
               break
				case 'listadmin':
					if (!isGroup) return reply(mess.only.group)
					teks = `𝗟𝗶𝘀𝘁 𝗮𝗱𝗺𝗶𝗻 𝗼𝗳 𝗴𝗿𝗼𝘂*${mdata.subject}*𝗽 *${groupMetadata.subject}*\n𝗧𝗼𝘁𝗮𝗹 : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('𝗥𝗲𝗽𝗹𝘆/𝘁𝗮𝗴 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 𝘁𝗼𝗱!')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('𝗬𝗲𝗮𝗵 𝗴𝗮𝗴𝗮𝗹 ;(, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘆𝗮𝗵 𝘁𝗼𝗱 ^_^')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '𝗱𝗮𝗵 𝗷𝗮𝗱𝗶 𝘁𝗼𝗱'})
						fs.unlinkSync(ran)
					})
					break
		case 'lirik':
                   client.updatePresence(from, Presence.composing) 
                   data = await fetchJson(`https://arugaz.herokuapp.com/api/lirik?judul=${body.slice(7)}`)
                   if (data.error) return reply(data.error)
                   reply(data.result)
                   break
			case 'leave':
		if (!isGroup) return reply(mess.only.group)
                    if (!isGroupAdmins) return reply(mess.only.admin)
                     setTimeout( () => {
					client.groupLeave (from) 
					}, 2000)
                     setTimeout( () => {
					client.updatePresence(from, Presence.composing) 
					client.sendMessage(from, 'Sayonara👋', text) // ur cods
					}, 0)
                     break
			case 'covid':
                   client.updatePresence(from, Presence.composing) 
                   data = await fetchJson(`https://arugaz.herokuapp.com/api/corona?country=${body.slice(7)}`)
                   if (data.result) reply(data.result)
                   hasil = `Negara : ${data.result.country}\n\nActive : ${data.result.active}\ncasesPerOneMillion : ${data.result.casesPerOneMillion}\ncritical : ${data.result.critical}\ndeathsPerOneMillion : ${data.result.deathsPerOneMillion}\nrecovered : ${data.result.recovered}\ntestPerOneMillion : ${data.result.testPerOneMillion}\ntodayCases : ${data.result.todayCases}\ntodayDeath : ${data.result.todayDeath}\ntotalCases : ${data.result.totalCases}\ntotalTest : ${data.result.totalTest}`
                   reply(hasil)
                   break
                   case 'brainly':
					client.updatePresence(from, Presence.composing) 
					if (args.length < 1) return reply('Yang mau di cari apaan?')
					data = await fetchJson(`https://rest.farzain.com/api/brainly.php?id=${body.slice(9)}&apikey=${apikey}`, {method: 'get'})
					if (data.error) return reply(data.error)
					teks = '--------------------------\n'
					for (let i of data) {
						teks += `*Title* : ${i.title}\n*url* : ${i.url}\n--------------------------\n`
					}
					reply(teks.trim())
					break
				case 'pinterest':
					client.updatePresence(from, Presence.composing) 
					data = await fetchJson(`https://api.fdci.se/rep.php?gambar=${body.slice(11)}`, {method: 'get'})
					reply(mess.wait)
					n = JSON.parse(JSON.stringify(data));
					nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek, caption: `𝐏𝐈𝐍𝐓𝐄𝐑𝐄𝐒𝐓\n\*Hasil Pencarian* : *${body.slice(11)}*`})
					break
				case 'jadwaltvnow':
               client.updatePresence(from, Presence.composing) 
                 data = await fetchJson('https://docs-jojo.herokuapp.com/api/jadwaltvnow')
                hasil = `Jam : ${data.result.jam}\n\n${data.result.jadwalTV}`
                reply (hasil)
                break
                case 'jsholat':
                client.updatePresence(from, Presence.composing) 
                if (args.length < 1) return reply(`Masukan Nama tempat\nContoh : ${prefix}jsholat Pekalongan`)
                data = await fetchJson(`https://mhankbarbar.herokuapp.com/api/jadwalshalat?daerah=${body.slice(9)}&apiKey=${apiKey}`)
                hasil = `╠➥ shubuh : ${data.Subuh}\n╠➥ Dzuhur : ${data.Dzuhur}\n╠➥ Ashar : ${data.Ashar}\n╠➥ Maghrib : ${data.Maghrib}\n╠➥ isya : ${data.isya}`
                reply (hasil)
			break
				case 'kbbi':
            client.updatePresence(from, Presence.composing) 
                if (args.length < 1) return reply(`Masukan Pertanyaan\nContoh : ${prefix}kbbi asu`)
              data = await fetchJson(`https://tobz-api.herokuapp.com/api/kbbi?kata=${body.slice(6)}`)
              if (data.error) return reply(data.error)
              hasil = `${data.result}`
              reply(hasil)
              break
			case 'trendtwit':
					client.updatePresence(from, Presence.composing) 
					data = await fetchJson(`https://docs-jojo.herokuapp.com/api/trendingtwitter`, {method: 'get'})
					teks = '=================\n'
					for (let i of data.result) {
						teks += `*Hastag* : ${i.hastag}\n*link* : ${i.link}\n*rank* : ${i.rank}\n*Tweet* : ${i.tweet}\n=================\n`
					}
					reply(teks.trim())
					break
		case 'jadwaltv':
               client.updatePresence(from, Presence.composing) 
                 data = await fetchJson(`https://mhankbarbars.herokuapp.com/api/jdtv?ch=${body.slice(10)}&apiKey=${apiKey}`)
				if (data.error) return reply(data.error)
				reply(data.result)
				break
                case 'cuaca':
                client.updatePresence(from, Presence.composing) 
                data = await fetchJson(`https://rest.farzain.com/api/cuaca.php?id=${body.slice(7)}&apikey=${apikey}`)
                if (data.error) return reply(data.error)
                hasil = `╠➥ Tempat : ${data.respon.tempat}\n╠➥ angin : ${data.respon.angin}\n╠➥ cuaca : ${data.respon.cuaca}\n╠➥ desk : ${data.respon.desk}\n╠➥ kelembapan : ${data.respon.kelembapan}\n╠➥ suhu : ${data.respon.suhu}\n╠➥ udara : ${data.respon.udara}`
                reply(hasil)
                break
		case 'quran':
					anu = await fetchJson(`https://api.banghasan.com/quran/format/json/acak`, {method: 'get'})
					quran = `${anu.acak.ar.teks}\n\n${anu.acak.id.teks}\nQ.S ${anu.surat.nama} ayat ${anu.acak.id.ayat}`
					client.sendMessage(from, quran, text, {quoted: mek})
					break
			  case 'wa.me':
				  case 'wame':
  client.updatePresence(from, Presence.composing) 
      options = {
          text: `「 *SELF WHATSAPP* 」\n\n_Request by_ : *@${sender.split("@s.whatsapp.net")[0]}*\n\nYour link WhatsApp : *https://wa.me/${sender.split("@s.whatsapp.net")[0]}*\n*Or ( / )*\n*https://api.whatsapp.com/send?phone=${sender.split("@")[0]}*`,
          contextInfo: { mentionedJid: [sender] }
    }
    client.sendMessage(from, options, text, { quoted: mek } )
				break
			case 'ytsearch':
					client.updatePresence(from, Presence.composing) 
					if (args.length < 1) return reply('Yang mau di cari apaan? titit?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '--------------------------\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*links* : https://youtu.be/${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n--------------------------\n`
					}
					reply(teks.trim())
					break
		case 'bucin':
                   bucin()
               .then(data => {
                   const { desc } = data
                   let hasil = `${desc}`
                   client.sendMessage(id, hasil, MessageType.text)
               })
              .catch(err => {
                   console.log(err)
              })
               break
            case 'say':
           await client.sendMessage(id, value, MessageType.text)
           break
              case 'namaninja':
           namaninja(value)
               .then(data => {
                   const { ninja } = data
let hasil = `*Nama Ninja Kamu* :  \n\n${ninja}`
                   client.sendMessage(id, hasil, MessageType.text)
               })
               .catch(err => {
                   console.log(err)
               })
              break
case 'setbotpp':
				if (!isQuotedImage) return reply(`Kirim gambar dengan caption ${prefix}setbotpp atau tag gambar yang sudah dikirim`)
					if (!isOwner) return reply(mess.only.ownerB)
					enmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(enmedia)
					await client.updateProfilePicture(botNumber, media)
					reply('Makasih profil barunya😗')
					break
				case '--simi--':
					if (args.length < 1) return reply('𝗸𝗮𝘀𝗶𝗵 𝘁𝗲𝗸𝘀 𝗹𝗮𝗵 𝘁𝗼𝗱!!!')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
case 'tomp3':
					if (!isQuotedVideo) return reply('❌ reply videonya um ❌')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi video ke mp3 ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', quoted: mek})
						fs.unlinkSync(ran)
					})
					break
				case '--simih--':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝗧𝗼𝗱 :𝘃')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳 𝘁𝗼𝗱!!!')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘀𝗶𝗺𝗶 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘀𝗶𝗺𝗶 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️️')
					} else {
						reply('𝗸𝗲𝘁𝗶𝗸 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝟭 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻, 𝟬 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻\n𝗰𝗼𝗻𝘁𝗼𝗵: 𝘀𝗶𝗺𝗶𝗵 𝟭')
					}
					break
				case '--nsfw--':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝗧𝗼𝗱 :𝘃')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳 𝘁𝗼𝗱!!')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝗻𝘀𝗳𝘄 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝗻𝘀𝗳𝘄 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else {
						reply('𝗸𝗲𝘁𝗶𝗸 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝟭 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻, 𝟬 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻\n𝗰𝗼𝗻𝘁𝗼𝗵: 𝗻𝘀𝗳𝘄 𝟭')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝗧𝗼𝗱 :𝘃')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳 𝘁𝗼𝗱!!!')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘄𝗲𝗹𝗰𝗼𝗺𝗲/𝗹𝗲𝗳𝘁 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘄𝗲𝗹𝗰𝗼𝗺𝗲/𝗹𝗲𝗳𝘁 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else {
						reply('𝗸𝗲𝘁𝗶𝗸 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝟭 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻, 𝟬 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻\n𝗰𝗼𝗻𝘁𝗼𝗵: ${prefix}𝘄𝗲𝗹𝗰𝗼𝗺𝗲 𝟭')
					}
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply('𝙡𝙪 𝙨𝙞𝙖𝙥𝙖 𝙩𝙤𝙙?') 
					if (args.length < 1) return reply('𝘁𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶 𝗰𝗹𝗼𝗻𝗲!!!')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('𝗬𝗲𝗮𝗵 𝗴𝗮𝗴𝗮𝗹 ;(, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘆𝗮𝗵 𝘁𝗼𝗱 ^_^')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('𝗸𝗶𝗿𝗶𝗺 𝗳𝗼𝘁𝗼 𝗱𝗲𝗻𝗴𝗮𝗻 𝗰𝗲𝗽𝘁𝗶𝗼𝗻 𝗼𝗰𝗿')
					}
					break
	default:
			if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
					}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

                     
/*
*Thanks For 𝗠𝗵𝗮𝗻𝗸𝗕𝗮𝗿𝗕𝗮𝗿
*/

