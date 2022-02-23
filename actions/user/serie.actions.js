require('dotenv').config();
const REQUEST_CHANNEL_SERIE = process.env.REQUEST_CHANNEL_SERIE; // Canale test, da cambiare per produzione
const SERIE_CHANNEL_ID = process.env.SERIE_CHANNEL_ID; // Canale test, da cambiare per produzione
const Menu = require("../../components/menu");
const Serie = require("../../controllers/serie.controller");
const Movie = require("../../controllers/movie.controller");
const Moviedb = require("../../controllers/moviedb.controller");
const Stato_richieste = require('../../controllers/bot.controller');
const User = require('../../controllers/user.controller');
const Admin = require('../../controllers/admin.controller');
const Bot = require('../../controllers/bot.controller');
const Buttons = require('../../components/buttons');
const ARRAY_NUMBERS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];


// pannello menu principale film
exports.pannello_serie = async (ctx) => {
    ctx.reply('📺 <b>SERIE TV</> 📺\n\nChe tipo di ricerca vuioi effettuare?',
        { parse_mode: 'HTML', reply_markup: Menu.pannello_serie_tv });
    try {
        await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    azzeraSession(ctx);
}

/*          RICERCA PER TITOLO          */

// pannello ricerca serie per titolo
exports.pannello_ricerca_serie_titolo = async (ctx) => {
    ctx.session.tipoRicerca = 'UTENTE_SERIE_TITOLO';
    ctx.session.title = '';
    await ctx.reply('🔎 <b>TITOLO</> 🔎\n\nScrivi il titolo completo o parte del titolo della serie da cercare:',
        { parse_mode: 'HTML', reply_markup: Menu.pannello_ricerca_serie_titolo });
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
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
        Serie.findAll('TITOLO', title, page).then(async (data) => {

            const series = data.series;
            let responseText = '';
            let arrayButtons = [];
            
            if (series.length > 0) {
                
                ({ responseText, arrayButtons } = creaTesto_Bottoni(series, 'TITOLO'));

                // bottoni per la paginazione
                let paginationButtons = [];

                if (data.hasPrevPage) {
                    paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_TITOLO_SERIE'});
                }
                if (data.hasNextPage) {
                    paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_TITOLO_SERIE'});
                }
                if (paginationButtons.length > 0){
                    arrayButtons.push(paginationButtons);
                }

                responseText += '\n<i>la serie non è presente? effettua una richiesta al nostro staff</>';
            } else {
                responseText = 'Ci dispiace, purtroppo la serie cercata non è presente.\n\n' + 
                    'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
            }
            arrayButtons.push([ Buttons.pannello_richieste_serie ]);
            arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_SERIE_TITOLO') ]);
            arrayButtons.push([ Buttons.pannello_HOME ]);

            await ctx.replyWithHTML( responseText, {
                parse_mode: 'HTML', 
                reply_markup: { inline_keyboard: arrayButtons } 
            });
            if (ctx.update.message) {
                const id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else if (ctx.update.callback_query) {
                try {
                    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        });
    } catch (err) {
        console.log("ERRORE TEXT RISULTATI RICERCA TITOLO SERIE");
        console.error(err);
        return;
    }
}


/*          RICERCA PER GENERE          */

exports.pannello_ricerca_serie_genere = async (ctx) => {
    let generi = await Serie.getGenres();
    let buttons = [];
    // crea il testo del messaggio e i bottoni
    generi.forEach((currentGenere) => {
        buttons.push({
            text: currentGenere,
            callback_data: 'RISULTATI_SERIE_GENERE: ' + currentGenere
        })
    })
    let arrayButtons = Array.from({ length: Math.ceil(buttons.length / 3) }, (v, i) => buttons.slice(i * 3, i * 3 + 3));
    arrayButtons.push([ Buttons.indietro('PANNELLO_SERIE_TV') ]);
    arrayButtons.push([ Buttons.pannello_HOME ]);
    ctx.reply('📚 <b>GENERE</> 📚\n\nScegli il genere che preferisci:',
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: arrayButtons }});
    try {
        await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.genere = '';
}

exports.pannello_risultati_serie_genere = async (ctx) => {
    if (!ctx.session.genere) {
        ctx.session.genere = ctx.update.callback_query.data.split(' ')[1];
        ctx.session.currentPage = 0;
    }

    const genere = ctx.session.genere;
    const page = ctx.session.currentPage;

    // trova tutti i film contenenti il titolo cercato
    Serie.findAll('GENERE', genere, page).then(async (data) => {

        const series = data.series;
        let responseText = '';
        let arrayButtons = [];
        
        if (series.length > 0) {

            ({ responseText, arrayButtons } = creaTesto_Bottoni(series, 'GENERE'));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_GENERE_SERIE'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_GENERE_SERIE'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }

            responseText += '\n<i>la serie non è presente? effettua una richiesta al nostro staff</>';
        } else {
            responseText = 'Ci dispiace, purtroppo la serie cercata non è presente.\n\n' + 
                'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
        }
        arrayButtons.push([ Buttons.pannello_richieste_serie ]);
        arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_SERIE_GENERE') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        await ctx.replyWithHTML( responseText, {
            parse_mode: 'HTML', 
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    })
}


/*          RICERCA PER LETTERA         */

exports.pannello_ricerca_serie_lettera = async (ctx) => {
    const alfabeto = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let buttons = [];
    alfabeto.forEach((currentLetter) => {
        buttons.push({
            text: currentLetter,
            callback_data: 'RISULTATI_SERIE_LETTERA: ' + currentLetter
        })
    })
    let arrayButtons = Array.from({ length: Math.ceil(buttons.length / 4) }, (v, i) =>
                    buttons.slice(i * 4, i * 4 + 4));
    arrayButtons.push([ Buttons.indietro('PANNELLO_SERIE_TV') ]);
    arrayButtons.push([ Buttons.pannello_HOME ]);
    await ctx.reply('🔠 <b>A - Z</> 🔠\n\nScegli la lettera che preferisci:',
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: arrayButtons }});
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.lettera = '';
}

