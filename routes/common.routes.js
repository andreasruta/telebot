const userMovieActions = require('../actions/user/movie.actions');
const userSerieActions = require('../actions/user/serie.actions');
const adminMovieActions = require('../actions/admin/admin.movie.actions');
const adminSerieActions = require('../actions/admin/admin.serie.actions');
const adminCommonActions = require('../actions/admin/admin.common.actions');
const startAction = require('../actions/start.action');
const Menu = require('../components/menu');
const Buttons = require('../components/buttons');

module.exports = (bot) => {
    
    // pannello di benvenuto all'avvio
    bot.start(startAction.start).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE COMMON ROUTES");
                console.error(err);
            });
    });

    // pannello di benvenuto quando viene premuto "indietro"
    bot.action('PANNELLO_BENVENUTO', startAction.start).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE COMMON ROUTES");
                console.error(err);
            });
    });

    bot.action('RISPOSTA_RICHIESTA_RICEVUTA', (ctx) => {
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id);
        } catch (err) {
            console.error(err);
        }
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE COMMON ROUTES");
                console.error(err);
            });
    });

    /*          SPONSOR         */

    bot.action('PANNELLO_SPONSOR', async (ctx) => {
        try {
            await ctx.deleteMessage(ctx.update.callback_query.message.id);
        } catch (err) {
            console.error(err);
        }
        ctx.reply('🤝 <b>SPONSOR</> 🤝\n\nPer qualsiasi informazione contattaci cliccando il link qui sotto:\n\n' +
            '<i>@Contatto_Admin_SerietvfilmsBOT</>',
            { parse_mode: 'HTML', reply_markup: Menu.pannello_sponsor });
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE COMMON ROUTES");
                console.error(err);
            });
    });

    /*          DONAZIONI         */

    bot.action('PANNELLO_DONAZIONI', async (ctx) => {
        try {
            await ctx.deleteMessage(ctx.update.callback_query.message.id);
        } catch (err) {
            console.error(err);
        }
        ctx.reply('⚠️ <b>POTETE DARCI UNA MANO</> ⚠️\n\n'
            + 'Abbiamo aperto e messo a disposizione una moneybox paypal con la quale potete,' 
            + ' qualora vogliate, supportare il nostro lavoro donando qualsiasi cifra riteniate opportuna'
            + ' e abbiate voglia di donare, ogni aiuto è gradito.\n'
            + '~Lo Staff\n\n'
            + '<i>Per donare contattaci: @Contatto_Admin_SerietvfilmsBOT</>',
            { parse_mode: 'HTML', reply_markup: Menu.pannello_donazioni });
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE COMMON ROUTES");
                console.error(err);
            });
    });

    /*          AIUTO         */

    bot.action('PANNELLO_AIUTO', async (ctx) => {
        try {
            await ctx.deleteMessage(ctx.update.callback_query.message.id);
        } catch (err) {
            console.error(err);
        }
        ctx.reply('🚑 <b>AIUTO</> 🚑\n\nClicca sui bottoni relativi alle guide oppure contattaci cliccando questo link:\n' +
            '<i>@Contatto_Admin_SerietvfilmsBOT</>',
            { parse_mode: 'HTML', reply_markup: Menu.pannello_aiuto });
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE COMMON ROUTES");
                console.error(err);
            });
    });

    /*          UTILIZZATO PER OGNI INSERIMENTO DI TESTO            */

    // pannello risultati ricerca film da parte dell'utente
    // oppure pannello risultati ricerca per aggiunta film da parte di un admin
    bot.on('text', (ctx) => {
        switch (ctx.session.tipoRicerca) {

                /*      UTENTE - FILM       */

            case 'UTENTE_FILM_TITOLO':
                userMovieActions.pannello_risultati_ricerca_titolo(ctx);
                break;
            case 'UTENTE_FILM_ANNO':
                userMovieActions.pannello_risultati_film_anno(ctx);
                break;
            case 'RICHIESTA_FILM':
                userMovieActions.pannello_risultati_richiesta_film(ctx);
                break;
            case 'RICHIESTA_FILM_NON_PRESENTE':
                // se la richiesta inviata riguarda un film non presente su TMDB, allora passando true come secondo
                // parametro viene inviata la richiesta come messaggio e non come locandina
                userMovieActions.pannello_richiesta_inviata(ctx, true);
                break;

                /*      UTENTE - SERIE      */

            case 'UTENTE_SERIE_TITOLO':
                userSerieActions.pannello_risultati_ricerca_titolo(ctx);
                break;
            case 'UTENTE_SERIE_ANNO':
                userSerieActions.pannello_risultati_serie_anno(ctx);
                break;
            case 'RICHIESTA_SERIE':
                userSerieActions.pannello_risultati_richiesta_serie(ctx);
                break;
            case 'RICHIESTA_SERIE_NON_PRESENTE':
                // se la richiesta inviata riguarda un film non presente su TMDB, allora passando true come secondo
                // parametro viene inviata la richiesta come messaggio e non come locandina
                userSerieActions.pannello_richiesta_inviata(ctx, true);
                break;

                /*      ADMIN - GESTIONE UTENTI     */

            case 'AZZERA_WARN':
                adminCommonActions.azzera_warn(ctx);
                break;
            case 'DIMINUISCI_WARN':
                adminCommonActions.diminuisci_warn(ctx);
                break;
            case 'BANNA_UTENTE':
                adminCommonActions.banna_utente(ctx);
                break;
            case 'UNBAN_UTENTE':
                adminCommonActions.unban_utente(ctx);
                break;

                /*      ADMIN - FILM       */

            case 'ADMIN_FILM_AGGIUNGI':
                adminMovieActions.pannello_risultati_ricerca_film(ctx);
                break;
            case 'ADMIN_FILM_ELIMINA':
                adminMovieActions.pannello_risultati_ricerca_elimina(ctx);
                break;
            case 'BACKUP_FILM':
                adminMovieActions.backup_film(ctx);
                break;
            case 'BACKUP_FILM_PUBBLICO':
                adminMovieActions.backup_film_pubblico(ctx);
                break;

                /*      ADMIN - SERIE       */

            case 'ADMIN_SERIE_AGGIUNGI':
                adminSerieActions.pannello_risultati_ricerca_serie(ctx);
                break;
            case 'ADMIN_SERIE_ELIMINA':
                adminSerieActions.pannello_risultati_ricerca_elimina(ctx);
                break;
            case 'BACKUP_SERIE':
                adminSerieActions.backup_serie(ctx);
                break;
            case 'BACKUP_SERIE_PUBBLICO':
                adminSerieActions.backup_serie_pubblico(ctx);
                break;

                /*      SUPER ADMIN     */
            case 'AGGIUNGI_ADMIN':
                adminCommonActions.pannello_aggiungi_admin(ctx);
                break;
            case 'ELIMINA_ADMIN':
                adminCommonActions.pannello_elimina_admin(ctx);
                break;
        }
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE COMMON ROUTES");
                console.error(err);
            });
    });
}