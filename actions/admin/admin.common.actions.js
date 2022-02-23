require('dotenv').config();
const Buttons = require('../../components/buttons');
const Menu = require("../../components/menu");
const Movie = require("../../controllers/movie.controller");
const Serie = require("../../controllers/serie.controller");
const Stato_richieste = require('../../controllers/bot.controller');
const User = require('../../controllers/user.controller');
const Admin = require('../../controllers/admin.controller');
const Bot = require('../../controllers/bot.controller');
// Canale test, da cambiare per produzione
const { PUBLIC_CHANNEL_MOVIE, PUBLIC_CHANNEL_SERIE, CHANNEL_NEWS } = process.env;


// pannello amministratore
exports.pannello_admin = async (ctx) => {
    const stato_richieste = await Stato_richieste.requests_state();
    await ctx.reply('🕵️‍♂️ *ADMIN MODE* 🕵️‍♂️\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'Markdown', reply_markup: await Menu.pannello_admin(stato_richieste, ctx.from.id) });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO ADMIN");
        console.error(err);
    });
    azzeraSession(ctx);
}

// l'admin può aprire o chiudere la possibilità di fare richieste
exports.cambia_stato_richieste = async (ctx) => {
    try {
        if (ctx.update.callback_query.data == 'CHIUDI_RICHIESTE') {
            Stato_richieste.update(false);
            ctx.answerCbQuery('‼️ Richieste Chiuse ‼️', {show_alert: true});
            ctx.editMessageReplyMarkup(await Menu.pannello_admin(false, ctx.from.id));
        } else {
            Stato_richieste.update(true);
            ctx.answerCbQuery('‼️ Richieste Aperte ‼️', {show_alert: true});
            ctx.editMessageReplyMarkup(await Menu.pannello_admin(true, ctx.from.id));
        }
    } catch (err) {
        console.error(err);
    }
}

exports.pannello_statistiche = async (ctx) => {
    let movieCount = await Movie.count();
    let serieCount = await Serie.count();
    let userCount = await User.count();
    let bannedCount = await User.bannedCount();
    let warnedCount = await User.warnedCount();
    let bot = await Bot.find();

    ctx.reply(
        `📊 *STATISTICHE BOT* 📊\n\n🎬 Film disponibili: *${movieCount}*\n📺 Serie disponibili: *${serieCount}*\n\n`
            + `🏂 Utenti totali: *${userCount}*\n⚠️ Utenti warnati: *${warnedCount}*\n`
            + `🚷 Utenti bannati: *${bannedCount}*\n\n`
            + `📨 Richieste film: *${bot.richieste_film}* 🎬\n📨 Richieste film SUB-ITA: *${bot.richieste_film_sub_ita}* 🈂️\n`
            + `📨 Richieste serie TV: *${bot.richieste_serie}* 📺`,
        {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [
                [{ text: '⚠️ Report warn utenti ⚠️', callback_data: 'WARN_REPORT' }],
                [{ text: '🚷 Lista bannati 🚷', callback_data: 'BANNED_REPORT' }],
                [ Buttons.indietro('PANNELLO_ADMIN') ]
            ]}
        }
    );
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO STATISTICHE");
        console.error(err);
    });
}

exports.warn_report = async (ctx) => {
    let warnedList = await User.warnedList();
    let lista = '';

    if (warnedList.length > 0) {
        warnedList.forEach((currentUser) => {
            lista += '\n' + (currentUser.username ? currentUser.username : currentUser.chat_id)
                + ' ---> <b>' + currentUser.ammonizioni + '</>';
        });
    } else {
        lista = '\nNon ci sono utenti warnati.';
    }

    ctx.reply(
        `⚠️ <b>LISTA WARN</> ⚠️\n` + lista,
        {
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: [
                [ Buttons.indietro('PANNELLO_STATISTICHE') ]
            ]}
        }
    );
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO WARN REPORT");
        console.error(err);
    });
}

