require('dotenv').config();
const REQUEST_CHANNEL_MOVIE = process.env.REQUEST_CHANNEL_MOVIE; // Canale test, da cambiare per produzione
const MOVIE_CHANNEL_ID = process.env.MOVIE_CHANNEL_ID; // Canale test, da cambiare per produzione
const Menu = require("../../components/menu");
const Movie = require("../../controllers/movie.controller");
const Serie = require("../../controllers/serie.controller");
const Moviedb = require("../../controllers/moviedb.controller");
const Stato_richieste = require('../../controllers/bot.controller');
const User = require('../../controllers/user.controller');
const Admin = require('../../controllers/admin.controller');
const Bot = require('../../controllers/bot.controller');
const Buttons = require('../../components/buttons');
const ARRAY_NUMBERS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];


// pannello menu principale film
exports.pannello_film = async (ctx) => {
    ctx.reply('🎬 <b>FILM</> 🎬\n\nChe tipo di ricerca vuioi effettuare?',
        { parse_mode: 'HTML', reply_markup: Menu.pannello_film });
    try {
        await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    azzeraSession(ctx);
}


/*          RICERCA PER TITOLO          */

// pannello ricerca film per titolo
exports.pannello_ricerca_film_titolo = async (ctx) => {
    ctx.session.tipoRicerca = 'UTENTE_FILM_TITOLO';
    ctx.session.title = '';
    await ctx.reply('🔎 <b>TITOLO</> 🔎\n\nScrivi il titolo completo o parte del titolo del film da cercare:',
        { parse_mode: 'HTML', reply_markup: Menu.pannello_ricerca_film_titolo });
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
}

// risultati ricerca film per titolo
exports.pannello_risultati_ricerca_titolo = async (ctx) => {
    try {
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
                
                ({ responseText, arrayButtons } = creaTesto_Bottoni(movies, 'TITOLO'));

                // bottoni per la paginazione
                let paginationButtons = [];

                if (data.hasPrevPage) {
                    paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_TITOLO'});
                }
                if (data.hasNextPage) {
                    paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_TITOLO'});
                }
                if (paginationButtons.length > 0){
                    arrayButtons.push(paginationButtons);
                }

                responseText += '\n<i>il film non è presente? effettua una richiesta al nostro staff</>';
            } else {
                responseText = 'Ci dispiace, purtroppo il film cercato non è presente.\n\n' + 
                    'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
            }
            arrayButtons.push([ Buttons.pannello_richieste_film ]);
            arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_FILM_TITOLO') ]);
            arrayButtons.push([ Buttons.pannello_HOME ]);

            if (ctx.update.message) {
                const id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else if (ctx.update.callback_query) {
                try {
                    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            }

            ctx.replyWithHTML( responseText, {
                parse_mode: 'HTML', 
                reply_markup: { inline_keyboard: arrayButtons } 
            });
        });
    } catch (err) {
        console.log("ERRORE TEXT RISULTATI RICERCA TITOLO FILM");
        console.error(err);
        return;
    }
}


/*          RICERCA PER GENERE          */

exports.pannello_ricerca_film_genere = async (ctx) => {
    let generi = await Movie.getGenres();
    generi.sort();
    let buttons = [];
    // crea il testo del messaggio e i bottoni
    generi.forEach((currentGenere) => {
        buttons.push({
            text: currentGenere,
            callback_data: 'RISULTATI_FILM_GENERE: ' + currentGenere
        });
    })
    let arrayButtons = Array.from({ length: Math.ceil(buttons.length / 3) }, (v, i) =>
                    buttons.slice(i * 3, i * 3 + 3));
    arrayButtons.push([ Buttons.indietro('PANNELLO_FILM') ]);
    arrayButtons.push([ Buttons.pannello_HOME ]);
    ctx.reply('📚 <b>GENERE</> 📚\n\nScegli il genere che preferisci:',
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: arrayButtons }});
    try {
        await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.genere = '';
}