exports.pannello_risultati_serie_lettera = async (ctx) => {
    if (!ctx.session.lettera) {
        ctx.session.lettera = ctx.update.callback_query.data.split(' ')[1];
        ctx.session.currentPage = 0;
    }

    const lettera = ctx.session.lettera;
    const page = ctx.session.currentPage;

    // trova tutte le serie che iniziano per la lettera scelta
    Serie.findAll('LETTERA', lettera, page).then(async (data) => {

        const series = data.series;
        let responseText = '';
        let arrayButtons = [];
        
        if (series.length > 0) {

            ({ responseText, arrayButtons } = creaTesto_Bottoni(series, 'LETTERA'));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_LETTERA_SERIE'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_LETTERA_SERIE'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }

            responseText += '\n<i>la serie non è presente? effettua una richiesta al nostro staff</>';
        } else {
            responseText = 'Nessuna serie trovata corrispondente alla lettera scelta.\n\n' + 
                'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
        }
        arrayButtons.push([ Buttons.pannello_richieste_serie ]);
        arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_SERIE_LETTERA') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        await ctx.replyWithHTML( responseText, {
            parse_mode: 'HTML', 
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    })
}


/*          RICERCA PER ANNO            */

// pannello ricerca serie per anno
exports.pannello_ricerca_serie_anno = async (ctx) => {
    await ctx.reply('📆 <b>Anno</> 📆\n\nScrivi l\'anno per cui vuoi effettuare la ricerca (4 cifre):',
        { parse_mode: 'HTML',
            reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_SERIE_TV') ], [ Buttons.pannello_HOME ]]}});
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
            console.error(err);
        });
    } catch (err) {
        console.error(err);
    }
    ctx.session.tipoRicerca = 'UTENTE_SERIE_ANNO';
    ctx.session.anno = '';
}

