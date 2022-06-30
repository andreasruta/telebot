const { Telegraf, Scenes, session } = require('telegraf');
const db = require('./models');
require('dotenv').config();
const { BOT_TOKEN, PUBLIC_CHANNEL_MOVIE, PUBLIC_CHANNEL_SERIE, CHANNEL_NEWS, REQUEST_CHANNEL_MOVIE, REQUEST_CHANNEL_SERIE } = process.env;
const User = require('./controllers/user.controller');
const Buttons = require('./components/buttons');

const bot = new Telegraf(BOT_TOKEN);

// configurazione per scenari
const stage = new Scenes.Stage([]);
bot.use(session());
bot.use(stage.middleware());

// controlla che l'utente sia iscritto ai canali pubblici
bot.use(async (ctx, next) => {
	try {
		let private_chat;
		if (ctx.update.callback_query) {
			private_chat = ctx.update.callback_query.message.chat.type == 'channel' ? false : true;
		} else if (ctx.update.message) {
			private_chat = ctx.update.message.chat.type == 'channel' ? false : true;
		}
		if (private_chat) {
			const user = await User.findOne(ctx.from.id);
			if (user.banned) {
				ctx.reply('🔒 *SEI STATO BANNATO* 🔒', {
					parse_mode: 'Markdown'}).catch((err) => {
						console.log("ERRORE RISPOSTA UTENTE BANNATO");
						console.error(err);
					});
			} else {
				let channel_movie = true;
				let channel_serie = true;
				let channel_news = true;
				try {
					channel_movie = await ctx.telegram.getChatMember(PUBLIC_CHANNEL_MOVIE, ctx.from.id);
				} catch (err) {
					console.error(err);
				}
				try {
					channel_serie = await ctx.telegram.getChatMember(PUBLIC_CHANNEL_SERIE, ctx.from.id);
				} catch (err) {
					console.error(err);
				}
				try {
					channel_news = await ctx.telegram.getChatMember(CHANNEL_NEWS, ctx.from.id);
				} catch (err) {
					console.error(err);
				}
				let italia_film = '❌ 🎥 Home Film ITALIA 🇮🇹';
				let italia_serie = '❌ 🎬 Home SerieTV ITALIA 🇮🇹';
				let italia_news = '❌ CANALE AMICO';
				let blocco_film = true;
				let blocco_serie = true;
				let blocco_news = true;
				if (channel_movie) {
					if (channel_movie.status != 'left' && channel_movie.status != 'banned') {
						italia_film = '✅ 🎥 Home Film ITALIA 🇮🇹'
						blocco_film = false;
					}
				}
				if (channel_serie) {
					if (channel_serie.status != 'left' && channel_serie.status != 'banned') {
						italia_serie = '✅ 🎬 Home SerieTV ITALIA 🇮🇹'
						blocco_serie = false;
					}
				}
				if (channel_news) {
					if (channel_news.status != 'left' && channel_news.status != 'banned') {
						italia_news = '✅ CANALE AMICO'
						blocco_news = false;
					}
				}
				if (!blocco_film && !blocco_serie && !blocco_news) {
					next(); // runs next middleware
				} else {
					ctx.reply('🔒 *BOT BLOCCATO* 🔒\n\nPer poter utilizzare il bot iscritivi ai nostri canali qui sotto, poi premi sblocca bot.', {
						parse_mode: 'Markdown',
						reply_markup: { inline_keyboard: 
							[
								[{ text: italia_film, url: 'https://t.me/joinchat/rz6PLV32TC43ZGE0' }],
								[{ text: italia_serie, url: 'https://t.me/+npU0mdBMTPJlMmU0' }],
								[{ text: italia_news, url: 'https://t.me/+VYqMt7U2sZ5djkPR' }],
								[{ text: '🔓 SBLOCCA BOT 🔓', callback_data: 'PANNELLO_BENVENUTO' }]
							]
						}
					}).catch((err) => {
						console.log("ERRORE RISPOSTA BOT BLOCCATO");
						console.error(err);
					});
					try {
						if (ctx.update.message) {
							ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
								console.log("ERRORE DELETE MESSAGE 1 CONTROLLO");
								console.error(err);
							});
						} else {
							ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
								console.log("ERRORE DELETE MESSAGE 2 CONTROLLO");
								console.error(err);
							});
						}
					} catch (err) {
						console.error(err);
						return;
					}
				}
			}
		} else {
			try {
				if (ctx.update.callback_query.message.chat.id == REQUEST_CHANNEL_MOVIE || 
					ctx.update.callback_query.message.chat.id == REQUEST_CHANNEL_SERIE) {
						next();
				}
			} catch (err) {
				console.error(err);
			}
		}
	} catch (err) {
		console.error(err);
		ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
				console.log("ERRORE REPLY ERRORE CONTROLLO");
				console.error(err);
			});
	}
});

// eventi comuni ad utenti e admin in common.routes.js
require('./routes/common.routes.js')(bot);

// eventi relativi ai film in user.movie.routes.js
require('./routes/user.movie.routes')(bot);

// eventi relativi alle serie in user.serie.routes.js
require('./routes/user.serie.routes')(bot);

// eventi relativi agli admin in admin.routes.js
require('./routes/admin.routes')(bot);

// connessione al database
db.mongoose.connect(db.url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connesso al database!");
}).catch(err => {
	console.error("Impossibile connettersi al database!", err);
	process.exit();
})

// setting webhook

bot.launch({
	webhook: {
	  domain: 'https://telebot1234stellone.herokuapp.com',
	  port: process.env.PORT || 3000
	}
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
