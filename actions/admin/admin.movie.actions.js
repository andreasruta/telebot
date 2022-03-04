require('dotenv').config();
// Canale test, da cambiare per produzione
const { MOVIE_CHANNEL_ID, BACKUP_FILM_1, BACKUP_FILM_2, BACKUP_FILM_3, PUBLIC_CHANNEL_MOVIE } = process.env;
const Buttons = require('../../components/buttons');
const Menu = require("../../components/menu");
const Moviedb = require("../../controllers/moviedb.controller");
const Movie = require("../../controllers/movie.controller");
const Stato_richieste = require('../../controllers/bot.controller');
const User = require('../../controllers/user.controller');
const Admin = require('../../controllers/admin.controller');
const ARRAY_NUMBERS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

exports.pannello_film_admin = async (ctx) => {
    await ctx.reply('🎬 <b>FILM</> 🎬\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'HTML', reply_markup: Menu.pannello_film_admin });
    ctx.session.tipoRicerca = '';
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN FILM");
        console.error(err);
    });
}

/*          BACKUP FILM         */

// richiede all'admin di inserire l'id del canale su cui effettuare il backup
exports.backup_film_richiesta_canale = async (ctx) => {
    await ctx.reply('‼️ *BACKUP FILM* ‼️\n\nScrivi l\'id del canale su cui vuoi effettuare il backup.'
        + '\n\n*IMPORTANTE: aggiungi 100 tra il meno e il primo numero*'
        + '\n\nEsempio:\n\n-1001393725644', { parse_mode: 'Markdown',
        reply_markup:  { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
    ctx.session.tipoRicerca = 'BACKUP_FILM';
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN FILM");
        console.error(err);
    });
}

// effettua il backup su un canale con id inserito dall'admin.
// in caso di riuscita risponde con il numero di messaggi e di film copiati
exports.backup_film = async (ctx) => {
    const destination_channel = ctx.update.message.text;
    ctx.session.tipoRicerca = '';
    const allMovies = await Movie.findAll_backup();
    if (allMovies.message) {
        await ctx.reply(allMovies.message, {reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    } else {
        // tempo stimato = (id ultimo messaggio / 20 messaggi al minuto)/ 60 minuti in un'ora
        let tempo_stimato = allMovies.slice().reverse()[0].id_locandina / 20;
        tempo_stimato = Math.floor(tempo_stimato / 60) + ':' + Math.floor(tempo_stimato % 60 * 60);
        const message_backup_avviato = await ctx.reply('✅ *BACKUP AVVIATO* ✅\n\nTempo stimato: *' 
            + tempo_stimato + '* _Ore_', { parse_mode: 'Markdown' });
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        // contatore_limite_messaggi utilizzato come limitatore, è possibile inviare massimo un messaggio al secondo
        // ed in totale massimo 20 messaggi al minuto.
        let contatore_limite_messaggi = 0;
        let contatoreMessaggi = 0;
        let contatoreFilm = 0;
        let verifica_id_messaggi_mancanti = 2;
        let errore = false;
        // se l'id del messaggio precedente e l'id del messaggio corrente non sono consecutivi
        // riempio il buco con messaggi di riempimento
        for (const currentMovie of allMovies) {
            // copia film da ... in poi
            if (allMovies.indexOf(currentMovie) >= 0) {
                while (currentMovie.id_locandina > verifica_id_messaggi_mancanti) {
                    await ctx.telegram.sendMessage(destination_channel, 'messaggio di riempimento');
                    verifica_id_messaggi_mancanti += 1;
                    contatore_limite_messaggi += 1;
                }
                try {
                    await ctx.telegram.copyMessage( destination_channel, BACKUP_FILM_3, currentMovie.id_locandina );
                } catch (err) {
                    console.error(err);
                    if (err.response.description == 'Bad Request: chat not found') {
                        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
                            errore = true;
                        break
                    }
                    ctx.reply('‼️ <b>ERRORE</> ‼️\n\nFilm <b>"' + currentMovie.titolo + '"</> non trovato e non aggiunto.',
                        {parse_mode: 'HTML'});
                    continue;
                }
                console.log(currentMovie.titolo);
                verifica_id_messaggi_mancanti += 1;
                contatoreMessaggi += 1;
                contatore_limite_messaggi += 1;
                if (contatore_limite_messaggi == 19) {
                    contatore_limite_messaggi = 0;
                    await sleep(40000);
                } else {
                    await sleep(1000);
                }
                for (const currentFile of currentMovie.files_messages_id) {
                    while (currentFile > verifica_id_messaggi_mancanti) {
                        await ctx.telegram.sendMessage(destination_channel, 'messaggio di riempimento');
                        verifica_id_messaggi_mancanti += 1;
                        contatore_limite_messaggi += 1;
                    }
                    try {
                        await ctx.telegram.copyMessage( destination_channel, BACKUP_FILM_3, currentFile );
                    } catch (err) {
                        console.error(err);
                        await ctx.telegram.sendMessage(destination_channel, 'messaggio di riempimento');
                        ctx.reply('‼️ <b>ERRORE</> ‼️\n\nFilm <b>"' + currentMovie.titolo + '"</> con un file mancante.',
                            {parse_mode: 'HTML'});
                        continue;
                    }
                    console.log('ok');
                    verifica_id_messaggi_mancanti += 1;
                    contatoreMessaggi += 1;
                    contatore_limite_messaggi += 1;
                    if (contatore_limite_messaggi == 19) {
                        contatore_limite_messaggi = 0;
                        await sleep(40000);
                    } else {
                        await sleep(1000);
                    }
                }
                contatoreFilm += 1;
            }
        }
        if (!errore) {
            await ctx.reply('✅ *BACKUP EFFETTUATO* ✅\n\nMessaggi copiati: ' + contatoreMessaggi
                + '\nFilm copiati: ' + contatoreFilm,
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        }
        await ctx.deleteMessage(message_backup_avviato.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
    }
}

// effettua il backup, in caso di riuscita risponde con il numero di messaggi e di film copiati
exports.backup_film_inizializzazione = async (ctx) => {
    ctx.session.tipoRicerca = '';
    const allMovies = await Movie.findAll_backup();
    if (allMovies.message) {
        await ctx.reply(allMovies.message, {reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        await ctx.deleteMessage(ctx.update.message.message_id - 1).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
        await ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
    } else {
        // tempo stimato = (id ultimo messaggio / 20 messaggi al minuto)/ 60 minuti in un'ora
        let tempo_stimato = allMovies.slice().reverse()[0].id_locandina / 20;
        tempo_stimato = Math.floor(tempo_stimato / 60) + ':' + Math.floor(tempo_stimato % 60 / 60);
        const message_backup_avviato = await ctx.reply('*BACKUP AVVIATO*\n\nTempo stimato: *' 
            + tempo_stimato + '* _Ore_', { parse_mode: 'Markdown' });
        await ctx.deleteMessage(ctx.update.message.message_id - 1).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
        await ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
        // contatore_limite_messaggi utilizzato come limitatore, è possibile inviare massimo un messaggio al secondo
        // ed in totale massimo 20 messaggi al minuto.
        let contatore_limite_messaggi = 0
        let contatoreMessaggi = 0;
        let contatoreFilm = 0;
        for (const currentMovie of allMovies) {
            // copia film da ... in poi
            if (allMovies.indexOf(currentMovie) >= 0) {
                console.log(currentMovie.titolo);
                let nuovo_id_locandina = '';
                try {
                    nuovo_id_locandina = await ctx.telegram.copyMessage( MOVIE_CHANNEL_ID, -1001397292404, currentMovie.id_locandina );
                } catch (err) {
                    console.error(err);
                    ctx.reply('‼️ <b>ERRORE</> ‼️\n\nFilm <b>"' + currentMovie.titolo + '"</> non trovato e non aggiunto.',
                        {parse_mode: 'HTML'});
                    continue;
                }
                let nuovo_id_locandina_public_channel = await ctx.telegram.copyMessage( PUBLIC_CHANNEL_MOVIE,
                    -1001397292404, currentMovie.id_locandina, {
                        reply_markup: { inline_keyboard: [
                            [ {text: '🍿 Guarda Film 🍿', url: 'https://t.me/provacanal_bot?start=FILM' + currentMovie.id } ]
                        ]}
                    });
                let nuovi_files_id = [];
                await ctx.telegram.copyMessage( BACKUP_FILM_1, -1001397292404, currentMovie.id_locandina );
                await ctx.telegram.copyMessage( BACKUP_FILM_2, -1001397292404, currentMovie.id_locandina );
                await ctx.telegram.copyMessage( BACKUP_FILM_3, -1001397292404, currentMovie.id_locandina );
                contatoreMessaggi += 1;
                contatore_limite_messaggi += 1;
                if (contatore_limite_messaggi == 19) {
                    contatore_limite_messaggi = 0;
                    await sleep(40000);
                } else {
                    await sleep(1000);
                }
                for (const currentFile of currentMovie.files_messages_id) {
                    let nuovo_file_id = '';
                    try {
                        nuovo_file_id = await ctx.telegram.copyMessage( MOVIE_CHANNEL_ID, -1001397292404, currentFile );
                    } catch (err) {
                        console.error(err);
                        ctx.reply('‼️ <b>ERRORE</> ‼️\n\nFilm <b>"' + currentMovie.titolo + '"</> con un file mancante.',
                            {parse_mode: 'HTML'});
                        continue;
                    }
                    nuovi_files_id.push(nuovo_file_id.message_id);
                    await ctx.telegram.copyMessage( BACKUP_FILM_1, -1001397292404, currentFile );
                    await ctx.telegram.copyMessage( BACKUP_FILM_2, -1001397292404, currentFile );
                    await ctx.telegram.copyMessage( BACKUP_FILM_3, -1001397292404, currentFile );
                    console.log('ok');
                    contatoreMessaggi += 1;
                    contatore_limite_messaggi += 1;
                    if (contatore_limite_messaggi == 19) {
                        contatore_limite_messaggi = 0;
                        await sleep(40000);
                    } else {
                        await sleep(1000);
                    }
                }
                /* 
                    quando effettua il backup dal canale principale aggiorna i campi degli id dei messaggi
                    con gli id sul nuovo canale
                */
                if (nuovo_id_locandina && nuovi_files_id) {
                    await Movie.update(currentMovie.id, {id_locandina: nuovo_id_locandina.message_id,
                        id_locandina_public_channel: nuovo_id_locandina_public_channel, files_messages_id: nuovi_files_id});
                }
                contatoreFilm += 1;
            }
        }

        await ctx.reply('Backup effettuato.\nMessaggi copiati: ' + contatoreMessaggi + '\nFilm copiati: ' + contatoreFilm,
            { reply_markup: { inline_keyboard : [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        await ctx.deleteMessage(message_backup_avviato.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
            console.error(err);
        });
    }
}

/*          BACKUP CANALE PUBBLICO          */

// richiede all'admin di inserire l'id del canale su cui effettuare il backup del canale pubblico
exports.backup_film_pubblico_richiesta = async (ctx) => {
    await ctx.reply('‼️ *BACKUP FILM PUBBLICO* ‼️\n\nScrivi l\'id del canale su cui vuoi effettuare il backup delle locandine.'
        + '\n\n*IMPORTANTE: aggiungi 100 tra il meno e il primo numero*'
        + '\n\nEsempio:\n\n-1001393725644', { parse_mode: 'Markdown',
        reply_markup:  { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
    ctx.session.tipoRicerca = 'BACKUP_FILM_PUBBLICO';
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
}

// effettua il backup delle locandine su un canale con id inserito dall'admin.
// in caso di riuscita risponde con il numero di messaggi e di film copiati
exports.backup_film_pubblico = async (ctx) => {
    const destination_channel = ctx.update.message.text;
    ctx.session.tipoRicerca = '';
    const allMovies = await Movie.findAll_backup();
    if (allMovies.message) {
        await ctx.reply(allMovies.message, {reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    } else {
        // tempo stimato = (id ultimo messaggio / 20 messaggi al minuto)/ 60 minuti in un'ora
        let tempo_stimato = allMovies.length / 20;
        tempo_stimato = Math.floor(tempo_stimato / 60) + ':' + Math.floor(tempo_stimato % 60 * 60);
        const message_backup_avviato = await ctx.reply('✅ *BACKUP AVVIATO* ✅\n\nTempo stimato: *' 
            + tempo_stimato + '* _Ore_', { parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]} });
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        // contatore_limite_messaggi utilizzato come limitatore, è possibile inviare massimo un messaggio al secondo
        // ed in totale massimo 20 messaggi al minuto.
        let contatore_limite_messaggi = 0;
        let errore = false;
        for (const currentMovie of allMovies) {
            // invia locandina sul canale pubblico
            try {
                await ctx.telegram.copyMessage(destination_channel, BACKUP_FILM_3, currentMovie.id_locandina,
                    {
                        parse_mode: 'HTML',
                        reply_markup: { 
                            inline_keyboard: [
                                [ {text: '🍿 Guarda Film 🍿', url: 'https://t.me/SerietvFilms_Bot?start=FILM' + currentMovie.id } ]
                            ]
                        }
                    });
            } catch (err) {
                console.error(err);
                if (err.response.description == 'Bad Request: chat not found') {
                    ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
			            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
                        errore = true;
                    break
                }
                ctx.reply('‼️ <b>ERRORE</> ‼️\n\nLocandina film <b>"' + currentMovie.titolo + '"</> non trovata.',
                    { parse_mode: 'HTML' });
                    continue;
            }
            contatore_limite_messaggi += 1;
            if (contatore_limite_messaggi == 19) {
                contatore_limite_messaggi = 0;
                await sleep(40000);
            } else {
                await sleep(1000);
            }
        }
        if (!errore) {
            await ctx.reply('✅ BACKUP LOCANDINE EFFETTUATO ✅',
                { reply_markup: { inline_keyboard : [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        }
        await ctx.deleteMessage(message_backup_avviato.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
    }
}

/*          ELIMINAZIONE FILM           */

exports.pannello_elimina_film = async (ctx) => {
    ctx.session.title = '';
    ctx.session.tipoRicerca = 'ADMIN_FILM_ELIMINA'
    await ctx.reply('❌ *ELIMINA FILM* ❌\n\nScrivi il titolo o parte del titolo del film da *ELIMINARE*:', 
        { parse_mode:'Markdown', reply_markup: Menu.pannello_aggiungi_film });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
}

// risultati ricerca film per titolo
exports.pannello_risultati_ricerca_elimina = async (ctx) => {
    if (!ctx.session.title) {
        ctx.session.title = ctx.update.message.text;
        ctx.session.currentPage = 0;
    }

    const title = ctx.session.title;
    const page = ctx.session.currentPage;

    // trova tutti i film contenenti il titolo cercato
    Movie.findAll('TITOLO', title, page).then(async (data) => {

        const movies = data.movies;

        let responseText = '';
        let arrayButtons = [];
        
        if (movies.length > 0) {
            
            ({ responseText, arrayButtons } = creaTesto_Bottoni(movies));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_ELIMINA'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_ELIMINA'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }
        } else {
            responseText = 'Il titolo inserito non corrisponde a nessun film presente.';
        }
        arrayButtons.push([ Buttons.indietro('PANNELLO_ELIMINA_FILM') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        ctx.replyWithHTML( responseText, {
            parse_mode: 'HTML', 
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        if (ctx.update.message) {
            const id_messaggio = ctx.update.message.message_id - 1;
            try {
                await ctx.deleteMessage(id_messaggio).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
            try {
                ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        } else if (ctx.update.callback_query) {
            await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE ADMIN FILM");
                console.error(err);
            });
        }
    })
}

// locandina film scelto, uguale per tutti i tipi di ricerca
exports.locandina_film = async (ctx) => {
    const movieId = ctx.update.callback_query.data.split(' ')[1];

    Movie.findOne(movieId).then(async (movie) => {
        const movie_TMDB = movie.TMDB_id ? await Moviedb.searchMovieById(movie.TMDB_id) : '';
        if (movie_TMDB && movie_TMDB.poster_path) {
            const image_url = 'https://image.tmdb.org/t/p/w500' + movie_TMDB.poster_path;
            await ctx.replyWithPhoto( { url: image_url },
                { caption: creaCaption(movie_TMDB), parse_mode: 'HTML',
                    reply_markup: Menu.pannello_dettagli_film_elimina(movieId) }
            )
        } else {
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, MOVIE_CHANNEL_ID, movie.id_locandina,
                { reply_markup: Menu.pannello_dettagli_film_elimina(movieId) }
            );
        }
        // elimina messaggio precedente
        await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE ADMIN FILM");
            console.error(err);
        });
    });
}

exports.elimina_film = async (ctx) => {
    const movieId = ctx.update.callback_query.data.split(' ')[1];

    // rimuove il film dal db ed elimina tutti i messaggi relativi.
    Movie.delete(movieId).then(async (result) => {
        // elimina locandina da canale pubblico
        try {
            await ctx.telegram.deleteMessage(PUBLIC_CHANNEL_MOVIE, result.id_locandina_public);
            ctx.answerCbQuery('✅ ELIMINATO ✅\n\nIl film è stato cancellato correttamente.', {show_alert: true});
        } catch (err) {
            console.error(err);
            ctx.answerCbQuery('⚠️ ELIMINATO ⚠️\n\nIl film è stato cancellato.\n'
                + 'La locandina è stata inviata più di 48 ore fa, quindi deve essere cancellata manualmente dal canale.', {show_alert: true});
        }
    }).catch(async (err) => {
        console.error(err);
        ctx.answerCbQuery('❌ ERRORE ❌\n\nSi è verificato un errore durante l\'eliminazione del film.\nRIPROVARE.', {show_alert: true});
    });
    const stato_richieste = await Stato_richieste.requests_state();
    await ctx.reply('🎬 <b>FILM</> 🎬\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'HTML', reply_markup: await Menu.pannello_admin(stato_richieste, ctx.from.id) });
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
    ctx.session.tipoRicerca = '';
    
}


/*          PROCEDURA AGGIUNTA FILM         */

// session object (step set, step unset): tipoRicerca = 'ADMIN_FILM_AGGIUNGI'; 
//      title; movie; id_locandina (solo per locandina creata da admin);
//      tipoFoto (solo per locandina creata da admin); tipoDocumento (per invio files)

// --> pannello_admin || pannello_risultati_ricerca_film
exports.pannello_aggiungi_film = async (ctx) => {
    ctx.session.title = '';
    ctx.session.tipoRicerca = 'ADMIN_FILM_AGGIUNGI'
    await ctx.reply('➕ *AGGIUNGI FILM* ➕\n\nScrivi il titolo o parte del titolo del film da *AGGIUNGERE*:',
        { parse_mode:'Markdown', reply_markup: Menu.pannello_aggiungi_film });
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
}

// --> pannello_aggiungi_film || pannello_crea_locandina || pannello_locandina_inviata || locandina_TMDB || pannello_invio_files (caso errore)
exports.pannello_risultati_ricerca_film = async (ctx) => {
    try {
        // se !ctx.session.title significa che si è arrivati qui da pannelli successivi
        if (!ctx.session.title) {
            ctx.session.title = ctx.update.message.text;
        }
        // pulisco oggetti sessione
        ctx.session.movie = '';
        ctx.session.tipoRicerca = '';
        ctx.session.id_locandina = '';
        ctx.session.tipoDocumento = '';
        ctx.session.tipoFoto = '';

        Moviedb.searchMovieByTitle(ctx.session.title).then( async (movies) => {
            
            let responseText = '';
            let arrayButtons = [];
            
            if (movies.length > 0) {
                responseText = 'Clicca sul bottone corrispondente al film corretto:\n\n';
                let buttons = [];
                let contatore = 1;
                // crea il testo del messaggio e i bottoni
                movies.forEach((currentMovie) => {
                    responseText += contatore + ' - ' + currentMovie.title;
                    responseText += currentMovie.release_date ? '  ('
                            + currentMovie.release_date.substring(0, 4) + ')' + '\n' : '\n';
                    buttons.push({
                        text: contatore,
                        callback_data: 'ADMIN_LOCANDINA_TMDB: ' + currentMovie.id
                    })
                    contatore += 1
                })

                responseText += '\n\n<i>Se il film non è presente, crea manualmente la locandina.</>'
                
                // divide l'array buttons in più array di grandezza pari al secondo argomento
                arrayButtons = Array.from({ length: Math.ceil(buttons.length / 4) }, (v, i) =>
                        buttons.slice(i * 4, i * 4 + 4));
            } else {
                responseText = 'Il film cercato non è presente, creare manualmente la locandina:';
            }
            arrayButtons.push([ Buttons.crea_locandina ]);
            arrayButtons.push([ Buttons.indietro('PANNELLO_AGGIUNGI_FILM') ]);

            await ctx.replyWithHTML( responseText, { 
                reply_markup: { inline_keyboard: arrayButtons } 
            });
            // elimina messaggio precedente
            if (ctx.update.message) {
                const id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else if (ctx.update.callback_query) {
                await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE ADMIN FILM");
                    console.error(err);
                });
            }
        });
    } catch (err) {
        console.log("ERRORE ADMIN RICERCA FILM");
        console.error(err);
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}}).catch((err) => {
            console.log("ERRORE REPLY ERRORE ADMIN ROUTES");
            console.error(err);
        });
    }
}

// richiede l'invio della locandina
exports.pannello_crea_locandina = async (ctx) => {
    await ctx.reply('Invia la locandina (immagine + testo) relativa al film, nel formato:\n\n'
        + 'titolo\n\n📆Anno: ...\n📚Genere: #... #...\n⭐️Voto: .../10\n\n🖋Trama: ...',
        { reply_markup: { inline_keyboard: [[Buttons.indietro('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_FILM')]]}});
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
    ctx.session.tipoFoto = 'CREA_LOCANDINA_FILM';
}

// risponde alla ricezione della locandina. salva message_id locandina ed estrae le informazioni del film
exports.pannello_locandina_inviata = async (ctx) => {
    ctx.session.id_locandina = ctx.update.message.message_id;
    try {
        const caption = ctx.update.message.caption.split('\n');

        if (isNaN(caption[2].split(': ')[1])) {
            const id_messaggio = ctx.update.message.message_id - 1;
            try {
                await ctx.deleteMessage(id_messaggio).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
            try {
                ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
            await ctx.replyWithHTML('❌ <b>ERRORE</> ❌\n\nLocandina non conforme, inviala nuovamente corretta.',
                {reply_markup: { inline_keyboard: [[{ text: '❌ Annulla ❌', callback_data: 'PANNELLO_ADMIN' }]]}});
        } else {
            const generi = caption[3].split(':')[1].split(' #');
            let generi_upper = []
            generi.splice(0, 1);
            await generi.forEach(current => {
                current = current.charAt(0).toUpperCase() + current.slice(1);
                generi_upper.push(current);
            });
            ctx.session.movie = {
                title: caption[0],
                release_date: caption[2].split(': ')[1],
                genres: generi_upper,
                vote_average: caption[4].split(': ')[1].split('/')[0]
            };
            ctx.session.tipoDocumento = 'FILE_FILM';
            ctx.session.locandina_TMDB = false;
            ctx.session.tipoFoto = '';
            await ctx.reply('La locandina inviata è corretta?\n\n_se non è corretta modificala e premi_  '
                + '*"Conferma locandina"*  _oppure torna indietro_', { parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "✅ Conferma locandina ✅", callback_data: 'PANNELLO_INVIO_FILES' }],
                        [ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_FILM') ]
                    ]
                }
            });
            try {
                await ctx.deleteMessage(ctx.update.message.message_id - 1).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    } catch {
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN MOVIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        await ctx.replyWithHTML('❌ <b>ERRORE</> ❌\n\nLocandina non conforme, inviala nuovamente.',
            {reply_markup: { inline_keyboard: [[{ text: '❌ Annulla ❌', callback_data: 'PANNELLO_ADMIN' }]]}});
    }
    
}

// mostra locandina creata con info di TMDB
exports.locandina_TMDB = async (ctx) => {
    
    // se il film è salvato nella sessione, non rifaccio la ricerca
    if (!ctx.session.movie) {
        const movieId = ctx.update.callback_query.data.split(' ')[1];
        const movie = await Moviedb.searchMovieById(movieId);
        ctx.session.movie = movie;
    }
    const keyboard = {
        inline_keyboard: [
            [{ text: "✅ Conferma locandina ✅", callback_data: 'PANNELLO_INVIO_FILES' }],
            [ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_FILM') ]
        ]
    };
    // se esiste un'immagine in TMDB invia locandina con immagine, altrimenti invia locandina senza immagine
    if (ctx.session.movie.poster_path) {
        const image_url = 'https://image.tmdb.org/t/p/w500' + ctx.session.movie.poster_path;
        await ctx.replyWithPhoto( { url: image_url },
            { caption: creaCaption(ctx.session.movie),
                parse_mode: 'HTML', reply_markup: keyboard });
    } else {
        await ctx.reply(creaCaption(ctx.session.movie),
            { parse_mode: 'HTML', reply_markup: keyboard });
    }
    // elimina messaggio precedente
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
    ctx.session.tipoDocumento = 'FILE_FILM';
    ctx.session.locandina_TMDB = true;
}

// salva il film nel db e in caso di riuscita richiede l'invio dei files relativi
// in caso di errore rimanda alla locandina
exports.pannello_invio_files = async (ctx) => {
    
    let movie = ctx.session.movie;
    let message = '';

    try {

        // se non ho la locandina di TMDB...
        if (ctx.session.id_locandina) {
            // inoltra sul canale la locandina inviata dall'admin
            message = await ctx.telegram.copyMessage(MOVIE_CHANNEL_ID, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.telegram.copyMessage(BACKUP_FILM_1, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.telegram.copyMessage(BACKUP_FILM_2, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.telegram.copyMessage(BACKUP_FILM_3, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN FILM");
                console.error(err);
            });
        } else {
            if (movie.poster_path) {
                const image_url = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
            
                message = await ctx.telegram.sendPhoto(MOVIE_CHANNEL_ID, { url: image_url },
                    { caption: creaCaption(movie), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_FILM_1, { url: image_url },
                    { caption: creaCaption(movie), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_FILM_2, { url: image_url },
                    { caption: creaCaption(movie), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_FILM_3, { url: image_url },
                    { caption: creaCaption(movie), parse_mode: 'HTML'});
            } else {
                message = await ctx.telegram.sendMessage(MOVIE_CHANNEL_ID, creaCaption(movie), { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(BACKUP_FILM_1, creaCaption(movie), { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(BACKUP_FILM_2, creaCaption(movie), { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(BACKUP_FILM_3, creaCaption(movie), { parse_mode: 'HTML' });
            }
        }

        // salva id della locandina nel canale principale per inoltrarla poi nel canale pubblico a fine procedura
        ctx.session.id_locandina_canale = message.message_id;
        ctx.session.files_messages_id = [];
        ctx.reply('Invia i files relativi al film...\n\n_quando hai finito premi "Fine"_', {
            parse_mode: 'Markdown', 
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✅ FINE ✅", callback_data: 'PANNELLO_FINE_AGGIUNTA_FILM' }],
                    [{ text: "❌ ANNULLA ❌", callback_data: 'PANNELLO_FINE_AGGIUNTA_ERRORE' }]
                ]
            } 
        });
    } catch (err) {
        console.error(err);
        // in caso di errore cancella il messaggio contenente la locandina dal canale
        ctx.telegram.deleteMessage(MOVIE_CHANNEL_ID, message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
        ctx.telegram.deleteMessage(BACKUP_FILM_1, message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
        ctx.telegram.deleteMessage(BACKUP_FILM_2, message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
        ctx.telegram.deleteMessage(BACKUP_FILM_3, message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });

        ctx.reply('❌ ERRORE ❌\n\nSi è verificato un errore, riprovare', { 
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Riprova", callback_data: 'PANNELLO_RISULTATI_RICERCA_AGGIUNGI_FILM' }]
                ]
            } 
        });
    }
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
}

exports.pannello_ricezione_files = async (ctx) => {
    ctx.session.files_messages_id.push(ctx.update.message.message_id);
}

// in caso di fine con errore cancella il film dal db e i messaggi relativi nel canale
exports.pannello_fine_con_errore = async (ctx) => {
    ctx.telegram.deleteMessage(MOVIE_CHANNEL_ID, ctx.session.id_locandina_canale).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN FILM");
        console.error(err);
    });
    ctx.telegram.deleteMessage(BACKUP_FILM_1, ctx.session.id_locandina_canale).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN FILM");
        console.error(err);
    });
    ctx.telegram.deleteMessage(BACKUP_FILM_2, ctx.session.id_locandina_canale).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN FILM");
        console.error(err);
    });
    ctx.telegram.deleteMessage(BACKUP_FILM_3, ctx.session.id_locandina_canale).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN FILM");
        console.error(err);
    });
    if (ctx.session.files_messages_id) {
        ctx.session.files_messages_id.forEach((currentFile) => {
            ctx.deleteMessage(currentFile).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN FILM");
                console.error(err);
            });
        })
    }
    const stato_richieste = await Stato_richieste.requests_state();
    await ctx.reply('🕵️‍♂️ *ADMIN MODE* 🕵️‍♂️\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'Markdown', reply_markup: await Menu.pannello_admin(stato_richieste, ctx.from.id) });
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
    azzeraSession();
}

// inoltra la locandina nel canale pubblico
exports.pannello_fine_corretta = async (ctx) => {
    ctx.answerCbQuery('⚠️ ATTENDI ⚠️\n\nAspetta che spariscano dalla chat tutti i file che hai inviato.', {show_alert: true});

    let backup_channels = [BACKUP_FILM_1, BACKUP_FILM_2, BACKUP_FILM_3];
    let contatore_limite_messaggi = 0;
    let messages_id_channel = [];
    for (const currentFile of ctx.session.files_messages_id) {
        const message = await ctx.telegram.copyMessage(MOVIE_CHANNEL_ID,
            ctx.update.callback_query.message.chat.id,
            currentFile);
        messages_id_channel.push(message.message_id);
        for (const currentChannel of backup_channels) {
            await ctx.telegram.copyMessage(currentChannel,
                ctx.update.callback_query.message.chat.id,
                currentFile);
        }
        contatore_limite_messaggi += 1;
        if (contatore_limite_messaggi == 19) {
            contatore_limite_messaggi = 0;
            await sleep(40000);
        }
        ctx.deleteMessage(currentFile).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN FILM");
            console.error(err);
        });
    }

    // salva i dati del film e il message_id della locandina inviata nel canale dei film
    const movie = await Movie.create(ctx.session.movie, ctx.session.id_locandina_canale,
        messages_id_channel, ctx.session.locandina_TMDB);

    // invia locandina sul canale pubblico
    const id_canale_pubblico = await ctx.telegram.copyMessage(PUBLIC_CHANNEL_MOVIE, MOVIE_CHANNEL_ID, ctx.session.id_locandina_canale,
        { 
            parse_mode: 'HTML',
            reply_markup: { 
                inline_keyboard: [
                    [ {text: '🍿 Guarda Film 🍿', url: 'https://t.me/SerietvFilms_Bot?start=FILM' + movie.id } ]
                ]
            }
        });
    
    Movie.update(movie.id, {id_locandina_public: id_canale_pubblico.message_id});

    const stato_richieste = await Stato_richieste.requests_state();
    await ctx.reply('🕵️‍♂️ *ADMIN MODE* 🕵️‍♂️\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'Markdown', reply_markup: await Menu.pannello_admin(stato_richieste, ctx.from.id) });
    azzeraSession(ctx);
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE ADMIN FILM");
        console.error(err);
    });
}


/*          RICHIESTE           */

// admin accetta la richiesta e viene inviato un messaggio all'utente che l'ha effettuata
exports.risposta_richiesta = async (ctx, risposta) => {
    try {
        let response_message = '';
        let request_result = '';
        let message = '';
        let sub_ita = false;

        if (ctx.update.callback_query.message.text) {
            message = ctx.update.callback_query.message.text.split('\n');
            if (message[2] == 'Film [SUB-ITA]:') {
                sub_ita = true;
            }
        } else {
            message = ctx.update.callback_query.message.caption.split('\n');
        }
        const user_chat_id = message[0].split('[')[1].split(']')[0];
        const titolo = message[3];

        const user = await User.findOne(user_chat_id);
        user.ammonizioni = user.ammonizioni ? user.ammonizioni : 0;
        const user_username = user.username ? '@' + user.username : '';
        switch (risposta) {
            case 'accettata': response_message = `✅ La tua richiesta è stata <b>ACCETTATA</>.\n\nIl Film <b>'${titolo}'</>`
                + ` è ora disponibile tramite il nostro bot.`
                request_result = '✅ Risposta <b>\'ACCETTATA\'</> da: ';
                break;
            case 'non_trovato': response_message = `❌ La tua richiesta per il film <b>'${titolo}'</> è stata <b>RIFIUTATA</>.\n`
                + `Non siamo riusciti a trovare il film.`;
                request_result = '❌ Risposta <b>\'FILM NON TROVATO\'</> da: ';
                break;
            case 'postato': 
                if (user.ammonizioni == 2) {
                    user.ammonizioni += 1;
                    response_message = `❌ Abbiamo già postato il film: <b>'${titolo}'</>\n\n`
                        + '‼️<b>AMMONITO</>‼️\n\nQuesta è la tua terza ammonizione, d\'ora in poi non potrai più fare richieste per un mese.';
                } else {
                    user.ammonizioni += 1;
                    response_message = `❌ Abbiamo già postato il film: <b>'${titolo}'</>\n\n`
                        + '‼️<b>AMMONITO</>‼️\nControlla se il film è presente sul canale prima di richiederlo.\n\n' 
                        + '<i>Alla terza ammonizione ti verrà revocata per un mese la possibilità di fare richieste.</>\n\n'
                        + `<i>Ammonizioni attuali: ${user.ammonizioni}/3</>`;
                }
                request_result = '❌ Risposta <b>\'GIÀ POSTATO\'</> da: ';
                User.update(user_chat_id, { ammonizioni: user.ammonizioni });
                break;
            case 'mai_uscito':
                if (user.ammonizioni == 2) {
                    user.ammonizioni += 1;
                    response_message = `❌ La tua richiesta per il film <b>'${titolo}'</> è stata <b>RIFIUTATA</>.`
                        + ` Il film non è mai uscito in italia.\n\n`
                        + '‼️<b>AMMONITO</>‼️\n\nQuesta è la tua terza ammonizione, d\'ora in poi non potrai più fare richieste per un mese.';
                } else {
                    user.ammonizioni += 1;
                    response_message = `❌ La tua richiesta per il film <b>'${titolo}'</> è stata <b>RIFIUTATA</>.`
                    + ` Il film non è mai uscito in italia.\n\n`
                    + '‼️<b>AMMONITO</>‼️\nSul nostro canale è vietato richiedere film mai usciti in Italia.\n'
                    + 'Se ti interessa il film SUB-ITA usa l\'apposito bottone nel menù delle richieste.\n\n'
                    + '<i>Alla terza ammonizione ti verrà revocata per un mese la possibilità di fare richieste.</>\n\n'
                    + `<i>Ammonizioni attuali: ${user.ammonizioni}/3</>`;
                }
                request_result = '❌ Risposta <b>\'MAI USCITO\'</> da: ';
                User.update(user_chat_id, { ammonizioni: user.ammonizioni });
                break;
            case 'appena_uscito':
                if (user.ammonizioni == 2) {
                    user.ammonizioni += 1;
                    response_message = `❌ La tua richiesta per il film <b>'${titolo}'</> è stata <b>RIFIUTATA</>.`
                        + ` Il film è appena uscito in italia.\n\n`
                        + '‼️<b>AMMONITO</>‼️\n\nQuesta è la tua terza ammonizione, d\'ora in poi non potrai più fare richieste per un mese.';
                } else {
                    user.ammonizioni += 1;
                    response_message = `❌ La tua richiesta per il film <b>'${titolo}'</> è stata <b>RIFIUTATA</>.`
                    + ` Il film è appena uscito in italia.\n\n`
                    + '‼️<b>AMMONITO</>‼️\nSul nostro canale è vietato richiedere film usciti da meno di 2 mesi in Italia.\n\n'
                    + '<i>Alla terza ammonizione ti verrà revocata per un mese la possibilità di fare richieste.</>\n\n'
                    + `<i>Ammonizioni attuali: ${user.ammonizioni}/3</>`;
                }
                request_result = '❌ Risposta <b>\'APPENA USCITO\'</> da: ';
                User.update(user_chat_id, { ammonizioni: user.ammonizioni });
                break;
            case 'errata': response_message = `❌ La tua richiesta per il film <b>'${titolo}'</> è stata <b>RIFIUTATA</>.\n`
                + `La richiesta è stata effettuata in modo errato. Leggi bene le regole riguardanti le richieste.`;
                request_result = '❌ Risposta <b>\'RICHIESTA ERRATA\'</> da: ';
                break;
        }

        // in caso di pressione sul bottone 'presa in carico' viene modificato quel pulsante inserendoci l'username dell'admin
        if (risposta == 'presa_in_carico') {
            try {
                ctx.editMessageReplyMarkup(sub_ita ? Menu.pannello_richiesta_presa_in_carico_sub_ita(ctx.from.username)
                    : Menu.pannello_richiesta_presa_in_carico(ctx.from.username));
            } catch (err) {
                console.error(err);
            }
        } else {
            ctx.telegram.sendMessage(user_chat_id, response_message, { parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [[ {text: '✅ OK ✅', callback_data: 'RISPOSTA_RICHIESTA_RICEVUTA'} ]]} }).catch((err) => {
                    console.log("ERRORE ADMIN SENDMESSAGE RISPOSTA RICHIESTA FILM");
                    console.error(err);
                });
            ctx.reply(request_result + ( ctx.from.username ? '@' + ctx.from.username : ctx.from.first_name )
                + '\n\n' + 'Richiesta da: ' + user_username + ' [' + user_chat_id + ']\n\n' + 
                (sub_ita ? 'Film [SUB-ITA]:\n' : 'Film:\n') + titolo, {parse_mode: 'HTML'});
            try {
                ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE RISPOSTA RICHIESTA ADMIN FILM");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
                ctx.answerCbQuery('Richiesta ricevuta da più di 48 ore. Cancella manualmente il messaggio.', {show_alert: true}).catch((err) => {
                    console.log("ERRORE ANSWER CB QUERY ADMIN RICHIESTA FILM");
                    console.error(err);
                });
            }
        }
    } catch (err) {
        console.log("ERRORE RISPOSTA RICHIESTA FILM");
        console.error(err);
    }
}




/*          FUNZIONI AUSILIARIE         */

// crea testo per i risultati ricerca film
const creaTesto_Bottoni = (movies) => {
    let responseText = '🔎 Clicca sul bottone corrispondente al film che vuoi <b>ELIMINARE</>:\n\n';
    let buttons = [];
    let contatore = 0;
    // crea il testo del messaggio e i bottoni
    movies.forEach((currentMovie) => {
        let genere = '';
        currentMovie.genere.forEach((currentGenere) => {
            genere += ' #' + currentGenere;
        });
        responseText += ARRAY_NUMBERS[contatore] + ' - <b>' + currentMovie.titolo + ' (' + currentMovie.anno
            + ')</>\n' + '📚' + genere + '\n⭐️ <b>' + currentMovie.voto + '/10</>\n\n';
        buttons.push({
            text: ARRAY_NUMBERS[contatore],
            callback_data: 'DETTAGLI_FILM_ELIMINAZIONE: ' + currentMovie.id
        })
        contatore += 1
    })
    
    // divide l'array buttons in più array di grandezza pari al secondo argomento
    let arrayButtons = Array.from({ length: Math.ceil(buttons.length / 5) }, (v, i) =>
            buttons.slice(i * 5, i * 5 + 5));

    return({
        responseText: responseText,
        arrayButtons: arrayButtons
    })
}

// funzione per creare la descrizione della locandina
const creaCaption = (movie) => {
    let Genere = '';
    if (movie.genres.length > 0) {
        Genere = '📚Genere:';
        movie.genres.forEach(currentGenere => {
            Genere = Genere + ' #' + currentGenere.name
        });
        Genere = Genere + '\n'
    }
    const Titolo = '\n<b>' + movie.title + '</>\n\n';
    const Regista = movie.director? '🎬Regista: ' + movie.director + '\n' : '';
    const Anno = movie.release_date? '📆Anno: ' + movie.release_date.substring(0, 4) + '\n' : '';
    const Durata = movie.runtime? '⏳Durata: ' + Math.floor(movie.runtime/60) + 'h ' + movie.runtime%60 + 'm\n' : '';
    const Voto = movie.vote_average? '⭐️Voto: ' + movie.vote_average + '/10\n' : '';
    const Trama = '\n🖋Trama e info: ' + '<a href="https://www.themoviedb.org/movie/' + 
                movie.id + '?language=it-IT">[CLICCA QUI]</>' + '\n';
    const Trailer = movie.trailer? '🎞Trailer: ' + movie.trailer : '';

    return `${Titolo}${Regista}${Anno}${Durata}${Genere}${Voto}${Trama}${Trailer}`;
}

// usata per evitare il blocco per il superamento dei 20 messaggi inviati in un minuto
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

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