exports.pannello_risultati_film_genere = async (ctx) => {
    if (!ctx.session.genere) {
        ctx.session.genere = ctx.update.callback_query.data.split(' ')[1];
        ctx.session.currentPage = 0;
    }

    const genere = ctx.session.genere;
    const page = ctx.session.currentPage;

    // trova tutti i film contenenti il titolo cercato
    Movie.findAll('GENERE', genere, page).then(async (data) => {

        const movies = data.movies;
        let responseText = '';
        let arrayButtons = [];
        
        if (movies.length > 0) {

            ({ responseText, arrayButtons } = creaTesto_Bottoni(movies, 'GENERE'));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_GENERE'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_GENERE'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }

            responseText += '\n<i>il film non è presente? effettua una richiesta al nostro staff</>';
        } else {
            responseText = 'Ci dispiace, purtroppo il film cercato non è presente.\n\n' + 
                'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
        }
        arrayButtons.push([ Buttons.pannello_richieste_film ]);
        arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_FILM_GENERE') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        await ctx.replyWithHTML( responseText, {
            parse_mode: 'HTML', 
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    })
}


/*          RICERCA PER LETTERA         */

exports.pannello_ricerca_film_lettera = async (ctx) => {
    const alfabeto = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let buttons = [];
    alfabeto.forEach((currentLetter) => {
        buttons.push({
            text: currentLetter,
            callback_data: 'RISULTATI_FILM_LETTERA: ' + currentLetter
        })
    })
    let arrayButtons = Array.from({ length: Math.ceil(buttons.length / 4) }, (v, i) =>
                    buttons.slice(i * 4, i * 4 + 4));
    arrayButtons.push([ Buttons.indietro('PANNELLO_FILM') ]);
    arrayButtons.push([ Buttons.pannello_HOME ]);
    await ctx.reply('🔠 <b>A - Z</> 🔠\n\nScegli la lettera che preferisci:',
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: arrayButtons }});
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.lettera = '';
}

exports.pannello_risultati_film_lettera = async (ctx) => {
    if (!ctx.session.lettera) {
        ctx.session.lettera = ctx.update.callback_query.data.split(' ')[1];
        ctx.session.currentPage = 0;
    }

    const lettera = ctx.session.lettera;
    const page = ctx.session.currentPage;

    // trova tutti i film che iniziano per la lettera scelta
    Movie.findAll('LETTERA', lettera, page).then(async (data) => {

        const movies = data.movies;
        let responseText = '';
        let arrayButtons = [];
        
        if (movies.length > 0) {

            ({ responseText, arrayButtons } = creaTesto_Bottoni(movies, 'LETTERA'));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_LETTERA'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_LETTERA'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }

            responseText += '\n<i>il film non è presente? effettua una richiesta al nostro staff</>';
        } else {
            responseText = 'Nessun film trovato corrispondente alla lettera scelta.\n\n' + 
                'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
        }
        arrayButtons.push([ Buttons.pannello_richieste_film ]);
        arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_FILM_LETTERA') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        await ctx.replyWithHTML( responseText, {
            parse_mode: 'HTML', 
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    })
}


/*          RICERCA PER ANNO            */

// pannello ricerca film per anno
exports.pannello_ricerca_film_anno = async (ctx) => {
    await ctx.reply('📆 <b>ANNO</> 📆\n\nScrivi l\'anno per cui vuoi effettuare la ricerca (4 cifre):',
        { parse_mode: 'HTML', reply_markup: {
            inline_keyboard: [[ Buttons.indietro('PANNELLO_FILM') ], [ Buttons.pannello_HOME ]]}});
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = 'UTENTE_FILM_ANNO';
    ctx.session.anno = '';
}