exports.banned_report = async (ctx) => {
    let bannedList = await User.bannedList();
    let lista = '';

    if (bannedList.length > 0) {
        bannedList.forEach((currentUser) => {
            lista += '\n' + (currentUser.username ? currentUser.username : currentUser.chat_id);
        });
    } else {
        lista = '\nNon ci sono utenti bannati.';
    }

    ctx.reply(
        `🚷 <b>LISTA BANNATI</> 🚷\n` + lista,
        {
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: [
                [ Buttons.indietro('PANNELLO_STATISTICHE') ]
            ]}
        }
    );
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO BANNED REPORT");
        console.error(err);
    });
}

// invia riepilogo a tutti gli utenti e al gruppo
exports.invia_riepilogo_giornata = async (ctx) => {
    
    const movies = await Movie.riepilogo();
    const series = await Serie.riepilogo();
    const users = await User.findAll();
    if (movies.length > 0 || series.length > 0) {
        let aggiunte_film = '';
        let aggiunte_serie = '';
        movies.forEach((currentMovie) => {
            aggiunte_film += '\n-<b>' + currentMovie.titolo + '</>';
        });
        series.forEach((currentSerie) => {
            aggiunte_serie += '\n-<b>' + currentSerie.titolo + '</>';
        });
        const film_aggiunti = movies.length > 0 ? '\n\n🍿<b>FILM:</>🍿' + aggiunte_film : '';
        const serie_aggiunte = series.length > 0 ? '\n\n📺<b>SERIE TV:</>📺' + aggiunte_serie : '';
        const image_url = 'https://us.123rf.com/450wm/soifer/soifer1806/soifer180600067/103260415-prossimamente-al-neon-segno-vettoriale-prossimamente-distintivo-in-stile-neon-elemento-di-design-ban.jpg?ver=6';
        const caption = '🗞 <b>AGGIUNTE NELLE ULTIME 24 ORE</> 🗞' + film_aggiunti + serie_aggiunte;
        if (caption.length < 1024) {
            try {
                // invia riepilogo sul gruppo
                ctx.telegram.sendPhoto(-1001371228706, { url: image_url },
                    { caption: caption,
                    parse_mode: 'HTML' });
            } catch (err) {
                console.error('Il bot non fa parte del gruppo');
            }
            users.forEach((currentUser) => {
                try {
                    ctx.telegram.sendPhoto(currentUser.chat_id, { url: image_url },
                        { caption: '🗞 <b>AGGIUNTE NELLE ULTIME 24 ORE</> 🗞' + film_aggiunti 
                            + serie_aggiunte,
                        parse_mode: 'HTML' });
                } catch (err) {
                    console.error(err);
                }
            });
            ctx.answerCbQuery('🛫 RIEPILOGO INVIATO 🛬', {show_alert: true});
        } else if (caption.length < 4096) {
            try {
                // invia riepilogo sul gruppo
                ctx.telegram.sendMessage(-1001371228706, caption, { parse_mode: 'HTML' });
            } catch (err) {
                console.error('Il bot non fa parte del gruppo');
            }
            users.forEach((currentUser) => {
                try {
                    ctx.telegram.sendMessage(currentUser.chat_id, caption, { parse_mode: 'HTML' });
                } catch (err) {
                    console.error(err);
                }
            });
            ctx.answerCbQuery('🛫 RIEPILOGO INVIATO 🛬', {show_alert: true});
        } else {
            ctx.answerCbQuery('‼️ RIEPILOGO NON INVIATO ‼️\n\nIl riepilogo è troppo lungo per essere inviato.', {show_alert: true});
        }
    } else {
        ctx.answerCbQuery('‼️ NESSUN RIEPILOGO ‼️\n\nNon è stato aggiunto nulla nelle ultime 24 ore.', {show_alert: true});
    }
}

/*          GESTIONE UTENTI         */

