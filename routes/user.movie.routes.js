const userActions = require('../actions/user/movie.actions');
const Buttons = require('../components/buttons');

module.exports = (bot) => {

    /*          UTENTE - FILM           */

    // pannello film
    bot.action('PANNELLO_FILM', userActions.pannello_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER TITOLO          */

    // pannello ricerca film per titolo
    bot.action('PANNELLO_RICERCA_FILM_TITOLO', userActions.pannello_ricerca_film_titolo).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello risultati ricerca film per titolo, utilizzato per tornare indietro dalla locandina
    bot.action('PANNELLO_RISULTATI_RICERCA', userActions.pannello_risultati_ricerca_titolo).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_TITOLO', (ctx) => {
        ctx.session.currentPage -= 1; 
        userActions.pannello_risultati_ricerca_titolo(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_TITOLO', (ctx) => {
        ctx.session.currentPage += 1; 
        userActions.pannello_risultati_ricerca_titolo(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_FILM_TITOLO: +/, userActions.locandina_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER GENERE          */

    // pannello ricerca film per genere
    bot.action('PANNELLO_RICERCA_FILM_GENERE', userActions.pannello_ricerca_film_genere).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/RISULTATI_FILM_GENERE: +/, userActions.pannello_risultati_film_genere).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_GENERE', (ctx) => {
        ctx.session.currentPage -= 1; 
        userActions.pannello_risultati_film_genere(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_GENERE', (ctx) => {
        ctx.session.currentPage += 1; 
        userActions.pannello_risultati_film_genere(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_FILM_GENERE: +/, userActions.locandina_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER LETTERA         */

    // pannello ricerca film per lettera
    bot.action('PANNELLO_RICERCA_FILM_LETTERA', userActions.pannello_ricerca_film_lettera).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/RISULTATI_FILM_LETTERA: +/, userActions.pannello_risultati_film_lettera).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_LETTERA', (ctx) => {
        ctx.session.currentPage -= 1; 
        userActions.pannello_risultati_film_lettera(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_LETTERA', (ctx) => {
        ctx.session.currentPage += 1; 
        userActions.pannello_risultati_film_lettera(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_FILM_LETTERA: +/, userActions.locandina_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PER ANNO            */

    // pannello ricerca film per anno
    bot.action('PANNELLO_RICERCA_FILM_ANNO', userActions.pannello_ricerca_film_anno).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello risultati ricerca film per anno, utilizzato per tornare indietro dalla locandina
    bot.action('RISULTATI_FILM_ANNO', userActions.pannello_risultati_film_anno).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_ANNO', (ctx) => {
        ctx.session.currentPage -= 1; 
        userActions.pannello_risultati_film_anno(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_ANNO', (ctx) => {
        ctx.session.currentPage += 1; 
        userActions.pannello_risultati_film_anno(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_FILM_ANNO: +/, userActions.locandina_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });



    /*          RICERCA PIÙ VOTATI            */

    // pannello risultati ricerca film più votati
    bot.action('RISULTATI_FILM_PIÙ_VOTATI', userActions.pannello_risultati_film_più_votati).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina precedente dei risultati della ricerca
    bot.action('PREV_PAGE_PIÙ_VOTATI', (ctx) => {
        ctx.session.currentPage -= 1; 
        userActions.pannello_risultati_film_più_votati(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // porta alla pagina successiva dei risultati della ricerca
    bot.action('NEXT_PAGE_PIÙ_VOTATI', (ctx) => {
        ctx.session.currentPage += 1; 
        userActions.pannello_risultati_film_più_votati(ctx);
    }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film
    bot.action(/DETTAGLI_FILM_PIÙ_VOTATI: +/, userActions.locandina_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });



    /*          RANDOM          */

    // pannello risultati ricerca film più votati
    bot.action('RISULTATI_FILM_RANDOM', userActions.pannello_risultati_film_random).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });



    /*          FILES FILM          */

    // pannello file relativi al film scelto, uguale per tutti i tipi di ricerca
    bot.action('PANNELLO_FILE_FILM', userActions.pannello_files_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });


    
    /*          RICHIESTE           */

    // pannello principale richieste. Chiede il tipo di richiesta che si vuole fare
    bot.action('PANNELLO_RICHIESTE', userActions.pannello_richieste).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello principale richiesta film [SUB-ITA]. chiede di inserire il titolo
    bot.action('PANNELLO_RICHIESTA_FILM_SUB_ITA', userActions.pannello_richiesta_film_SUB_ITA).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello principale richiesta film. chiede di inserire il titolo
    bot.action('PANNELLO_RICHIESTA_FILM', userActions.pannello_richiesta_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    bot.action('PANNELLO_RISULTATI_RICERCA_RICHIESTA', userActions.pannello_risultati_richiesta_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // pannello locandina film richiesto. mostra la locandina del film selezionato
    bot.action(/RICHIESTA_LOCANDINA_TMDB: +/, userActions.pannello_locandina_richiesta_film).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

    // se la richiesta inviata riguarda un film presente su TMDB, allora passando false come secondo
    // parametro viene inviata la richiesta come locandina e non come messaggio
    bot.action('PANNELLO_RICHIESTA_INVIATA', (ctx) => { userActions.pannello_richiesta_inviata(ctx, false) }).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
                console.log("ERRORE REPLY ERRORE USER MOVIE ROUTES");
                console.error(err);
            });
    });

}