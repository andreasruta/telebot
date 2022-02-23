const seriesActions = require('../actions/user/serie.actions');
const Buttons = require('../components/buttons');

module.exports = (bot) => {

    /*          UTENTE - SERIE           */

    // pannello serie
    bot.action('PANNELLO_SERIE_TV', seriesActions.pannello_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER TITOLO          */

    // pannello ricerca serie per titolo
    bot.action('PANNELLO_RICERCA_SERIE_TITOLO', seriesActions.pannello_ricerca_serie_titolo).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello risultati ricerca serie per titolo, utilizzato per tornare indietro dalla locandina
    bot.action('PANNELLO_RISULTATI_RICERCA_SERIE', seriesActions.pannello_risultati_ricerca_titolo).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_TITOLO_SERIE', (ctx) => {
        ctx.session.currentPage -= 1; 
        seriesActions.pannello_risultati_ricerca_titolo(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_TITOLO_SERIE', (ctx) => {
        ctx.session.currentPage += 1; 
        seriesActions.pannello_risultati_ricerca_titolo(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_SERIE_TITOLO: +/, seriesActions.locandina_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER GENERE          */

    // pannello ricerca film per genere
    bot.action('PANNELLO_RICERCA_SERIE_GENERE', seriesActions.pannello_ricerca_serie_genere).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/RISULTATI_SERIE_GENERE: +/, seriesActions.pannello_risultati_serie_genere).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_GENERE_SERIE', (ctx) => {
        ctx.session.currentPage -= 1; 
        seriesActions.pannello_risultati_serie_genere(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_GENERE_SERIE', (ctx) => {
        ctx.session.currentPage += 1; 
        seriesActions.pannello_risultati_serie_genere(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_SERIE_GENERE: +/, seriesActions.locandina_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER LETTERA         */

    // pannello ricerca film per lettera
    bot.action('PANNELLO_RICERCA_SERIE_LETTERA', seriesActions.pannello_ricerca_serie_lettera).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/RISULTATI_SERIE_LETTERA: +/, seriesActions.pannello_risultati_serie_lettera).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_LETTERA_SERIE', (ctx) => {
        ctx.session.currentPage -= 1; 
        seriesActions.pannello_risultati_serie_lettera(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_LETTERA_SERIE', (ctx) => {
        ctx.session.currentPage += 1; 
        seriesActions.pannello_risultati_serie_lettera(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_SERIE_LETTERA: +/, seriesActions.locandina_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER ANNO            */

    // pannello ricerca film per anno
    bot.action('PANNELLO_RICERCA_SERIE_ANNO', seriesActions.pannello_ricerca_serie_anno).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello risultati ricerca film per anno, utilizzato per tornare indietro dalla locandina
    bot.action('RISULTATI_SERIE_ANNO', seriesActions.pannello_risultati_serie_anno).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_ANNO_SERIE', (ctx) => {
        ctx.session.currentPage -= 1; 
        seriesActions.pannello_risultati_serie_anno(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_ANNO_SERIE', (ctx) => {
        ctx.session.currentPage += 1; 
        seriesActions.pannello_risultati_serie_anno(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_SERIE_ANNO: +/, seriesActions.locandina_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PIÙ VOTATI            */

    // pannello risultati ricerca film più votati
    bot.action('RISULTATI_SERIE_PIÙ_VOTATE', seriesActions.pannello_risultati_serie_più_votate).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_PIÙ_VOTATI_SERIE', (ctx) => {
        ctx.session.currentPage -= 1; 
        seriesActions.pannello_risultati_serie_più_votate(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_PIÙ_VOTATI_SERIE', (ctx) => {
        ctx.session.currentPage += 1; 
        seriesActions.pannello_risultati_serie_più_votate(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_SERIE_PIÙ_VOTATE: +/, seriesActions.locandina_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });



    /*          RANDOM          */

    // pannello risultati ricerca film più votati
    bot.action('RISULTATI_SERIE_RANDOM', seriesActions.pannello_risultati_serie_random).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });



    /*          FILES FILM          */

    // pannello file relativi al film scelto, uguale per tutti i tipi di ricerca
    bot.action('PANNELLO_FILE_SERIE', seriesActions.pannello_files_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });


    /*          RICHIESTE           */

    // pannello principale richiesta film. chiede di inserire il titolo
    bot.action('PANNELLO_RICHIESTA_SERIE', seriesActions.pannello_richiesta_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    bot.action('PANNELLO_RISULTATI_RICERCA_RICHIESTA_SERIE', seriesActions.pannello_risultati_richiesta_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film richiesto. mostra la locandina del film selezionato
    bot.action(/RICHIESTA_LOCANDINA_TMDB_SERIE: +/, seriesActions.pannello_locandina_richiesta_serie).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

    // se la richiesta inviata riguarda un film presente su TMDB, allora passando false come secondo
    // parametro viene inviata la richiesta come locandina e non come messaggio
    bot.action('PANNELLO_RICHIESTA_INVIATA_SERIE', (ctx) => { seriesActions.pannello_richiesta_inviata(ctx, false) }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER SERIE ROUTES");
                console.error(err);
            });
    });

}