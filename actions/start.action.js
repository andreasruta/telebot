const Menu = require('../components/menu');
const Buttons = require('../components/buttons');
const Movie = require('../controllers/movie.controller');
const Serie = require('../controllers/serie.controller');
const User = require('../controllers/user.controller');
const Admin = require('../controllers/admin.controller');
const MOVIE_CHANNEL_ID = process.env.MOVIE_CHANNEL_ID; // Canale test, da cambiare per produzione
const SERIE_CHANNEL_ID = process.env.SERIE_CHANNEL_ID; // Canale test, da cambiare per produzione

exports.start = async (ctx) => {
    if (ctx.startPayload && ctx.startPayload.includes('FILM')) {
        inviaFilesFILM(ctx);
    } else if (ctx.startPayload && ctx.startPayload.includes('SERIE')) {
        inviaFilesSERIE(ctx);
    } else {
    
        let movieCount = await Movie.count();
        let serieCount = await Serie.count();
        
        const isAdmin = await Admin.findOne(ctx.from.id);
        if (isAdmin) {
            await Admin.update(ctx.from.id, { nome: ctx.from.first_name, username: ctx.from.username });
        }
        // cerca utente nel db, se non è presente lo crea
        User.create(ctx.from.id, ctx.from.first_name, ctx.from.username);
    
        await ctx.reply(
            `👋🏻 Benvenut* ${ctx.from.first_name} 👋🏻\n\n🎬 Film disponibili: <b>${movieCount}</>\n📺 Serie disponibili: <b>${serieCount}</>\n
            \n↘️ SELEZIONA UN'OPZIONE: ↙️`,
            {
                parse_mode: 'HTML',
                reply_markup: isAdmin ? Menu.pannello_benvenuto_admin : Menu.pannello_benvenuto
            }
        ).catch((err) => {
            console.log("ERRORE REPLY BENVENUTO");
            console.error(err);
        });
        try {
            if (ctx.update.callback_query && ctx.update.callback_query.message.document) {
                ctx.editMessageReplyMarkup().catch((err) => {
                    console.log("ERRORE EDIT MESSAGE REPLY MARKUP START");
                    console.error(err);
                });
            } else if (ctx.update.callback_query && !ctx.update.callback_query.message.document) {
                ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE 1 START");
                    console.error(err);
                });
            } else if (ctx.update.message) {
                ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE 2 START");
                    console.error(err);
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
}

const inviaFilesFILM = async (ctx) => {
    try {
        const movieId = ctx.startPayload.split('M')[1];
        const movie = await Movie.findOne(movieId);
        let contatore_limite_messaggi = 0;
        for (const currentId of movie.files_messages_id) {
            if (contatore_limite_messaggi == 18) {
                contatore_limite_messaggi = 0;
                await sleep(40000);
            }
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.from.id, MOVIE_CHANNEL_ID, currentId,
                (movie.files_messages_id.indexOf(currentId) === (movie.files_messages_id.length - 1)) ? 
                    { reply_markup: Menu.pannello_file_film } : ''
            ).catch((err) => {
                console.log("ERRORE REPLY FILM START");
                console.error(err);
            });
            contatore_limite_messaggi += 1;
        }
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE FILM START");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE START");
                console.error(err);
            });
    }
}

const inviaFilesSERIE = async (ctx) => {
    try {
        const serieId = ctx.startPayload.split('E')[2];
        const serie = await Serie.findOne(serieId);
        let contatore_limite_messaggi = 0;
        for (const currentId of serie.files_messages_id) {
            if (contatore_limite_messaggi == 18) {
                contatore_limite_messaggi = 0;
                await sleep(40000);
            }
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.from.id,  SERIE_CHANNEL_ID, currentId,
                (serie.files_messages_id.indexOf(currentId) === (serie.files_messages_id.length - 1)) ? 
                    { reply_markup: Menu.pannello_file_serie } : ''
            ).catch((err) => {
                console.log("ERRORE REPLY SERIE START");
                console.error(err);
            });
            contatore_limite_messaggi += 1;
        }
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE FILM START");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE START");
                console.error(err);
            });
    }
}

// usata per evitare il blocco per il superamento dei 20 messaggi inviati in un minuto
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}