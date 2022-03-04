require('dotenv').config();
// Canale test, da cambiare per produzione
const { SERIE_CHANNEL_ID, BACKUP_SERIE_1, BACKUP_SERIE_2, BACKUP_SERIE_3, PUBLIC_CHANNEL_SERIE } = process.env;
const Buttons = require('../../components/buttons');
const Menu = require("../../components/menu");
const Moviedb = require("../../controllers/moviedb.controller");
const Serie = require("../../controllers/serie.controller");
const Stato_richieste = require('../../controllers/bot.controller');
const User = require('../../controllers/user.controller');
const ARRAY_NUMBERS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];


exports.pannello_serie_admin = async (ctx) => {
    await ctx.reply('📺 <b>SERIE TV</> 📺\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'HTML', reply_markup: Menu.pannello_serie_admin });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
    ctx.session.tipoRicerca = '';
}

/*          BACKUP SERIE         */

// richiede all'admin di inserire l'id del canale su cui effettuare il backup
exports.backup_serie_richiesta_canale = async (ctx) => {
    await ctx.reply('‼️ BACKUP SERIE ‼️\n\nScrivi l\'id del canale su cui vuoi effettuare il backup.'
        + '\n\n*IMPORTANTE: aggiungi 100 tra il meno e il primo numero*'
        + '\n\nEsempio:\n\n-1001393725644', { parse_mode: 'Markdown',
        reply_markup:  { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
    ctx.session.tipoRicerca = 'BACKUP_SERIE';
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
}

// effettua il backup su un canale con id inserito dall'admin.
// in caso di riuscita risponde con il numero di messaggi e di serie copiati
exports.backup_serie = async (ctx) => {
    const destination_channel = ctx.update.message.text;
    ctx.session.tipoRicerca = '';
    const allSeries = await Serie.findAll_backup();
    if (allSeries.message) {
        await ctx.reply(allSeries.message, {reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    } else {
        // tempo stimato = (id ultimo messaggio / 20 messaggi al minuto)/ 60 minuti in un'ora
        let tempo_stimato = allSeries.slice().reverse()[0].id_locandina / 20;
        tempo_stimato = Math.floor(tempo_stimato / 60) + ':' + Math.floor(tempo_stimato % 60 * 60);
        const message_backup_avviato = await ctx.reply('✅ *BACKUP AVVIATO* ✅\n\nTempo stimato: *' 
            + tempo_stimato + '* _Ore_', { parse_mode: 'Markdown' });
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        // contatore_limite_messaggi utilizzato come limitatore, è possibile inviare massimo un messaggio al secondo
        // ed in totale massimo 20 messaggi al minuto.
        let contatore_limite_messaggi = 0
        let contatoreMessaggi = 0;
        let contatoreSerie = 0;
        let verifica_id_messaggi_mancanti = 2;
        let errore = false;
        // se l'id del messaggio precedente e l'id del messaggio corrente non sono consecutivi
        // riempio il buco con messaggi di riempimento
        for (const currentSerie of allSeries) {
            // copia film da ... in poi
            if (allSeries.indexOf(currentSerie) >= 0) {
                while (currentSerie.id_locandina > verifica_id_messaggi_mancanti) {
                    await ctx.telegram.sendMessage(destination_channel, 'messaggio di riempimento');
                    verifica_id_messaggi_mancanti += 1;
                    contatore_limite_messaggi += 1;
                }
                try {
                    await ctx.telegram.copyMessage( destination_channel, BACKUP_SERIE_3, currentSerie.id_locandina );
                } catch (err) {
                    console.error(err);
                    if (err.response.description == 'Bad Request: chat not found') {
                        ctx.reply( '‼️ *ERRORE* ‼️\n\nCi scusiamo, si è verificato un errore. Riprova.',
                        { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.pannello_HOME ]]}});
                        errore = true;
                        break
                    }
                    ctx.reply('‼️ <b>ERRORE</> ‼️\n\nSerie <b>"' + currentSerie.titolo + '"</> non trovata e non aggiunta.',
                    {parse_mode: 'HTML'});
                    continue;
                }
                console.log(currentSerie.titolo);
                verifica_id_messaggi_mancanti += 1;
                contatoreMessaggi += 1;
                contatore_limite_messaggi += 1;
                if (contatore_limite_messaggi == 19) {
                    contatore_limite_messaggi = 0;
                    await sleep(40000);
                } else {
                    await sleep(1000);
                }
                for (const currentFile of currentSerie.files_messages_id) {
                    while (currentFile > verifica_id_messaggi_mancanti) {
                        await ctx.telegram.sendMessage(destination_channel, 'messaggio di riempimento');
                        verifica_id_messaggi_mancanti += 1;
                        contatore_limite_messaggi += 1;
                    }
                    try {
                        await ctx.telegram.copyMessage( destination_channel, BACKUP_SERIE_3, currentFile );
                    } catch (err) {
                        console.error(err);
                        await ctx.telegram.sendMessage(destination_channel, 'messaggio di riempimento');
                        ctx.reply('‼️ <b>ERRORE</> ‼️\n\nSerie <b>"' + currentSerie.titolo + '"</> con un file mancante.',
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
                contatoreSerie += 1;
            }
        }
        if (!errore) {
            await ctx.reply('✅ *BACKUP EFFETTUATO* ✅\n\nMessaggi copiati: ' + contatoreMessaggi
                + '\nSerie copiate: ' + contatoreSerie,
                { parse_mode: 'Markdown', reply_markup: { inline_keyboard : [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        }
        await ctx.deleteMessage(message_backup_avviato.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
    }
}

// effettua il backup, in caso di riuscita risponde con il numero di messaggi e di serie copiati
exports.backup_serie_inizializzazione = async (ctx) => {
    ctx.session.tipoRicerca = '';
    const allSeries = await Serie.findAll_backup();
    if (allSeries.message) {
        await ctx.reply(allSeries.message, {reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        await ctx.deleteMessage(ctx.update.message.message_id - 1).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
        await ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
    } else {
        // tempo stimato = (id ultimo messaggio / 20 messaggi al minuto)/ 60 minuti in un'ora
        let tempo_stimato = allSeries.slice().reverse()[0].id_locandina / 20;
        tempo_stimato = Math.floor(tempo_stimato / 60) + ':' + Math.floor(tempo_stimato % 60 / 60);
        const message_backup_avviato = await ctx.reply('*BACKUP AVVIATO*\n\nTempo stimato: *' 
            + tempo_stimato + '* _Ore_', { parse_mode: 'Markdown' });
        await ctx.deleteMessage(ctx.update.message.message_id - 1).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
        await ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
        // contatore_limite_messaggi utilizzato come limitatore, è possibile inviare massimo un messaggio al secondo
        // ed in totale massimo 20 messaggi al minuto.
        let contatore_limite_messaggi = 0
        let contatoreMessaggi = 0;
        let contatoreSerie = 0;
        for (const currentSerie of allSeries) {
            // copia film da ... in poi
            if (allSeries.indexOf(currentSerie) >= 3929) {
                console.log(currentSerie.titolo);
                let nuovo_id_locandina = '';
                try {
                    nuovo_id_locandina = await ctx.telegram.copyMessage( SERIE_CHANNEL_ID, -1001285950663, currentSerie.id_locandina );
                } catch (err) {
                    console.error(err);
                    ctx.reply('‼️ <b>ERRORE</> ‼️\n\nSerie <b>"' + currentSerie.titolo + '"</> non trovata e non aggiunta.',
                        {parse_mode: 'HTML'});
                    continue;
                }
                let nuovo_id_locandina_public_channel = await ctx.telegram.copyMessage( PUBLIC_CHANNEL_SERIE,
                    -1001285950663, currentSerie.id_locandina, {
                        reply_markup: { inline_keyboard: [
                            [{ text: '🍿 Guarda Serie 🍿', url: 'https://t.me/provacanal_bot?start=SERIE' + currentSerie.id }]
                        ]}
                    });
                let nuovi_files_id = [];
                await ctx.telegram.copyMessage( BACKUP_SERIE_1, -1001285950663, currentSerie.id_locandina );
                await ctx.telegram.copyMessage( BACKUP_SERIE_2, -1001285950663, currentSerie.id_locandina );
                await ctx.telegram.copyMessage( BACKUP_SERIE_3, -1001285950663, currentSerie.id_locandina );
                contatoreMessaggi += 1;
                contatore_limite_messaggi += 1;
                if (contatore_limite_messaggi == 19) {
                    contatore_limite_messaggi = 0;
                    await sleep(40000);
                } else {
                    await sleep(1000);
                }
                for (const currentFile of currentSerie.files_messages_id) {
                    let nuovo_file_id = '';
                    try {
                        nuovo_file_id = await ctx.telegram.copyMessage( SERIE_CHANNEL_ID, -1001285950663, currentFile );
                    } catch (err) {
                        console.error(err);
                        ctx.reply('‼️ <b>ERRORE</> ‼️\n\nSerie <b>"' + currentSerie.titolo + '"</> con un file mancante.',
                            {parse_mode: 'HTML'});
                        continue;
                    }
                    nuovi_files_id.push(nuovo_file_id.message_id);
                    await ctx.telegram.copyMessage( BACKUP_SERIE_1, -1001285950663, currentFile );
                    await ctx.telegram.copyMessage( BACKUP_SERIE_2, -1001285950663, currentFile );
                    await ctx.telegram.copyMessage( BACKUP_SERIE_3, -1001285950663, currentFile );
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
                    await Serie.update(currentSerie.id, {id_locandina: nuovo_id_locandina.message_id,
                        id_locandina_public_channel: nuovo_id_locandina_public_channel, files_messages_id: nuovi_files_id});
                }
                contatoreSerie += 1;
            }
        }
        await ctx.reply('Backup effettuato.\nMessaggi copiati: ' + contatoreMessaggi + '\nSerie copiate: ' + contatoreSerie,
            { reply_markup: { inline_keyboard : [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        await ctx.deleteMessage(message_backup_avviato.message_id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
    }
}


/*          BACKUP CANALE PUBBLICO          */

// richiede all'admin di inserire l'id del canale su cui effettuare il backup del canale pubblico
exports.backup_serie_pubblico_richiesta = async (ctx) => {
    await ctx.reply('‼️ *BACKUP SERIE PUBBLICO* ‼️\n\nScrivi l\'id del canale su cui vuoi effettuare il backup delle locandine.'
        + '\n\n*IMPORTANTE: aggiungi 100 tra il meno e il primo numero*'
        + '\n\nEsempio:\n\n-1001393725644', { parse_mode: 'Markdown',
        reply_markup:  { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
    ctx.session.tipoRicerca = 'BACKUP_SERIE_PUBBLICO';
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
}

// effettua il backup delle locandine su un canale con id inserito dall'admin.
// in caso di riuscita risponde con il numero di messaggi e di film copiati
exports.backup_serie_pubblico = async (ctx) => {
    const destination_channel = ctx.update.message.text;
    ctx.session.tipoRicerca = '';
    const allSeries = await Serie.findAll_backup();
    if (allSeries.message) {
        await ctx.reply(allSeries.message, {reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]}});
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    } else {
        // tempo stimato = (id ultimo messaggio / 20 messaggi al minuto)/ 60 minuti in un'ora
        let tempo_stimato = allSeries.length / 20;
        tempo_stimato = Math.floor(tempo_stimato / 60) + ':' + Math.floor(tempo_stimato % 60 * 60);
        const message_backup_avviato = await ctx.reply('✅ *BACKUP AVVIATO* ✅\n\nTempo stimato: *' 
            + tempo_stimato + '* _Ore_', { parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[ Buttons.indietro('PANNELLO_ADMIN') ]]} });
        const id_messaggio = ctx.update.message.message_id - 1;
        try {
            await ctx.deleteMessage(id_messaggio).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        // contatore_limite_messaggi utilizzato come limitatore, è possibile inviare massimo un messaggio al secondo
        // ed in totale massimo 20 messaggi al minuto.
        let contatore_limite_messaggi = 0;
        let errore = false;
        for (const currentSerie of allSeries) {
            // invia locandina sul canale pubblico
            try {
                await ctx.telegram.copyMessage(destination_channel, BACKUP_SERIE_3, currentSerie.id_locandina,
                    {
                        parse_mode: 'HTML',
                        reply_markup: { 
                            inline_keyboard: [
                                [ {text: '🍿 Guarda Serie 🍿', url: 'https://t.me/SerietvFilms_Bot?start=SERIE' + currentSerie.id } ]
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
                ctx.reply('‼️ <b>ERRORE</> ‼️\n\nLocandina serie <b>"' + currentSerie.titolo + '"</> non trovata.',
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
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
    }
}


/*          ELIMINAZIONE SERIE           */

exports.pannello_elimina_serie = async (ctx) => {
    ctx.session.title = '';
    ctx.session.tipoRicerca = 'ADMIN_SERIE_ELIMINA'
    await ctx.reply('❌ *ELIMINA SERIE* ❌\n\nScrivi il titolo o parte del titolo della serie da *ELIMINARE*:', 
        { parse_mode:'Markdown', reply_markup: Menu.pannello_aggiungi_serie });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
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
    Serie.findAll('TITOLO', title, page).then(async (data) => {

        const series = data.series;

        let responseText = '';
        let arrayButtons = [];
        
        if (series.length > 0) {
            
            ({ responseText, arrayButtons } = creaTesto_Bottoni(series));

            // bottoni per la paginazione
            let paginationButtons = [];

            if (data.hasPrevPage) {
                paginationButtons.push({ text: '⬅️', callback_data: 'PREV_PAGE_ELIMINA_SERIE'});
            }
            if (data.hasNextPage) {
                paginationButtons.push({ text: '➡️', callback_data: 'NEXT_PAGE_ELIMINA_SERIE'});
            }
            if (paginationButtons.length > 0){
                arrayButtons.push(paginationButtons);
            }
        } else {
            responseText = 'Il titolo inserito non corrisponde a nessuna serie presente.';
        }
        arrayButtons.push([ Buttons.indietro('PANNELLO_ELIMINA_SERIE') ]);
        arrayButtons.push([ Buttons.pannello_HOME ]);

        ctx.replyWithHTML( responseText, {
            reply_markup: { inline_keyboard: arrayButtons } 
        });
        if (ctx.update.message) {
            const id_messaggio = ctx.update.message.message_id - 1;
            try {
                await ctx.deleteMessage(id_messaggio).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
            try {
                ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        } else if (ctx.update.callback_query) {
            await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        }
    })
}

// locandina serie scelta
exports.locandina_serie = async (ctx) => {
    const serieId = ctx.update.callback_query.data.split(' ')[1];

    Serie.findOne(serieId).then(async (serie) => {
        // elimina messaggio precedente
        // inoltra una copia del messaggio ( chat target, chat sorgente, id messaggio)
        await ctx.telegram.copyMessage( ctx.update.callback_query.message.chat.id, SERIE_CHANNEL_ID, serie.id_locandina,
            { reply_markup: Menu.pannello_dettagli_serie_elimina(serieId) });
        await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
    });
}

exports.elimina_serie = async (ctx) => {
    const serieId = ctx.update.callback_query.data.split(' ')[1];

    // rimuove il film dal db ed elimina tutti i messaggi relativi.
    Serie.delete(serieId).then(async (result) => {
        try {
            await ctx.telegram.deleteMessage(PUBLIC_CHANNEL_SERIE, result.id_locandina_public);
            ctx.answerCbQuery('✅ ELIMINATO ✅\n\nLa serie è stata cancellata correttamente.', {show_alert: true});
        } catch (err) {
            console.error(err);
            ctx.answerCbQuery('⚠️ ELIMINATO ⚠️\n\nLa serie è stata cancellata.\n'
                + 'La locandina è stata inviata più di 48 ore fa, quindi deve essere cancellata manualmente dal canale.', {show_alert: true});
        }
    }).catch(async (err) => {
        console.error(err);
        ctx.answerCbQuery('❌ ERRORE ❌\n\nSi è verificato un errore durante l\'eliminazione della serie.\nRIPROVARE.', {show_alert: true});
    });
    const stato_richieste = await Stato_richieste.requests_state();
    ctx.reply('Scegli una fottuta opzione prima che mi incazzi di brutto:',
        { reply_markup: await Menu.pannello_admin(stato_richieste, ctx.from.id) });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
    ctx.session.tipoRicerca = '';
}



/*          PROCEDURA AGGIUNTA SERIE         */

// --> pannello_admin || pannello_risultati_ricerca_film
exports.pannello_aggiungi_serie = async (ctx) => {
    ctx.session.title = '';
    ctx.session.tipoRicerca = 'ADMIN_SERIE_AGGIUNGI'
    await ctx.reply('➕ *AGGIUNGI SERIE* ➕\n\nScrivi il titolo o parte del titolo della serie da *AGGIUNGERE*:',
        { parse_mode:'Markdown', reply_markup: Menu.pannello_aggiungi_serie });
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
}

// --> pannello_aggiungi_film || pannello_crea_locandina || pannello_locandina_inviata || locandina_TMDB || pannello_invio_files (caso errore)
exports.pannello_risultati_ricerca_serie = async (ctx) => {
    try {
        // se !ctx.session.title significa che si è arrivati qui da pannelli successivi
        if (!ctx.session.title) {
            ctx.session.title = ctx.update.message.text;
        }
        // pulisco oggetti sessione
        ctx.session.serie = '';
        ctx.session.tipoRicerca = '';
        ctx.session.id_locandina = '';
        ctx.session.tipoDocumento = '';
        ctx.session.tipoFoto = '';

        Moviedb.searchSerieByTitle(ctx.session.title).then( async (series) => {
            
            let responseText = '';
            let arrayButtons = [];
            
            if (series.length > 0) {
                responseText = 'Clicca sul bottone corrispondente alla serie corretta:\n\n';
                let buttons = [];
                let contatore = 1;
                // crea il testo del messaggio e i bottoni
                series.forEach((currentSerie) => {
                    responseText += contatore + ' - ' + currentSerie.name;
                    responseText += currentSerie.first_air_date?  '  ('
                            + currentSerie.first_air_date.substring(0, 4)  + ')' + '\n' : '\n';
                    buttons.push({
                        text: contatore,
                        callback_data: 'ADMIN_LOCANDINA_TMDB_SERIE: ' + currentSerie.id
                    })
                    contatore += 1
                })

                responseText += '\n\n<i>Se la serie non è presente, crea manualmente la locandina.</>'
                
                // divide l'array buttons in più array di grandezza pari al secondo argomento
                arrayButtons = Array.from({ length: Math.ceil(buttons.length / 4) }, (v, i) =>
                        buttons.slice(i * 4, i * 4 + 4));
                arrayButtons.push([ Buttons.crea_locandina_serie ])
                arrayButtons.push([ Buttons.indietro('PANNELLO_AGGIUNGI_SERIE') ])
            } else {
                responseText = 'La serie cercata non è presente, creare manualmente la locandina:';
                arrayButtons = [
                    [ Buttons.crea_locandina_serie ],
                    [ Buttons.indietro('PANNELLO_AGGIUNGI_SERIE') ]
                ]
            }

            await ctx.replyWithHTML( responseText, {
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: arrayButtons } 
            });
            // elimina messaggio precedente
            if (ctx.update.message) {
                const id_messaggio = ctx.update.message.message_id - 1;
                try {
                    await ctx.deleteMessage(id_messaggio).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
                try {
                    ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                        console.error(err);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else if (ctx.update.callback_query) {
                await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                    console.error(err);
                });
            }
        });
    } catch (err) {
        console.log("ERRORE ADMIN RICERCA SERIE");
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
    await ctx.reply('Invia la locandina (immagine + testo) relativa alla serie, nel formato:\n\n'
        + 'titolo [Stagione ...]\n\n🎬Episodi: ..n_episodi..\n📆Anno: ...\n📚Genere: #... #...\n⭐️Voto: .../10\n\n🖋Trama: ...',
        { reply_markup: { inline_keyboard: [[Buttons.indietro('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_SERIE')]]}});
    ctx.session.tipoFoto = 'CREA_LOCANDINA_SERIE';
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
}

// risponde alla ricezione della locandina. salva message_id locandina ed estrae le informazioni del film
exports.pannello_locandina_inviata = async (ctx) => {
    ctx.session.id_locandina = ctx.update.message.message_id;
    try {
        const caption = ctx.update.message.caption.split('\n');
        
        if (isNaN(caption[3].split(': ')[1])) {
            const id_messaggio = ctx.update.message.message_id - 1;
            try {
                await ctx.deleteMessage(id_messaggio).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
            try {
                ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
            await ctx.replyWithHTML('❌ <b>ERRORE</> ❌\n\nLocandina non conforme, inviala nuovamente corretta.',
                {reply_markup: { inline_keyboard: [[{ text: '❌ Annulla ❌', callback_data: 'PANNELLO_ADMIN' }]]}});
        } else {
            const generi = caption[4].split(':')[1].split(' #');
            let generi_upper = []
            generi.splice(0, 1);
            generi.forEach(current => {
                current = current.charAt(0).toUpperCase() + current.slice(1);
                generi_upper.push(current);
            });
            ctx.session.serie = {
                title: caption[0],
                air_date: caption[3].split(': ')[1],
                genres: generi_upper,
                vote_average: caption[5].split(': ')[1].split('/')[0]
            }
            ctx.session.tipoFoto = '';
            ctx.session.tipoDocumento = 'FILE_SERIE';
            ctx.session.locandina_TMDB = false;
            await ctx.reply('La locandina inviata è corretta?\n\n_se non è corretta modificala e premi_  '
            + '*"Conferma locandina"*\n\n_oppure torna indietro_', { parse_mode: 'Markdown',
            reply_markup: {
                    inline_keyboard: [
                        [{ text: "✅ Conferma locandina ✅", callback_data: 'PANNELLO_INVIO_FILES_SERIE' }],
                        [ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_SERIE') ]
                    ]
                }
            });
            try {
                await ctx.deleteMessage(ctx.update.message.message_id - 1).catch((err) => {
                    console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
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
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        try {
            ctx.deleteMessage(ctx.update.message.message_id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
        await ctx.replyWithHTML('❌ <b>ERRORE</> ❌\n\nLocandina non conforme, inviala nuovamente corretta.',
            {reply_markup: { inline_keyboard: [[{ text: '❌ Annulla ❌', callback_data: 'PANNELLO_ADMIN' }]]}});
    }
}

// mostra locandina creata con info di TMDB
exports.locandina_TMDB = async (ctx) => {
    try {

        // se il film è salvato nella sessione, non rifaccio la ricerca
        if (!ctx.session.serie) {
            const serieId = ctx.update.callback_query.data.split(' ')[1];
            const serie = await Moviedb.searchSerieById(serieId);
            ctx.session.serie = serie;
            ctx.session.currentSeason = 0;
        }
        let seasonsButtons = [];
        // crea i bottoni relativi alle varie stagioni della serie
        ctx.session.serie.seasons.forEach((currentSeason) => {
            seasonsButtons.push({
                text: currentSeason.season_number,
                callback_data: 'ADMIN_LOCANDINA_TMDB_SERIE_STAGIONE: ' + ctx.session.serie.seasons.indexOf(currentSeason)
            });
        });
    
        seasonsButtons = Array.from({ length: Math.ceil(seasonsButtons.length / 4) }, (v, i) =>
                seasonsButtons.slice(i * 4, i * 4 + 4));
    
        seasonsButtons.push([{ text: "✅ Conferma locandina ✅", callback_data: 'PANNELLO_INVIO_FILES_SERIE' }]);
        seasonsButtons.push([ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_SERIE') ]);
    
        // se esiste un'immagine in TMDB invia locandina con immagine, altrimenti invia locandina senza immagine
        if (ctx.session.serie.seasons[ctx.session.currentSeason] && ctx.session.serie.seasons[ctx.session.currentSeason].poster_path) {
            const image_url = 'https://image.tmdb.org/t/p/w500' + ctx.session.serie.seasons[ctx.session.currentSeason].poster_path;
            await ctx.replyWithPhoto( { url: image_url },
                { caption: creaCaptionSeason(ctx.session.serie, ctx.session.currentSeason), parse_mode: 'HTML',
                reply_markup: {
                        inline_keyboard: seasonsButtons
                    }
                }
            )
        } else if (ctx.session.serie.poster_path) {
            const image_url = 'https://image.tmdb.org/t/p/w500' + ctx.session.serie.poster_path;
            await ctx.replyWithPhoto( { url: image_url },
                { caption: creaCaptionSeason(ctx.session.serie, ctx.session.currentSeason), parse_mode: 'HTML',
                reply_markup: {
                        inline_keyboard: seasonsButtons
                    }
                }
            )
        } else {
            await ctx.reply(creaCaptionSeason(ctx.session.serie, ctx.session.currentSeason), { parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "✅ Conferma locandina ✅", callback_data: 'PANNELLO_INVIO_FILES_SERIE' }],
                        [ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_AGGIUNGI_SERIE') ]
                    ]
                }
            })
        }
        ctx.session.tipoDocumento = 'FILE_SERIE';
        ctx.session.locandina_TMDB = true;
        // elimina messaggio precedente
        ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
    } catch {
        ctx.session.serie = '';
        ctx.answerCbQuery('❌ ERRORE ❌\n\nLocandina non disponibile', {show_alert: true});
    }
}

// salva il film nel db e in caso di riuscita richiede l'invio dei files relativi
// in caso di errore rimanda alla locandina
exports.pannello_invio_files = async (ctx) => {

    let serie = ctx.session.serie;
    let season = ctx.session.currentSeason ? ctx.session.currentSeason : '';
    let message = '';
    
    try {
        // se non ho la locandina di TMDB...
        if (ctx.session.id_locandina) {
            // inoltra sul canale la locandina inviata dall'admin
            message = await ctx.telegram.copyMessage(SERIE_CHANNEL_ID, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.telegram.copyMessage(BACKUP_SERIE_1, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.telegram.copyMessage(BACKUP_SERIE_2, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.telegram.copyMessage(BACKUP_SERIE_3, ctx.update.callback_query.message.chat.id, ctx.session.id_locandina);
            await ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } else {
            if (serie.seasons && serie.seasons[season]) {
                const image_url = 'https://image.tmdb.org/t/p/w500' + (serie.seasons[season].poster_path ? 
                    serie.seasons[season].poster_path : serie.poster_path);

                message = await ctx.telegram.sendPhoto(SERIE_CHANNEL_ID, { url: image_url },
                    { caption: creaCaptionSeason(serie, season), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_SERIE_1, { url: image_url },
                    { caption: creaCaptionSeason(serie, season), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_SERIE_2, { url: image_url },
                    { caption: creaCaptionSeason(serie, season), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_SERIE_3, { url: image_url },
                    { caption: creaCaptionSeason(serie, season), parse_mode: 'HTML'});
            } else if (serie.poster_path) {
                const image_url = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
            
                message = await ctx.telegram.sendPhoto(SERIE_CHANNEL_ID, { url: image_url },
                    { caption: creaCaption(serie, season), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_SERIE_1, { url: image_url },
                    { caption: creaCaption(serie, season), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_SERIE_2, { url: image_url },
                    { caption: creaCaption(serie, season), parse_mode: 'HTML'});
                await ctx.telegram.sendPhoto(BACKUP_SERIE_3, { url: image_url },
                    { caption: creaCaption(serie, season), parse_mode: 'HTML'});
            } else {
                message = await ctx.telegram.sendMessage(SERIE_CHANNEL_ID, creaCaption(serie, season), { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(BACKUP_SERIE_1, creaCaption(serie, season), { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(BACKUP_SERIE_2, creaCaption(serie, season), { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(BACKUP_SERIE_3, creaCaption(serie, season), { parse_mode: 'HTML' });
            }
        }

        // salva id della locandina nel canale principale per inoltrarla poi nel canale pubblico a fine procedura
        ctx.session.id_locandina_canale = message.message_id;
        ctx.session.files_messages_id = [];

        ctx.reply('Invia i files relativi alla serie...\n\n_quando hai finito premi "Fine"_', {
            parse_mode: 'Markdown', 
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✅ FINE ✅", callback_data: 'PANNELLO_FINE_AGGIUNTA_SERIE' }],
                    [{ text: "❌ ANNULLA ❌", callback_data: 'PANNELLO_FINE_AGGIUNTA_ERRORE_SERIE' }]
                ]
            } 
        });
    } catch (e) {
        console.error(e);
        // in caso di errore cancella il messaggio contenente la locandina dal canale
        ctx.telegram.deleteMessage(SERIE_CHANNEL_ID, message.message_id);
        ctx.telegram.deleteMessage(BACKUP_SERIE_1, message.message_id);
        ctx.telegram.deleteMessage(BACKUP_SERIE_2, message.message_id);
        ctx.telegram.deleteMessage(BACKUP_SERIE_3, message.message_id);
        ctx.reply('❌ ERRORE ❌\n\nSi è verificato un errore, riprovare', { 
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Riprova", callback_data: 'PANNELLO_RISULTATI_RICERCA_AGGIUNGI_SERIE' }]
                ]
            } 
        });
    }
    await ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
}

exports.pannello_ricezione_files = async (ctx) => {
    ctx.session.files_messages_id.push(ctx.update.message.message_id);
    console.log(ctx.session.files_messages_id);
}

// in caso di fine con errore cancella il film dal db e i messaggi relativi nel canale
exports.pannello_fine_con_errore = async (ctx) => {
    ctx.telegram.deleteMessage(SERIE_CHANNEL_ID, ctx.session.id_locandina_canale);
    ctx.telegram.deleteMessage(BACKUP_SERIE_1, ctx.session.id_locandina_canale);
    ctx.telegram.deleteMessage(BACKUP_SERIE_2, ctx.session.id_locandina_canale);
    ctx.telegram.deleteMessage(BACKUP_SERIE_3, ctx.session.id_locandina_canale);
    if (ctx.session.files_messages_id) {
        ctx.session.files_messages_id.forEach((currentFile) => {
            ctx.deleteMessage(currentFile);
        })
    }
    const stato_richieste = await Stato_richieste.requests_state();
    await ctx.reply('🕵️‍♂️ *ADMIN MODE* 🕵️‍♂️\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'Markdown', reply_markup: await Menu.pannello_admin(stato_richieste, ctx.from.id) });
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
    azzeraSession();
}

// inoltra la locandina nel canale pubblico
exports.pannello_fine_corretta = async (ctx) => {
    ctx.answerCbQuery('⚠️ ATTENDI ⚠️\n\nAspetta che spariscano dalla chat tutti i file che hai inviato.', {show_alert: true});

    console.log(ctx.session.files_messages_id);

    let backup_channels = [BACKUP_SERIE_1, BACKUP_SERIE_2, BACKUP_SERIE_3];
    let contatore_limite_messaggi = 0;
    let messages_id_channel = [];
    for (const currentFile of ctx.session.files_messages_id) {
        const message = await ctx.telegram.copyMessage(SERIE_CHANNEL_ID,
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
            console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
            console.error(err);
        });
    }

    const serie = await Serie.create(ctx.session.serie, ctx.session.currentSeason,
        ctx.session.id_locandina_canale, messages_id_channel, ctx.session.locandina_TMDB);

    // invia locandina sul canale pubblico
    const id_canale_pubblico = await ctx.telegram.copyMessage(PUBLIC_CHANNEL_SERIE, SERIE_CHANNEL_ID, 
        ctx.session.id_locandina_canale,
        {   parse_mode: 'HTML',
            reply_markup: { inline_keyboard: [
                    [{ text: '🍿 Guarda Serie 🍿', url: 'https://t.me/SerietvFilms_Bot?start=SERIE' + serie.id }]
                ]
            }
        });
    
    Serie.update(serie.id, {id_locandina_public: id_canale_pubblico.message_id});

    const stato_richieste = await Stato_richieste.requests_state();
    await ctx.reply('🕵️‍♂️ *ADMIN MODE* 🕵️‍♂️\n\nScegli una fottuta opzione prima che mi incazzi di brutto:',
        { parse_mode: 'Markdown', reply_markup: await Menu.pannello_admin(stato_richieste, ctx.from.id) });
    azzeraSession(ctx);
    ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
        console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
        console.error(err);
    });
}


/*          RISPOSTA RICHIESTE          */

// admin accetta la richiesta e viene inviato un messaggio all'utente che l'ha effettuata
exports.risposta_richiesta = async (ctx, risposta) => {
    let response_message = '';
    let request_result = '';
    let message = '';

    if (ctx.update.callback_query.message.text) {
        message = ctx.update.callback_query.message.text.split('\n');
    } else {
        message = ctx.update.callback_query.message.caption.split('\n');
    }
    const user_chat_id = message[0].split('[')[1].split(']')[0];
    const titolo = message[3];

    const user = await User.findOne(user_chat_id);
    user.ammonizioni = user.ammonizioni ? user.ammonizioni : 0;
    const user_username = user.username ? '@' + user.username : '';


    switch (risposta) {
        case 'accettata': response_message = `✅ La tua richiesta è stata <b>ACCETTATA</>.\n\nLa serie <b>'${titolo}'</>`
            + ` è ora disponibile tramite il nostro bot.`
            request_result = '✅ Risposta <b>\'ACCETTATA\'</> da: ';
            break;
        case 'non_trovata': response_message = `❌ La tua richiesta per la serie <b>'${titolo}'</> è stata <b>RIFIUTATA</>.\n`
            + `Non siamo riusciti a trovarla.`;
            request_result = '❌ Risposta <b>\'SERIE NON TROVATA\'</> da: ';
            break;
        case 'postata':
            if (user.ammonizioni == 2) {
                user.ammonizioni += 1;
                response_message = `❌ Abbiamo già postato la serie: <b>'${titolo}'</>\n\n`
                    + '‼️<b>AMMONITO</>‼️\n\nQuesta è la tua terza ammonizione, d\'ora in poi non potrai più fare richieste per un mese.';
            } else {
                user.ammonizioni += 1;
                response_message = `❌ Abbiamo già postato la serie: <b>'${titolo}'</>\n\n`
                    + '‼️<b>AMMONITO</>‼️\nControlla se la serie è presente sul canale prima di richiederla.\n\n' 
                    + '<i>Alla terza ammonizione ti verrà revocata per un mese la possibilità di fare richieste.</>\n\n'
                    + `<i>Ammonizioni attuali: ${user.ammonizioni}/3</>`;
            }
            request_result = '❌ Risposta <b>\'GIÀ POSTATA\'</> da: ';
            User.update(user_chat_id, { ammonizioni: user.ammonizioni });
            break;
        case 'mai_uscita':
            response_message = `❌ La tua richiesta per la serie <b>'${titolo}'</> è stata <b>RIFIUTATA</>.`
                + ` La serie non è mai uscita in italia.\n\n`
            if (user.ammonizioni == 2) {
                user.ammonizioni += 1;
                response_message += '‼️<b>AMMONITO</>‼️\n\nQuesta è la tua terza ammonizione, d\'ora in poi non potrai più fare richieste per un mese.';
            } else {
                user.ammonizioni += 1;
                response_message += '‼️<b>AMMONITO</>‼️\nSul nostro canale è vietato richiedere serie mai uscite in Italia.\n\n'
                    + '<i>Alla terza ammonizione ti verrà revocata per un mese la possibilità di fare richieste.</>\n\n'
                    + `<i>Ammonizioni attuali: ${user.ammonizioni}/3</>`;
            }
            request_result = '❌ Risposta <b>\'MAI USCITO\'</> da: ';
            User.update(user_chat_id, { ammonizioni: user.ammonizioni });
            break;
        case 'in_corso':
            response_message = `❌ La tua richiesta per la serie <b>'${titolo}'</> è stata <b>RIFIUTATA</>.`
                + ` La serie è ancora in corso.\n\n`
            if (user.ammonizioni == 2) {
                user.ammonizioni += 1;
                response_message += '‼️<b>AMMONITO</>‼️\n\nQuesta è la tua terza ammonizione, d\'ora in poi non potrai più fare richieste per un mese.';
            } else {
                user.ammonizioni += 1;
                response_message += '‼️<b>AMMONITO</>‼️\nSul nostro canale è vietato richiedere serie ancora in corso.\n\n'
                    + '<i>Alla terza ammonizione ti verrà revocata per un mese la possibilità di fare richieste.</>\n\n'
                    + `<i>Ammonizioni attuali: ${user.ammonizioni}/3</>`;
            }
            request_result = '❌ Risposta <b>\'IN CORSO\'</> da: ';
            User.update(user_chat_id, { ammonizioni: user.ammonizioni });
            break;
        case 'errata': response_message = `❌ La tua richiesta per la serie <b>'${titolo}'</> è stata <b>RIFIUTATA</>.\n`
            + `La richiesta è stata effettuata in modo errato. Leggi bene le regole riguardanti le richieste.`;
            request_result = '❌ Risposta <b>\'RICHIESTA ERRATA\'</> da: ';
            break;
        case 'sky': response_message = `✅ La serie <b>'${titolo}'</> è una serie SKY original.\n`
            + `La puoi trovare nel canale serie sky original cliccando sul bottone apposito nel menu serie.`;
            request_result = '❌ Risposta <b>\'SERIE SKY ORIGINAL\'</> da: ';
            break;
    }

    // in caso di pressione sul bottone 'presa in carico' viene modificato quel pulsante inserendoci l'username dell'admin
    if (risposta == 'presa_in_carico') {
        try {
            ctx.editMessageReplyMarkup(Menu.pannello_richiesta_presa_in_carico_serie(ctx.from.username));
        } catch (err) {
            console.error(err);
        }
    } else {
        ctx.telegram.sendMessage(user_chat_id, response_message, { parse_mode: 'HTML',
            reply_markup: { inline_keyboard: [[ {text: '✅ OK ✅', callback_data: 'RISPOSTA_RICHIESTA_RICEVUTA'} ]]} });
        ctx.reply(request_result + ( ctx.from.username ? '@' + ctx.from.username : ctx.from.first_name )
            + '\n\n' + 'Richiesta da: ' + user_username + ' [' + user_chat_id + ']\n\nSerie:\n' + titolo, {parse_mode: 'HTML'});
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.id).catch((err) => {
                console.log("ERRORE DELETE MESSAGE ADMIN SERIE");
                console.error(err);
            });
        } catch (err) {
            console.error(err);
            ctx.answerCbQuery('Richiesta ricevuta da più di 48 ore. Cancella manualmente il messaggio.', {show_alert: true});
        }
    }
             
}


/*          FUNZIONI AUSILIARIE         */

// crea testo per i risultati ricerca film
const creaTesto_Bottoni = (series) => {
    let responseText = '🔎 Clicca sul bottone corrispondente alla serie che vuoi <b>ELIMINARE</>:\n\n';
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
            callback_data: 'DETTAGLI_SERIE_ELIMINAZIONE: ' + currentSerie.id
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

// funzione per creare la descrizione della locandina per serie che non hanno l'attributo seasons
const creaCaption = (movie) => {
    let Genere = '';
    if (movie.genres.length > 0) {
        Genere = '📚Genere:';
        movie.genres.forEach(currentGenere => {
            Genere = Genere + ' #' + currentGenere.name
        });
        Genere = Genere + '\n'
    }
    const Titolo = '\n<b>' + movie.name + '</>\n\n';
    const Regista = movie.director? '🎬Regista: ' + movie.director + '\n' : '';
    const Episodi = movie.episode_count? '🎬Episodi: ' + movie.episode_count + '\n' : '';
    const Anno = movie.first_air_date? '📆Anno: ' + movie.first_air_date.substring(0, 4) + '\n' : '';
    const Voto = movie.vote_average? '⭐️Voto: ' + movie.vote_average + '/10\n' : '';
    const Trama = '\n🖋Trama e info: ' + '<a href="https://www.themoviedb.org/tv/' + movie.id
        + '?language=it-IT">[CLICCA QUI]</>' + '\n';
    const Trailer = movie.trailer? '🎞Trailer: ' + movie.trailer : '';

    return `${Titolo}${Episodi}${Regista}${Anno}${Genere}${Voto}${Trama}${Trailer}`;
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
    const Stagione = movie.seasons[season]? '[' + movie.seasons[season].name + ']' : '';
    const Titolo = '\n<b>' + movie.name + ' ' + Stagione + '</>\n\n';
    const Regista = movie.director? '🎬Regista: ' + movie.director + '\n' : '';
    const Episodi = movie.seasons[season]? '🎬Episodi: ' + movie.seasons[season].episode_count + '\n' : '';
    const Anno = movie.seasons[season].air_date? '📆Anno: ' + movie.seasons[season].air_date.substring(0, 4) + '\n' : '';
    const Voto = movie.vote_average? '⭐️Voto: ' + movie.vote_average + '/10\n' : '';
    const Trama = '\n🖋Trama e info: ' + '<a href="https://www.themoviedb.org/tv/' + movie.id + '/season/'
                + movie.seasons[season].season_number + '?language=it-IT">[CLICCA QUI]</>' + '\n';
    const Trailer = movie.trailer? '🎞Trailer: ' + movie.trailer : '';

    return `${Titolo}${Episodi}${Regista}${Anno}${Genere}${Voto}${Trama}${Trailer}`;
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