// risultati ricerca serie per anno
exports.pannello_risultati_serie_anno = async (ctx) => {
    try {
        if (!ctx.session.anno) {
            ctx.session.anno = ctx.update.message.text.trim();
            ctx.session.currentPage = 0;
        }

        const anno = ctx.session.anno;
        const page = ctx.session.currentPage;

        // trova tutte le serie dell'anno scelto
        Serie.findAll('ANNO', anno, page).then(async (data) => {

            const series = data.series;
            let responseText = '';
            let arrayButtons = [];
            
            if (series.length > 0) {
                ({ responseText, arrayButtons } = creaTesto_Bottoni(series, 'ANNO'));

                // bottoni per la paginazione
                let paginationButtons = [];

                if (data.hasPrevPage) {
                    paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_ANNO_SERIE'});
                }
                if (data.hasNextPage) {
                    paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_ANNO_SERIE'});
                }
                if (paginationButtons.length > 0){
                    arrayButtons.push(paginationButtons);
                }

                responseText += '\n<i>la serie non è presente? effettua una richiesta al nostro staff</>';
            } else {
                responseText = 'Nessuna serie trovata per l\'anno inseriro.\n\n' + 
                    'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
            }
            arrayButtons.push([ Buttons.pannello_richieste_serie ]);
            arrayButtons.push([ Buttons.indietro('PANNELLO_RICERCA_SERIE_ANNO') ]);
            arrayButtons.push([ Buttons.pannello_HOME ]);

            await ctx.replyWithHTML( responseText, {
                parse_mode: 'HTML', 
                reply_markup: { inline_keyboard: arrayButtons } 
            });
            if (ctx.update.message) {
                const id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else if (ctx.update.callback_query) {
                try {
                    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        });
    } catch (err) {
        console.log("ERRORE TEXT RISULTATI SERIE ANNO");
        console.error(err);
        return;
    }
}


/*          RICERCA PIÙ VOTATI            */

exports.pannello_risultati_serie_più_votate = async (ctx) => {
    if (!ctx.session.currentPage) {
        ctx.session.currentPage = 0;
    }

    const page = ctx.session.currentPage;

    // trova le serie più votate
    Serie.findAll('PIÙ_VOTATI', null, page).then(async (data) => {

        const series = data.series;
        let responseText = '';
        let arrayButtons = [];
        
        if (series.length > 0) {
            
            ({ responseText, arrayButtons } = creaTesto_Bottoni(series, 'PIÙ_VOTATE'));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_PIÙ_VOTATI_SERIE'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_PIÙ_VOTATI_SERIE'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }

            responseText += '\n<i>la serie non è presente? effettua una richiesta al nostro staff</>';
        } else {
            responseText = 'Nessuna serie trovata corrispondente al voto scelto.\n\n' + 
                'Effettua una richiesta al nostro staff e ti risponderemo il prima possibile.';
        }
        arrayButtons.push([ Buttons.pannello_richieste_serie ]);
        arrayButtons.push([ Buttons.indietro('PANNELLO_SERIE_TV') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        await ctx.replyWithHTML( responseText, {
            parse_mode: 'HTML', 
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    })
}


/*          RANDOM          */

exports.pannello_risultati_serie_random = async (ctx) => {

    Serie.findRandom().then(async (serie) => {
        ctx.session.files_id = serie.files_messages_id;
        
        const serie_TMDB = serie.TMDB_id ? await Moviedb.searchSerieById(serie.TMDB_id) : '';
        if (serie_TMDB) {
            if (serie_TMDB.seasons[serie.season_index].poster_path) {
                const image_url = 'https://image.tmdb.org/t/p/w500' + serie_TMDB.seasons[serie.season_index].poster_path;
                await ctx.replyWithPhoto( { url: image_url },
                    { caption: creaCaptionSeason(serie_TMDB, serie.season_index), parse_mode: 'HTML',
                        reply_markup: Menu.pannello_dettagli_serie_random('PANNELLO_SERIE_TV') }
                )
            } else if (serie_TMDB.poster_path) {
                const image_url = 'https://image.tmdb.org/t/p/w500' + serie_TMDB.poster_path;
                await ctx.replyWithPhoto( { url: image_url },
                    { caption: creaCaptionSeason(serie_TMDB, serie.season_index), parse_mode: 'HTML',
                        reply_markup: Menu.pannello_dettagli_serie_random('PANNELLO_SERIE_TV') }
                )
            } else {
                ctx.reply( creaCaptionSeason(serie_TMDB, serie.season_index), { parse_mode: 'HTML',
                        reply_markup: Menu.pannello_dettagli_serie_random('PANNELLO_SERIE_TV') }
                )
            }
            
        } else {
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, SERIE_CHANNEL_ID, serie.id_locandina,
                { reply_markup: Menu.pannello_dettagli_serie_random('PANNELLO_SERIE_TV') }
            );
        }
        // elimina messaggio precedente
        try {
            await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }).catch((err) => {
        console.error(err);
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
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

// locandina serie scelta, uguale per tutti i tipi di ricerca
exports.locandina_serie = async (ctx) => {
    const serieId = ctx.update.callback_query.data.split(' ')[1];

    let back_button = '';
    const callback_data = ctx.update.callback_query.data.split(' ')[0];
    switch (callback_data) {
        case 'DETTAGLI_SERIE_TITOLO:':
            back_button = 'PANNELLO_RISULTATI_RICERCA_SERIE';
            break;
        case 'DETTAGLI_SERIE_GENERE:':
            back_button = 'RISULTATI_SERIE_GENERE: ';
            break;
        case 'DETTAGLI_SERIE_LETTERA:':
            back_button = 'RISULTATI_SERIE_LETTERA: ';
            break;
        case 'DETTAGLI_SERIE_ANNO:':
            back_button = 'RISULTATI_SERIE_ANNO';
            break;
        case 'DETTAGLI_SERIE_PIÙ_VOTATE:':
            back_button = 'RISULTATI_SERIE_PIÙ_VOTATE';
            break;
    }

    Serie.findOne(serieId).then(async (serie) => {
        ctx.session.files_id = serie.files_messages_id;

        const serie_TMDB = serie.TMDB_id ? await Moviedb.searchSerieById(serie.TMDB_id) : '';
        if (serie_TMDB) {
            if (serie_TMDB.seasons[serie.season_index].poster_path) {
                const image_url = 'https://image.tmdb.org/t/p/w500' + serie_TMDB.seasons[serie.season_index].poster_path;
                await ctx.replyWithPhoto( { url: image_url },
                    { caption: creaCaptionSeason(serie_TMDB, serie.season_index), parse_mode: 'HTML',
                        reply_markup: Menu.pannello_dettagli_serie(back_button) }
                )
            } else if (serie_TMDB.poster_path) {
                const image_url = 'https://image.tmdb.org/t/p/w500' + serie_TMDB.poster_path;
                await ctx.replyWithPhoto( { url: image_url },
                    { caption: creaCaptionSeason(serie_TMDB, serie.season_index), parse_mode: 'HTML',
                        reply_markup: Menu.pannello_dettagli_serie(back_button) }
                )
            } else {
                await ctx.reply( creaCaptionSeason(serie_TMDB, serie.season_index), { parse_mode: 'HTML',
                        reply_markup: Menu.pannello_dettagli_serie(back_button) }
                )
            }
            
        } else {
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, SERIE_CHANNEL_ID, serie.id_locandina,
                { reply_markup: Menu.pannello_dettagli_serie(back_button) }
            );
        }
        // elimina messaggio precedente
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }).catch((err) => {
        console.error(err);
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
    });
}

// pannello file singola serie
exports.pannello_files_serie = async(ctx) => {
    try {
        let contatore_limite_messaggi = 0;
        const array_files_id = ctx.session.files_id;
        if (array_files_id.length > 18) {
            ctx.answerCbQuery("‼️ A causa delle limitazioni imposte da telegram "
                + " verranno inviati 18 files al minuto. ‼️", {show_alert: true});
        }
        for (const currentId of array_files_id) {
            if (contatore_limite_messaggi == 18) {
                contatore_limite_messaggi = 0;
                await sleep(40000);
            }
            // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
            await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, SERIE_CHANNEL_ID, currentId,
                (array_files_id.indexOf(currentId) === (array_files_id.length - 1)) ? 
                    { reply_markup: Menu.pannello_file_serie } : ''
            );
            contatore_limite_messaggi += 1;
        }
        // cancella la locandina
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
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



/*          RICHIESTE - SERIE            */

// pannello richieste film
exports.pannello_richiesta_serie = async (ctx) => {
    
    const richieste_aperte = await Stato_richieste.requests_state();
    if (richieste_aperte) {
        const user = await User.findOne(ctx.from.id);
        const data_attuale = new Date();
        data_attuale.setDate(data_attuale.getDate() - 15);
        if (user.data_ultima_richiesta_serie > data_attuale) {
            data_attuale.setDate(data_attuale.getDate() + 15)
            let giorni_rimanenti = Math.abs(data_attuale - user.data_ultima_richiesta_film);
            giorni_rimanenti = Math.floor(giorni_rimanenti/(1000 * 3600 * 24));
            ctx.answerCbQuery("‼️ ASPETTA ‼️\n\nPuoi effettuare una richiesta ogni 15 giorni."
                + `\nPotrai richiedere nuovamente una serie tra ${15 - giorni_rimanenti} giorni.`,
                {show_alert: true});
        } else {
            ctx.session.title = '';
            ctx.session.tipoRicerca = 'RICHIESTA_SERIE';
            await ctx.reply('📨 <b>RICHIESTA SERIE</> 📨\n\nScrivi il titolo della serie che vuoi richiedere:',
                { parse_mode: 'HTML', reply_markup: Menu.pannello_richieste_film });
            try {
                ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
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
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
}

// risultati ricerca film per titolo
exports.pannello_risultati_richiesta_serie = async (ctx) => {
    const richieste_aperte = await Stato_richieste.requests_state();
    if (richieste_aperte) {
        try {
            if (!ctx.session.title) {
                ctx.session.title = ctx.update.message.text;
            }
            ctx.session.serie = '';
        
            Moviedb.searchSerieByTitle(ctx.session.title).then( async (series) => {
                
                let responseText = '';
                let arrayButtons = [];
                
                if (series.length > 0) {
                    responseText = 'Clicca sul bottone corrispondente alla serie:\n\n';
                    let buttons = [];
                    let contatore = 1;
                    // crea il testo del messaggio e i bottoni
                    series.forEach((currentSerie) => {
                        responseText += contatore + ' - ' + currentSerie.name 
                            + (currentSerie.first_air_date ? (' (' + currentSerie.first_air_date.substring(0, 4) + ')\n') : '\n');
                        buttons.push({
                            text: contatore,
                            callback_data: 'RICHIESTA_LOCANDINA_TMDB_SERIE: ' + currentSerie.id
                        })
                        contatore += 1
                    })
        
                    responseText += '\n\n<i>la serie non è presente? scrivi qui sotto titolo e anno</>'
                    
                    // divide l'array buttons in più array di grandezza pari al secondo argomento
                    arrayButtons = Array.from({ length: Math.ceil(buttons.length / 4) }, (v, i) =>
                            buttons.slice(i * 4, i * 4 + 4));
                    arrayButtons.push([ Buttons.indietro('PANNELLO_RICHIESTA_SERIE') ]);
                    arrayButtons.push([ Buttons.pannello_HOME ]);
                } else {
                    responseText = 'Nessuna serie corrispondente trovata.\nScrivi qui sotto titolo e anno:';
                    arrayButtons = [
                        [ Buttons.indietro('PANNELLO_RICHIESTA_SERIE') ],
                        [ Buttons.pannello_HOME ]
                    ]
                }
        
                ctx.session.tipoRicerca = 'RICHIESTA_SERIE_NON_PRESENTE';
        
                await ctx.replyWithHTML( responseText, {
                    reply_markup: { inline_keyboard: arrayButtons } 
                });
                // elimina messaggio precedente
                if (ctx.update.message) {
                    const id_messaggio = ctx.update.message.message_id - 1;
                    try {
                        await ctx.deleteMessage(id_messaggio).catch((err) => {
                            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                            console.error(err);
                        });
                    } catch (err) {
                        console.error(err);
                    }
                    try {
                        ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                            console.error(err);
                        });
                    } catch (err) {
                        console.error(err);
                    }
                } else if (ctx.update.callback_query) {
                    try {
                        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                            console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                            console.error(err);
                        });
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        } catch (err) {
            console.log("ERRORE TEXT RISULTATI RICHIESTA SERIE");
            console.error(err);
            return;
        }
    } else {
        try {
            ctx.reply( '‼️ *RICHIESTE CHIUSE* ‼️\n\nAl momento le richieste sono chiuse.',
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
            azzeraSession();
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
}

// locandina TMDB se presente
exports.pannello_locandina_richiesta_serie = async (ctx) => {
    const richieste_aperte = await Stato_richieste.requests_state();
    if (richieste_aperte) {
        // se il film è salvato nella sessione, non rifaccio la ricerca
        
        const serieId = ctx.update.callback_query.data.split(' ')[1];
        const serie = await Moviedb.searchSerieById(serieId);
        ctx.session.serie = serie;
        
        let buttons = [];
    
        buttons.push([{ text: "✅ Conferma richiesta ✅", callback_data: 'PANNELLO_RICHIESTA_INVIATA_SERIE' }]);
        buttons.push([ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_RICHIESTA_SERIE') ]);
        buttons.push([ Buttons.pannello_HOME ]);
    
        if (serie.poster_path) {
            const image_url = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
            await ctx.replyWithPhoto( { url: image_url },
                { caption: creaCaption(ctx.session.serie),
                    parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } });
        } else {
            await ctx.reply( creaCaption(ctx.session.serie),
                { parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } });
        }
        // elimina messaggio precedente
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
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
                console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
    
}

exports.pannello_richiesta_inviata = async (ctx, serie_non_presente) => {
    const richieste_aperte = await Stato_richieste.requests_state();
    try {
        if (richieste_aperte) {
            const username = ctx.from.username ? '@' + ctx.from.username : '';
            const inizio_message = 'Richiesta da: ' + username + ' [' + ctx.from.id + ']\n\n';
            if (serie_non_presente) {
                const message = inizio_message + 'Serie:\n' + ctx.update.message.text;
                await ctx.telegram.sendMessage(REQUEST_CHANNEL_SERIE, message,
                    { parse_mode: 'HTML',
                        reply_markup: Menu.pannello_richiesta_inviata_serie
                });
                const id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                const serie = ctx.session.serie;
                if (serie.poster_path) {
                    const image_url = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
        
                    await ctx.telegram.sendPhoto(REQUEST_CHANNEL_SERIE, { url: image_url },
                        { caption: inizio_message + creaCaption(serie),
                            parse_mode: 'HTML',
                            reply_markup: Menu.pannello_richiesta_inviata_serie
                    });
                } else {
                    await ctx.telegram.sendMessage(REQUEST_CHANNEL_SERIE, 
                        inizio_message + creaCaption(serie),
                        { parse_mode: 'HTML',
                            reply_markup: Menu.pannello_richiesta_inviata_serie
                    });
                }
                try {
                    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            }
            // aggiorna la data dell'ultima richiesta
            User.update(ctx.from.id, { data_ultima_richiesta_serie: new Date()});
        
            // aumenta di uno le richieste film fatte al bot
            Bot.aggiornaRichieste('serie');
        
            await ctx.reply('✅ *RICHIESTA INVIATA* ✅\n\nRichiesta inviata con successo.\nIl nostro staff ti risponderà il prima possibile.',
                { parse_mode: 'Markdown', reply_markup: Menu.pannello_file_film });
            ctx.session.title = '';
            ctx.session.tipoRicerca = '';
        
        } else {
            try {
                ctx.reply( '‼️ *RICHIESTE CHIUSE* ‼️\n\nAl momento le richieste sono chiuse.',
                    { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
                azzeraSession();
                ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE SERIE ACTIONS");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.log("ERRORE TEXT RICHIESTA INVIATA SERIE");
        console.error(err);
        return;
    }
}


/*          FUNZIONI AUSILIARIE         */

// funzione per creare la descrizione della locandina TMDB
const creaCaption = (serie) => {
    let Genere = '';
    if (serie.genres.length > 0) {
        Genere = '📚Genere:';
        serie.genres.forEach(currentGenere => {
            Genere = Genere + ' #' + currentGenere.name
        });
        Genere = Genere + '\n'
    }
    const Titolo = '\n<b>' + serie.name + '</>\n\n';
    const Regista = serie.director? '🎬Regista: ' + serie.director + '\n' : '';
    const Anno = serie.first_air_date? '📆Anno: ' + serie.first_air_date.split('-')[0] + '\n' : '';
    const Durata = serie.runtime? '⏳Durata: ' + Math.floor(serie.runtime/60) + 'h ' + serie.runtime%60 + 'm\n' : '';
    const Voto = serie.vote_average? '⭐️Voto: ' + serie.vote_average + '/10\n' : '';
    const Trama = '\n🖋Trama e info: ' + '<a href="https://www.themoviedb.org/tv/' + 
                serie.id + '?language=it-IT">[CLICCA QUI]</>' + '\n';
    const Trailer = serie.trailer? '🎞Trailer: ' + serie.trailer : '';

    return `${Titolo}${Regista}${Anno}${Durata}${Genere}${Voto}${Trama}${Trailer}`;
}

// funzione per creare la descrizione della locandina corrispondente ad una determinata stagione
const creaCaptionSeason = (movie, season) => {
    let Genere = '';
    if (movie.genres.length > 0) {
        Genere = '📚Genere:';
        movie.genres.forEach(currentGenere => {
            Genere = Genere + ' #' + currentGenere.name
        });
        Genere = Genere + '\n'
    }
    const Stagione = movie.seasons? '[' + movie.seasons[season].name + ']' : '';
    const Titolo = '\n<b>' + movie.name + ' ' + Stagione + '</>\n\n';
    const Regista = movie.director? '🎬Regista: ' + movie.director + '\n' : '';
    const Episodi = '🎬Episodi: ' + movie.seasons[season].episode_count + '\n';
    const Anno = movie.seasons[season].air_date? '📆Anno: ' + movie.seasons[season].air_date.substring(0, 4) + '\n' : '';
    const Voto = movie.vote_average? '⭐️Voto: ' + movie.vote_average + '/10\n' : '';
    const Trama = '\n🖋Trama e info: ' + '<a href="https://www.themoviedb.org/tv/' + movie.id + '/season/'
                + movie.seasons[season].season_number + '?language=it-IT">[CLICCA QUI]</>' + '\n';
    const Trailer = movie.trailer? '🎞Trailer: ' + movie.trailer : '';

    return `${Titolo}${Episodi}${Regista}${Anno}${Genere}${Voto}${Trama}${Trailer}`;
}

// crea testo per i risultati ricerca film
const creaTesto_Bottoni = (series, tipo_ricerca) => {
    let responseText = '🔎 Clicca sul bottone corrispondente alla serie che vuoi vedere:\n\n';
    let buttons = [];
    let contatore = 0;
    // crea il testo del messaggio e i bottoni
    series.forEach((currentSerie) => {
        let genere = '';
        currentSerie.genere.forEach((currentGenere) => {
            genere += ' #' + currentGenere;
        });
        responseText += ARRAY_NUMBERS[contatore] + ' - <b>' + currentSerie.titolo + ' (' + currentSerie.anno
            + ')</>\n' + '📚' + genere + '\n⭐️ <b>' + currentSerie.voto + '/10</>\n\n';
        buttons.push({
            text: ARRAY_NUMBERS[contatore],
            callback_data: 'DETTAGLI_SERIE_' + tipo_ricerca + ': ' + currentSerie.id
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

// evita il blocco durante il backup dei messaggi aspettando 5 secondi tra l'invio di un file e il successivo
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
        ctx.session.currentPage = 0;
    } catch {
        return;
    }
}