// pannello amministratore
exports.pannello_gestione_utenti = async (ctx) => {
    await ctx.reply('🧙‍♂️ *GESTIONE UTENTI* 🧙‍♂️\n\nSei in vena di bannare qualche stronzo?',
        { parse_mode: 'Markdown', reply_markup: Menu.pannello_gestione_utenti });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO GESTIONE UTENTI");
        console.error(err);
    });
}

// richiede di inserire id o username dell'utente
exports.pannello_azzera_warn = async (ctx) => {
    await ctx.reply('🧞‍♂️ *AZZERA WARN* 🧞‍♂️\n\nScrivi l\'id o l\'username (senza @) dell\'utente',
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[Buttons.indietro('PANNELLO_GESTIONE_UTENTI')]]} });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO AZZERA WARN");
        console.error(err);
    });
    ctx.session.tipoRicerca = 'AZZERA_WARN';
}

// azzera warn di un utente
exports.azzera_warn = async (ctx) => {
    let user = await User.update(ctx.update.message.text, { ammonizioni: 0 });
    if (user) {
        ctx.reply('‼️ *Warn azzerati* ‼️', 
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[Buttons.fine_gestione_utente]]} });
    } else {
        ctx.reply('‼️ *Errore* ‼️\n\nSi è verificato un errore. riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[Buttons.fine_gestione_utente]]} });
    }
    const id_messaggio = ctx.update.message.message_id - 1;
    try {
        await ctx.deleteMessage(id_messaggio).catch((err) => {
            console.log("ERRORE DELETE MESSAGE AZZERA WARN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    try {
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE AZZERA WARN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = '';
}

// richiede di inserire id o username dell'utente
exports.pannello_diminuisci_warn = async (ctx) => {
    await ctx.reply('⛑ *TOGLI 1 WARN* ⛑\n\nScrivi l\'id o l\'username (senza @) dell\'utente',
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[Buttons.indietro('PANNELLO_GESTIONE_UTENTI')]]} });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO DIMINUISCI WARN");
        console.error(err);
    });
    ctx.session.tipoRicerca = 'DIMINUISCI_WARN';
}

// azzera warn di un utente
exports.diminuisci_warn = async (ctx) => {
    let user = await User.update(ctx.update.message.text);
    if (user) {
        if (user.ammonizioni > 0) {
            user = await User.update(ctx.update.message.text, { ammonizioni: user.ammonizioni - 1 });
        }
        ctx.reply('‼️ *Warn diminuiti di 1* ‼️\n\nAmmonizioni attuali: *' + (user.ammonizioni - 1) + '*', 
            { parse_mode: 'Markdown', reply_markup: { 
                inline_keyboard: [[Buttons.fine_gestione_utente]]} });
    } else {
        ctx.reply('‼️ *Errore* ‼️\n\nSi è verificato un errore. riprova.',
            { parse_mode: 'Markdown', reply_markup: { 
                inline_keyboard: [[Buttons.fine_gestione_utente]]} });
    }
    const id_messaggio = ctx.update.message.message_id - 1;
    try {
        await ctx.deleteMessage(id_messaggio).catch((err) => {
            console.log("ERRORE DELETE MESSAGE DIMINUISCI WARN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    try {
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE DIMINUISCI WARN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = '';
}

// richiede di inserire id o username dell'utente
exports.pannello_banna_utente = async (ctx) => {
    await ctx.reply('🖕🏻 *BANNA UTENTE* 🖕🏻\n\nScrivi l\'id o l\'username (senza @) dell\'utente da bannare',
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[Buttons.indietro('PANNELLO_GESTIONE_UTENTI')]]} });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO BANNA UTENTE");
        console.error(err);
    });
    ctx.session.tipoRicerca = 'BANNA_UTENTE';
}

