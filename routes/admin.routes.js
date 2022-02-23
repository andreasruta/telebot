const movieActions = require('../actions/admin/admin.movie.actions');
const serieActions = require('../actions/admin/admin.serie.actions');
const commonActions = require('../actions/admin/admin.common.actions');

module.exports = (bot) => {

    // pannello principale amministratori
    bot.action('PANNELLO_ADMIN', commonActions.pannello_admin).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('PANNELLO_STATISTICHE', commonActions.pannello_statistiche).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('WARN_REPORT', commonActions.warn_report).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('BANNED_REPORT', commonActions.banned_report).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('INVIA_RIEPILOGO_GIORNATA', commonActions.invia_riepilogo_giornata).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });


    /*          GESTIONE UTENTI         */

    bot.action('PANNELLO_GESTIONE_UTENTI', commonActions.pannello_gestione_utenti).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('PANNELLO_AZZERA_WARN', commonActions.pannello_azzera_warn).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('PANNELLO_DIMINUISCI_WARN', commonActions.pannello_diminuisci_warn).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('PANNELLO_UNBAN_UTENTE', commonActions.pannello_unban_utente).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('PANNELLO_BANNA_UTENTE', commonActions.pannello_banna_utente).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });





    /*          CAMBIA STATO RICHIESTE          */

    bot.action('CHIUDI_RICHIESTE', commonActions.cambia_stato_richieste).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('APRI_RICHIESTE', commonActions.cambia_stato_richieste).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    /*          ADMIN - FILM          */

    // pannello principale film
    bot.action('PANNELLO_FILM_ADMIN', movieActions.pannello_film_admin).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });    

        /*          BACKUP FILM         */

        bot.action('BACKUP_FILM', movieActions.backup_film_richiesta_canale).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        bot.action('BACKUP_FILM_PUBBLICO', movieActions.backup_film_pubblico_richiesta).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });


        /*          ELIMINA FILM            */

        // pannello in cui viene richiesto di interire il titolo del film da eliminare
        bot.action('PANNELLO_ELIMINA_FILM', movieActions.pannello_elimina_film).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        
        // pannello risultati ricerca film per titolo, utilizzato per tornare indietro dalla locandina
        bot.action('PANNELLO_RISULTATI_RICERCA_ELIMINA', movieActions.pannello_risultati_ricerca_elimina).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // porta alla pagina precedente dei risultati della ricerca
        bot.action('PREV_PAGE_ELIMINA', (ctx) => {
            ctx.session.currentPage -= 1; 
            movieActions.pannello_risultati_ricerca_elimina(ctx);
        }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // porta alla pagina successiva dei risultati della ricerca
        bot.action('NEXT_PAGE_ELIMINA', (ctx) => {
            ctx.session.currentPage += 1; 
            movieActions.pannello_risultati_ricerca_elimina(ctx);
        }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello locandina film da eliminare
        bot.action(/DETTAGLI_FILM_ELIMINAZIONE: +/, movieActions.locandina_film).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // elimina i messaggi relativi al film ed elimina il film dal db
        bot.action(/ELIMINA_FILM: +/, movieActions.elimina_film).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        
    
        /*          PROCEDURA AGGIUNTA FILM         */

        // pannello in cui viene richiesto di interire il titolo del film
        bot.action('PANNELLO_AGGIUNGI_FILM', movieActions.pannello_aggiungi_film).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello che mostra i risultati della ricerca su TMDB
        bot.action('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_FILM', movieActions.pannello_risultati_ricerca_film).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello che richiede l'invio della locandina da parte dell'admin
        bot.action('PANNELLO_CREA_LOCANDINA', movieActions.pannello_crea_locandina).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello mostrato alla ricezione della locandina inviata dall'admin
        bot.on('photo', (ctx) => {
            switch (ctx.session.tipoFoto) {
                case 'CREA_LOCANDINA_FILM':
                    movieActions.pannello_locandina_inviata(ctx);
                    break;
                case 'CREA_LOCANDINA_SERIE':
                    serieActions.pannello_locandina_inviata(ctx);
                    break;
            }
        }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello che mostra la locandina creata da TMDB
        bot.action(/ADMIN_LOCANDINA_TMDB: +/, movieActions.locandina_TMDB).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello in cui viene richiesto l'invio dei file relativi al film da aggiungere
        bot.action('PANNELLO_INVIO_FILES', movieActions.pannello_invio_files).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello che processa il file inviato e chiede se si vogliano inviare altri files
        bot.on('document', (ctx) => {
            switch (ctx.session.tipoDocumento) {
                case 'FILE_FILM': 
                    movieActions.pannello_ricezione_files(ctx);
                    break;
                case 'FILE_SERIE': 
                    serieActions.pannello_ricezione_files(ctx);
                    break;
            }
        }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello mostrato alla fine della procedura di aggiunta
        bot.action('PANNELLO_FINE_AGGIUNTA_FILM', movieActions.pannello_fine_corretta).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello mostrato in caso di fine con errore (errore durante il salvataggio dei file)
        bot.action('PANNELLO_FINE_AGGIUNTA_ERRORE', movieActions.pannello_fine_con_errore).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });


        /*          ADMIN - RICHIESTE - FILM           */

        // quando un admin clicca su risponde ad una richiesta, il parametro è il risultato della risposta
        bot.action('RICHIESTA_ACCETTATA', (ctx) => { movieActions.risposta_richiesta(ctx, 'accettata') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_NON_TROVATO', (ctx) => { movieActions.risposta_richiesta(ctx, 'non_trovato') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_POSTATO', (ctx) => { movieActions.risposta_richiesta(ctx, 'postato') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_MAI_USCITO', (ctx) => { movieActions.risposta_richiesta(ctx, 'mai_uscito') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_APPENA_USCITO', (ctx) => { movieActions.risposta_richiesta(ctx, 'appena_uscito') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_ERRATA', (ctx) => { movieActions.risposta_richiesta(ctx, 'errata') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_PRESA_IN_CARICO', (ctx) => { movieActions.risposta_richiesta(ctx, 'presa_in_carico') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });


    


    /*          ADMIN - SERIE           */

    // pannello principale film
    bot.action('PANNELLO_SERIE_ADMIN', serieActions.pannello_serie_admin).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });  

        /*          BACKUP SERIE         */

        bot.action('BACKUP_SERIE', serieActions.backup_serie_richiesta_canale).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        bot.action('BACKUP_SERIE_PUBBLICO', serieActions.backup_serie_pubblico_richiesta).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });



        /*          ELIMINA SERIE            */

        // pannello in cui viene richiesto di interire il titolo del film da eliminare
        bot.action('PANNELLO_ELIMINA_SERIE', serieActions.pannello_elimina_serie).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        
        // pannello risultati ricerca film per titolo, utilizzato per tornare indietro dalla locandina
        bot.action('PANNELLO_RISULTATI_RICERCA_ELIMINA_SERIE', serieActions.pannello_risultati_ricerca_elimina).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // porta alla pagina precedente dei risultati della ricerca
        bot.action('PREV_PAGE_ELIMINA_SERIE', (ctx) => {
            ctx.session.currentPage -= 1; 
            serieActions.pannello_risultati_ricerca_elimina(ctx);
        }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // porta alla pagina successiva dei risultati della ricerca
        bot.action('NEXT_PAGE_ELIMINA_SERIE', (ctx) => {
            ctx.session.currentPage += 1; 
            serieActions.pannello_risultati_ricerca_elimina(ctx);
        }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello locandina film da eliminare
        bot.action(/DETTAGLI_SERIE_ELIMINAZIONE: +/, serieActions.locandina_serie).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // elimina i messaggi relativi al film ed elimina il film dal db
        bot.action(/ELIMINA_SERIE: +/, serieActions.elimina_serie).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });



        /*          PROCEDURA AGGIUNTA SERIE         */

        // pannello in cui viene richiesto di interire il titolo del film
        bot.action('PANNELLO_AGGIUNGI_SERIE', serieActions.pannello_aggiungi_serie).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello che mostra i risultati della ricerca su TMDB
        bot.action('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_SERIE', serieActions.pannello_risultati_ricerca_serie).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello che richiede l'invio della locandina da parte dell'admin
        bot.action('PANNELLO_CREA_LOCANDINA_SERIE', serieActions.pannello_crea_locandina).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello che mostra la locandina creata da TMDB
        bot.action(/ADMIN_LOCANDINA_TMDB_SERIE: +/, serieActions.locandina_TMDB).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // porta alla pagina precedente dei risultati della ricerca
        bot.action(/ADMIN_LOCANDINA_TMDB_SERIE_STAGIONE: +/, (ctx) => {
            ctx.session.currentSeason = ctx.update.callback_query.data.split(' ')[1];; 
            serieActions.locandina_TMDB(ctx);
        }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello in cui viene richiesto l'invio dei file relativi al film da aggiungere
        bot.action('PANNELLO_INVIO_FILES_SERIE', serieActions.pannello_invio_files).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello mostrato alla fine della procedura di aggiunta
        bot.action('PANNELLO_FINE_AGGIUNTA_SERIE', serieActions.pannello_fine_corretta).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });

        // pannello mostrato in caso di fine con errore (errore durante il salvataggio dei file)
        bot.action('PANNELLO_FINE_AGGIUNTA_ERRORE_SERIE', serieActions.pannello_fine_con_errore).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });



        /*          ADMIN - RICHIESTE - SERIE           */

        // quando un admin clicca su risponde ad una richiesta, il parametro è il risultato della risposta
        bot.action('RICHIESTA_ACCETTATA_SERIE', (ctx) => { serieActions.risposta_richiesta(ctx, 'accettata') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_NON_TROVATO_SERIE', (ctx) => { serieActions.risposta_richiesta(ctx, 'non_trovata') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_POSTATO_SERIE', (ctx) => { serieActions.risposta_richiesta(ctx, 'postata') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_MAI_USCITO_SERIE', (ctx) => { serieActions.risposta_richiesta(ctx, 'mai_uscita') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_IN_CORSO_SERIE', (ctx) => { serieActions.risposta_richiesta(ctx, 'in_corso') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_ERRATA_SERIE', (ctx) => { serieActions.risposta_richiesta(ctx, 'errata') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_SERIE_SKY', (ctx) => { serieActions.risposta_richiesta(ctx, 'sky') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
        bot.action('RICHIESTA_PRESA_IN_CARICO_SERIE', (ctx) => { serieActions.risposta_richiesta(ctx, 'presa_in_carico') }).catch((err, ctx) => {
            console.error(err);
            ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
        });
    



    /*          SUPER ADMIN         */

    // pannello principale super admin
    bot.action('PANNELLO_SUPER_ADMIN', commonActions.pannello_super_admin).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('PANNELLO_AGGIUNGI_ADMIN', commonActions.pannello_aggiungi_admin_richiesta_id).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

    bot.action('PANNELLO_ELIMINA_ADMIN', commonActions.pannello_elimina_admin_richiesta_id).catch((err, ctx) => {
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    });

}