// risultati ricerca film per anno
exports.pannello_risultati_film_anno = async (ctx) => {
    try {
        if (!ctx.session.anno) {
            ctx.session.anno = ctx.update.message.text.trim();
            ctx.session.currentPage = 0;
        }

        const anno = ctx.session.anno;
        const page = ctx.session.currentPage;

        // trova tutti i film contenenti il titolo cercato
        Movie.findAll('ANNO', anno, page).then(async (data) => {

            const movies = data.movies;
            let responseText = '';
            let arrayButtons = [];
            
            if (movies.length > 0) {
                ({ responseText, arrayButtons } = creaTesto_Bottoni(movies, 'ANNO'));

                // bottoni per la paginazione
                let paginationButtons = [];

                if (data.hasPrevPage) {
                    paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_ANNO'});
                }
                if (data.hasNextPage) {
                    paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_ANNO'});
                }
                if (paginationButtons.length > 0){
                    arrayButtons.push(paginationButtons);
                }

                responseText += '\n<i>il film non è presente? effettua una richiesta al nostro staff</>';
            } else {
                responseText = 'Nessun film trovato per l\'anno inseriro.\n\n' + 
                    'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
            }
            arrayButtons.push([ Buttons.pannello_richieste_film ]);
            arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_FILM_ANNO') ]);
            arrayButtons.push([ Buttons.pannello_HOME ]);

            if (ctx.update.message) {
                const id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else if (ctx.update.callback_query) {
                try {
                    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            }
            await ctx.replyWithHTML( responseText, {
                parse_mode: 'HTML', 
                reply_markup: { inline_keyboard: arrayButtons } 
            });
        });
    } catch (err) {
        console.log("ERRORE TEXT RISULTATI ANNO FILM");
        console.error(err);
        return;
    }
}


/*          RICERCA PIÙ VOTATI            */

exports.pannello_risultati_film_più_votati = async (ctx) => {
    if (!ctx.session.currentPage) {
        ctx.session.currentPage = 0;
    }

    const page = ctx.session.currentPage;

    // trova tutti i film contenenti il titolo cercato
    Movie.findAll('PIÙ_VOTATI', null, page).then(async (data) => {

        const movies = data.movies;

        let responseText = '';
        let arrayButtons = [];
        
        if (movies.length > 0) {
            
            ({ responseText, arrayButtons } = creaTesto_Bottoni(movies, 'PIÙ_VOTATI'));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_PIÙ_VOTATI'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_PIÙ_VOTATI'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }

            responseText += '\n<i>il film non è presente? effettua una richiesta al nostro staff</>';
        } else {
            responseText = 'Nessun film trovato corrispondente al voto scelto.\n\n' + 
                'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
        }
        arrayButtons.push([ Buttons.pannello_richieste_film ]);
        arrayButtons.push([ Buttons.indietro('PANNELLO_FILM') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        await ctx.replyWithHTML( responseText, {
            parse_mode: 'HTML', 
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    })
}


/*          RANDOM          */

exports.pannello_risultati_film_random = async (ctx) => {

    Movie.findRandom().then(async (movie) => {
        ctx.session.files_id = movie.files_messages_id;

        const movie_TMDB = movie.TMDB_id ? await Moviedb.searchMovieById(movie.TMDB_id) : '';
        if (movie_TMDB && movie_TMDB.poster_path) {
            const image_url = 'https://image.tmdb.org/t/p/w500' + movie_TMDB.poster_path;
            await ctx.replyWithPhoto( { url: image_url },
                { caption: creaCaption(movie_TMDB), parse_mode: 'HTML',
                    reply_markup: Menu.pannello_dettagli_film_random('PANNELLO_FILM') }
            )
        } else {
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, MOVIE_CHANNEL_ID, movie.id_locandina,
                { reply_markup: Menu.pannello_dettagli_film_random('PANNELLO_FILM') }
            );
        }
        // elimina messaggio precedente
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }).catch((err) => {
        console.error(err);
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
    });
}


/*          LOCANDINA E FILES          */

// locandina film scelto, uguale per tutti i tipi di ricerca
exports.locandina_film = async (ctx) => {
    const movieId = ctx.update.callback_query.data.split(' ')[1];

    let back_button = '';
    const callback_data = ctx.update.callback_query.data.split(' ')[0];
    switch (callback_data) {
        case 'DETTAGLI_FILM_TITOLO:':
            back_button = 'PANNELLO_RISULTATI_RICERCA';
            break;
        case 'DETTAGLI_FILM_GENERE:':
            back_button = 'RISULTATI_FILM_GENERE: ';
            break;
        case 'DETTAGLI_FILM_LETTERA:':
            back_button = 'RISULTATI_FILM_LETTERA: ';
            break;
        case 'DETTAGLI_FILM_ANNO:':
            back_button = 'RISULTATI_FILM_ANNO';
            break;
        case 'DETTAGLI_FILM_PIÙ_VOTATI:':
            back_button = 'RISULTATI_FILM_PIÙ_VOTATI';
            break;
    }

    Movie.findOne(movieId).then(async (movie) => {
        ctx.session.files_id = movie.files_messages_id;

        const movie_TMDB = movie.TMDB_id ? await Moviedb.searchMovieById(movie.TMDB_id) : '';
        if (movie_TMDB && movie_TMDB.poster_path) {
            const image_url = 'https://image.tmdb.org/t/p/w500' + movie_TMDB.poster_path;
            await ctx.replyWithPhoto( { url: image_url },
                { caption: creaCaption(movie_TMDB), parse_mode: 'HTML',
                    reply_markup: Menu.pannello_dettagli_film(back_button) }
            )
        } else {
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, MOVIE_CHANNEL_ID, movie.id_locandina,
                { parse_mode: 'HTML', reply_markup: Menu.pannello_dettagli_film(back_button) }
            );
        }
        // elimina messaggio precedente
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }).catch((err) => {
        console.error(err);
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
    });
}

// pannello file singolo film
exports.pannello_files_film = async(ctx) => {
    try {
        let contatore_limite_messaggi = 0;
        const array_files_id = ctx.session.files_id;
        if (array_files_id.length > 18) {
            ctx.answerCbQuery("‼️ A causa delle limitazioni imposte da telegram "
                + " verranno inviati 18 files al minuto. ‼️", {show_alert: true}).catch((err) => { console.error(err); });
        }
        for (const currentId of array_files_id) {
            if (contatore_limite_messaggi == 18) {
                contatore_limite_messaggi = 0;
                await sleep(40000);
            }
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, MOVIE_CHANNEL_ID, currentId,
                (array_files_id.indexOf(currentId) === (array_files_id.length - 1)) ? 
                    { reply_markup: Menu.pannello_file_film } : ''
            );
            contatore_limite_messaggi += 1;
        }
        // cancella la locandina
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        ctx.session.title = '';
        ctx.session.files_id = '';
        ctx.session.currentPage = 0;
    } catch (err) {
        console.error(err);
    }
}


/*          RICHIESTE           */

exports.pannello_richieste = async (ctx) => {
    const user = await User.findOne(ctx.from.id);
    if (!user.username) {
        try {
            ctx.answerCbQuery("‼️ USERNAME OBBLIGATORIO ‼️\n\nPer poter effettuare richieste imposta uno username.",
                    {show_alert: true}).catch((err) => { console.error(err); });
        } catch (err) {
            console.error(err);
        }
    } else {
        const data_attuale = new Date();
        const data_ultima_richiesta = user.data_ultima_richiesta_film > user.data_ultima_richiesta_serie ?
            user.data_ultima_richiesta_film : user.data_ultima_richiesta_serie;
        let giorni_rimanenti = Math.abs(data_attuale - data_ultima_richiesta);
        giorni_rimanenti = 30 - Math.floor(giorni_rimanenti/(1000 * 3600 * 24));
        if (user.ammonizioni >= 3 && giorni_rimanenti > 0) {  
            ctx.answerCbQuery("‼️ SOSPESO ‼️\n\nHai ricevuto 3 ammonizioni e ti è stata revocata la possibilità di fare richieste per un mese.\n\n"
                + "Mancano ancora " + giorni_rimanenti + " giorni.",
                {show_alert: true}).catch((err) => { console.error(err); });
        } else {
            if (giorni_rimanenti < 0) {
                User.update(ctx.from.id, { ammonizioni: 0 })
            }
            const richieste_aperte = await Stato_richieste.requests_state();
            if (richieste_aperte) {
                await ctx.reply('⚠️ *REGOLAMENTO RICHIESTE* ⚠️\n\n'
                    + "⛔ NON SI RICHIEDONO FILM APPENA USCITI AL CINEMA (devono passare 2 mesi prima di richiederli perché noi puntiamo sulla QUALITÀ).\n"
                    + "⛔  Il titolo di ciò che cerchi deve essere corretto oltre che essere già uscito in Italia.\n"
                    + "⛔  I film in LINGUA ORIGINALE si possono richiedere SOLO sub-ita.\n\n"
                    + "⛔ Non si possono richiedere serie in lingua originale.\n"
                    + "⛔ Non si possono richiedere serie in corso.\n"
                    + "⛔ Non si possono richiedere serie animate/cartoni animati.\n"
                    + "⛔ Non si possono richiedere singole stagioni.\n\n"
                    + "‼️ *Prima di fare una richiesta controlla se ciò che cerchi è già presente* ‼️",
                    { parse_mode: 'Markdown', reply_markup: Menu.pannello_richieste });
                try {
                    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                ctx.answerCbQuery("‼️ Al momento le richieste sono chiuse. ‼️", {show_alert: true}).catch((err) => { console.error(err); });
            }
        }
    }
}


/*          RICHIESTE - FILM            */

// pannello richieste film [SUB-ITA]
exports.pannello_richiesta_film_SUB_ITA = async (ctx) => {
    const richieste_aperte = await Stato_richieste.requests_state();
    if (richieste_aperte) {
        const user = await User.findOne(ctx.from.id);
        const data_attuale = new Date();
        data_attuale.setDate(data_attuale.getDate() - 15);
        if (user.data_ultima_richiesta_film > data_attuale) {
            data_attuale.setDate(data_attuale.getDate() + 15)
            let giorni_rimanenti = Math.abs(data_attuale - user.data_ultima_richiesta_film);
            giorni_rimanenti = Math.floor(giorni_rimanenti/(1000 * 3600 * 24));
            ctx.answerCbQuery("‼️ ASPETTA ‼️\n\nPuoi effettuare una richiesta per un film ogni 15 giorni."
                + `\nPotrai richiedere nuovamente un film tra ${15 - giorni_rimanenti} giorni.`,
                {show_alert: true});
        } else {
            ctx.session.title = '';
            ctx.session.SUBITA = true;
            ctx.session.tipoRicerca = 'RICHIESTA_FILM_NON_PRESENTE';
            await ctx.reply('📨 <b>RICHIESTA FILM [SUB-ITA]</> 📨\n\nScrivi il titolo e anno del film <b>[SUB-ITA]</> che vuoi richiedere:\n\n'
                + 'Esempio:  <b>Dune 2021</>',
                { parse_mode: 'HTML', reply_markup: Menu.pannello_richieste_film });
            try {
                ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    } else {
        try {
            ctx.reply( '‼️ *RICHIESTE CHIUSE* ‼️\n\nAl momento le richieste sono chiuse.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
            azzeraSession();
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
}

// pannello richieste film
exports.pannello_richiesta_film = async (ctx) => {
    const richieste_aperte = await Stato_richieste.requests_state();
    if (richieste_aperte) {
        const user = await User.findOne(ctx.from.id);
        const data_attuale = new Date();
        data_attuale.setDate(data_attuale.getDate() - 15);
        if (user.data_ultima_richiesta_film > data_attuale) {
            data_attuale.setDate(data_attuale.getDate() + 15)
            let giorni_rimanenti = Math.abs(data_attuale - user.data_ultima_richiesta_film);
            giorni_rimanenti = Math.floor(giorni_rimanenti/(1000 * 3600 * 24));
            ctx.answerCbQuery("‼️ ASPETTA ‼️\n\nPuoi effettuare una richiesta per un film ogni 15 giorni."
                + `\nPotrai richiedere nuovamente un film tra ${15 - giorni_rimanenti} giorni.`,
                {show_alert: true});
        } else {
            ctx.session.title = '';
            ctx.session.tipoRicerca = 'RICHIESTA_FILM';
            await ctx.reply('📨 <b>RICHIESTA FILM</> 📨\n\nScrivi il titolo del film che vuoi richiedere:',
                { parse_mode: 'HTML', reply_markup: Menu.pannello_richieste_film });
            try {
                ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    } else {
        try {
            ctx.reply( '‼️ *RICHIESTE CHIUSE* ‼️\n\nAl momento le richieste sono chiuse.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
            azzeraSession();
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
}

// risultati ricerca film per titolo
exports.pannello_risultati_richiesta_film = async (ctx) => {
    
    const richieste_aperte = await Stato_richieste.requests_state();
    if (richieste_aperte) {
        try {
            if (!ctx.session.title) {
                ctx.session.title = ctx.update.message.text;
            }
            ctx.session.movie = '';
        
            Moviedb.searchMovieByTitle(ctx.session.title).then( async (movies) => {
                
                let responseText = '';
                let arrayButtons = [];
                
                if (movies.length > 0) {
                    responseText = 'Clicca sul bottone corrispondente al film:\n\n';
                    let buttons = [];
                    let contatore = 1;
                    // crea il testo del messaggio e i bottoni
                    movies.forEach((currentMovie) => {
                        responseText += contatore + ' - ' + currentMovie.title 
                            + (currentMovie.release_date ? (' (' + currentMovie.release_date.substring(0, 4) + ')\n') : '\n');
                        buttons.push({
                            text: contatore,
                            callback_data: 'RICHIESTA_LOCANDINA_TMDB: ' + currentMovie.id
                        })
                        contatore += 1
                    })
        
                    responseText += '\n\n<i>il film non è presente? scrivi qui sotto titolo e anno</>'
                    
                    // divide l'array buttons in più array di grandezza pari al secondo argomento
                    arrayButtons = Array.from({ length: Math.ceil(buttons.length / 4) }, (v, i) =>
                            buttons.slice(i * 4, i * 4 + 4));
                    arrayButtons.push([ Buttons.indietro('PANNELLO_RICHIESTA_FILM') ]);
                    arrayButtons.push([ Buttons.pannello_HOME ]);
                } else {
                    responseText = 'Nessun film corrispondente trovato.\nScrivi qui sotto titolo e anno:';
                    arrayButtons = [
                        [ Buttons.indietro('PANNELLO_RICHIESTA_FILM') ],
                        [ Buttons.pannello_HOME ]
                    ]
                }
        
                ctx.session.tipoRicerca = 'RICHIESTA_FILM_NON_PRESENTE';
        
                // elimina messaggio precedente
                if (ctx.update.message) {
                    let id_messaggio = ctx.update.message.message_id - 1;
                    try {
                        await ctx.deleteMessage(id_messaggio).catch((err) => {
                            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                            console.error(err);
                        });
                    } catch (err) {
                        console.error(err);
                    }
                    try {
                        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                            console.error(err);
                        });
                    } catch (err) {
                        console.error(err);
                    }
                } else if (ctx.update.callback_query) {
                    try {
                        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                            console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                            console.error(err);
                        });
                    } catch (err) {
                        console.error(err);
                    }
                }
                await ctx.replyWithHTML( responseText, { parse_mode: 'HTML',
                    reply_markup: { inline_keyboard: arrayButtons } 
                });
            });
        } catch (err) {
            console.log("ERRORE TEXT RISULTATI RICHIESTA FILM");
            console.error(err);
            return;
        }
    } else {
        try {
            ctx.reply( '‼️ *RICHIESTE CHIUSE* ‼️\n\nAl momento le richieste sono chiuse.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
            azzeraSession();
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
}

// locandina TMDB se presente
exports.pannello_locandina_richiesta_film = async (ctx) => {
    
    const richieste_aperte = await Stato_richieste.requests_state();
    if (richieste_aperte) {
        // se il film è salvato nella sessione, non rifaccio la ricerca
        
        const movieId = ctx.update.callback_query.data.split(' ')[1];
        const movie = await Moviedb.searchMovieById(movieId);
        ctx.session.movie = movie;
        const keyboard = { inline_keyboard: [
                [{ text: "✅ Conferma richiesta ✅", callback_data: 'PANNELLO_RICHIESTA_INVIATA' }],
                [ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_RICHIESTA') ],
                [ Buttons.pannello_HOME ]
            ]};
    
        if (movie.poster_path) {
            const image_url = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
            await ctx.replyWithPhoto( { url: image_url },
                { caption: creaCaption(ctx.session.movie),
                    parse_mode: 'HTML', reply_markup: keyboard });
        } else {
            await ctx.reply( creaCaption(ctx.session.movie),
                { parse_mode: 'HTML', reply_markup: keyboard})
        }
        // elimina messaggio precedente
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    } else {
        try {
            ctx.reply( '‼️ *RICHIESTE CHIUSE* ‼️\n\nAl momento le richieste sono chiuse.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
            azzeraSession();
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
    
}

exports.pannello_richiesta_inviata = async (ctx, film_non_presente) => {
    const richieste_aperte = await Stato_richieste.requests_state();
    try {
        if (richieste_aperte) {
            const username = ctx.from.username ? '@' + ctx.from.username : '';
            const inizio_message = 'Richiesta da: ' + username + ' [' + ctx.from.id + ']\n\n';
            if (film_non_presente) {
                let sub_ita = '';
                if (ctx.session.SUBITA) {
                    sub_ita = '<B>[SUB-ITA]</>';
                }
                
                const message = inizio_message + 'Film ' + sub_ita + ':\n' + ctx.update.message.text;
                let id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                await ctx.telegram.sendMessage(REQUEST_CHANNEL_MOVIE, message,
                    { parse_mode: 'HTML',
                        reply_markup: ctx.session.SUBITA ? Menu.pannello_richiesta_inviata_SUB_ITA : Menu.pannello_richiesta_inviata
                });
            } else {
                const movie = ctx.session.movie;
                if (movie.poster_path) {
                    const image_url = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
                    
                    await ctx.telegram.sendPhoto(REQUEST_CHANNEL_MOVIE, { url: image_url },
                        { caption: inizio_message + creaCaption(movie),
                            parse_mode: 'HTML',
                            reply_markup: Menu.pannello_richiesta_inviata
                    })
                } else {
                    await ctx.telegram.sendMessage(REQUEST_CHANNEL_MOVIE, 
                        inizio_message + creaCaption(movie),
                        { parse_mode: 'HTML',
                            reply_markup: Menu.pannello_richiesta_inviata
                    });
                }
                try {
                    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            }
            // aggiorna la data dell'ultima richiesta
            User.update(ctx.from.id, { data_ultima_richiesta_film: new Date()});
        
            const tipo_richiesta = ctx.session.SUBITA ? 'film_sub_ita' : 'film';
        
            // aumenta di uno le richieste film fatte al bot
            Bot.aggiornaRichieste(tipo_richiesta);
        
            ctx.reply('✅ *RICHIESTA INVIATA* ✅\n\nRichiesta inviata con successo.\nIl nostro staff ti risponderà il prima possibile.',
                { parse_mode: 'Markdown', reply_markup: Menu.pannello_file_film })
            ctx.session.title = '';
            ctx.session.SUBITA = '';
            ctx.session.tipoRicerca = '';
        } else {
            try {
                ctx.reply( '‼️ *RICHIESTE CHIUSE* ‼️\n\nAl momento le richieste sono chiuse.',
                    { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
                azzeraSession();
                ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE MOVIE ACTIONS");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.log("ERRORE TEXT RICHIESTA INVIATA FILM");
        console.error(err);
        return;
    }
}



/*          FUNZIONI AUSILIARIE         */

// funzione per creare la descrizione della locandina TMDB
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

// crea testo per i risultati ricerca film
const creaTesto_Bottoni = (movies, tipo_ricerca) => {
    let responseText = '🔎 <b>RISULTATI RICERCA</> 🔎\n\nClicca sul bottone corrispondente al film che vuoi vedere:\n\n';
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
            callback_data: 'DETTAGLI_FILM_' + tipo_ricerca + ': ' + currentMovie.id
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
        ctx.session.currentPage = '';
    } catch {
        return;
    }
}