// banna un utente
exports.banna_utente = async (ctx) => {
    const channels = [PUBLIC_CHANNEL_MOVIE, PUBLIC_CHANNEL_SERIE, CHANNEL_NEWS];
    let user = await User.findOne(ctx.update.message.text);
    if (user) {
        channels.forEach(currentChannel => {
            try {
                ctx.telegram.kickChatMember(currentChannel, user.chat_id, {revoke_messages: true});
            } catch (err) {
                console.error(err);
            }
        });
        User.update(ctx.update.message.text, { banned: true }).then(() => {
            ctx.reply('‼️ *UTENTE BANNATO* ‼\n\nNon romperà più il cazzo.',
            { parse_mode: 'Markdown', reply_markup: { 
                inline_keyboard: [[Buttons.fine_gestione_utente]]} });
        }).catch((err) => {
            console.error(err);
            ctx.reply('‼️ *Errore* ‼️\n\nSi è verificato un errore. riprova.',
            { parse_mode: 'Markdown', reply_markup: { 
                inline_keyboard: [[Buttons.fine_gestione_utente]]} });
        });
    } else {
        ctx.reply('‼️ *Errore* ‼️\n\nUtente non trovato.',
            { parse_mode: 'Markdown', reply_markup: { 
                inline_keyboard: [[Buttons.fine_gestione_utente]]} });
    }
    const id_messaggio = ctx.update.message.message_id - 1;
    try {
        await ctx.deleteMessage(id_messaggio).catch((err) => {
            console.log("ERRORE DELETE MESSAGE BANNA UTENTE");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    try {
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE BANNA UTENTE");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = '';
}

// richiede di inserire id o username dell'utente
exports.pannello_unban_utente = async (ctx) => {
    await ctx.reply('👻 *SBANNA UTENTE* 👻\n\nScrivi l\'id o l\'username (senza @) dell\'utente da unbannare',
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[Buttons.indietro('PANNELLO_GESTIONE_UTENTI')]]} });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO UNBAN UTENTE");
        console.error(err);
    });
    ctx.session.tipoRicerca = 'UNBAN_UTENTE';
}

// revoca il ban di un utente
exports.unban_utente = async (ctx) => {
    const channels = [PUBLIC_CHANNEL_MOVIE, PUBLIC_CHANNEL_SERIE, CHANNEL_NEWS];
    let user = await User.findOne(ctx.update.message.text);
    if (user) {
        channels.forEach(currentChannel => {
            ctx.telegram.unbanChatMember(currentChannel, user.chat_id, {only_if_banned: true});
        });
        await User.update(ctx.update.message.text, { banned: false });
        ctx.reply('‼️ *UTENTE UNBANNATO* ‼️',
            { parse_mode: 'Markdown', reply_markup: { 
                inline_keyboard: [[Buttons.fine_gestione_utente]]} });
    } else {
        ctx.reply('‼️ *Errore* ‼️\n\nSi è verificato un errore. riprova.',
            { parse_mode: 'Markdown', reply_markup: { 
                inline_keyboard: [[Buttons.fine_gestione_utente]]} });
    }
    const id_messaggio = ctx.update.message.message_id - 1;
    try {
        await ctx.deleteMessage(id_messaggio).catch((err) => {
            console.log("ERRORE DELETE MESSAGE UNBANNA UTENTE");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    try {
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE UNBANNA UTENTE");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = '';
}

/*          SUPER ADMIN         */

// pannello super admin
exports.pannello_super_admin = async (ctx) => {
    await ctx.reply('🦸‍♂️ *SUPER ADMIN* 🦸‍♂️\n\nSei il prescelto, il canale è nelle tue mani, ma ricorda:\n\n'
        + '_Da grandi poteri derivano grandi responsabilità._',
        { parse_mode: 'Markdown', reply_markup: Menu.pannello_super_admin });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO SUPER ADMIN");
        console.error(err);
    });
    ctx.session.movie = '';
    ctx.session.movieId = '';
    ctx.session.serie = '';
    ctx.session.serieId = '';
    ctx.session.tipoRicerca = '';
    ctx.session.id_locandina = '';
    ctx.session.tipoDocumento = '';
    ctx.session.tipoFoto = '';
    ctx.session.title = '';
}

/*          AGGIUNGI ADMIN          */

// pannello aggiungi admin
exports.pannello_aggiungi_admin_richiesta_id = async (ctx) => {
    await ctx.reply('🦸‍♂️ *SUPER ADMIN* 🦸‍♂️\n\nScrivi l\'id o l\'username dell\'admin che vuoi *AGGIUNGERE*...',
        { parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO AGGIUNGI ADMIN");
        console.error(err);
    });
    ctx.session.tipoRicerca = 'AGGIUNGI_ADMIN';
}

// pannello aggiungi admin
exports.pannello_aggiungi_admin = async (ctx) => {
    Admin.create(ctx.update.message.text).then(async (result) => {
        if (result) {
            await ctx.reply('🦸‍♂️ *SUPER ADMIN* 🦸‍♂️\n\n✅L\'admin è stato *AGGIUNTO* correttamente.',
                { parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} });
        } else {
            await ctx.reply('❌ *ERRORE* ❌\n\nSi è verificato un errore. Riprovare.',
                { parse_mode:'Markdown', reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} });
        }
    }).catch(async (err) => {
        console.error(err);
        await ctx.reply('❌ *ERRORE* ❌\n\nSi è verificato un errore. Riprovare.',
            { parse_mode:'Markdown', reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} });
    })
    const id_messaggio = ctx.update.message.message_id - 1;
    try {
        await ctx.deleteMessage(id_messaggio).catch((err) => {
            console.log("ERRORE DELETE MESSAGE AGGIUNGI ADMIN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    try {
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE AGGIUNGI ADMIN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = '';
}


/*          ELIMINA ADMIN           */

// pannello aggiungi admin
exports.pannello_elimina_admin_richiesta_id = async (ctx) => {
    await ctx.reply('🦸‍♂️ *SUPER ADMIN* 🦸‍♂️\n\nScrivi l\'id o l\'username dell\'admin che vuoi *ELIMINARE*...',
        { parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE PANNELLO ELIMINA ADMIN");
        console.error(err);
    });
    ctx.session.tipoRicerca = 'ELIMINA_ADMIN';
}

// pannello aggiungi admin
exports.pannello_elimina_admin = async (ctx) => {
    Admin.delete(ctx.update.message.text).then(async (result) => {
        if (result) {
            await ctx.reply('🦸‍♂️ *SUPER ADMIN* 🦸‍♂️\n\n✅L\'admin è stato *ELIMINATO* correttamente.',
                { parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} });
        } else {
            await ctx.reply('🦸‍♂️ *SUPER ADMIN* 🦸‍♂️\n\nNessun admin corrispondente all\'id inserito.',
                { parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} });
        }
    }).catch(async (err) => {
        console.error(err);
        await ctx.reply('Si è verificato un errore. Riprovare.',
            { reply_markup: {inline_keyboard: [[Buttons.indietro('PANNELLO_SUPER_ADMIN')]]} })
    });
    const id_messaggio = ctx.update.message.message_id - 1;
    try {
        await ctx.deleteMessage(id_messaggio).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ELIMINA ADMIN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    try {
        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ELIMINA ADMIN");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = '';
}

/*          FUNZIONI AUSILIARIE         */

// resetta tutte le variabili di sessione
const azzeraSession = (ctx) => {
    try {
        ctx.session.movie = '';
        ctx.session.movieId = '';
        ctx.session.serie = '';
        ctx.session.serieId = '';
        ctx.session.tipoRicerca = '';
        ctx.session.id_locandina = '';
        ctx.session.tipoDocumento = '';
        ctx.session.tipoFoto = '';
        ctx.session.title = '';
    } catch {
        return;
    }
}