module.exports = {
    // ogni bottone è chiamato con il nome del pannello a cui indirizza la navigazione

    /*          ADMINS          */

    pannello_admin: {
        text: '🕵️‍♂️ Admin MODE 🕵️‍♂️',
        callback_data: 'PANNELLO_ADMIN'
    },
    avvia_backup_film: {
        text: '‼️ Backup FILM ‼️',
        callback_data: 'BACKUP_FILM'
    },
    backup_film_pubblico: {
        text: '‼️ Backup FILM PUBBLICO ‼️',
        callback_data: 'BACKUP_FILM_PUBBLICO'
    },
    avvia_backup_serie: {
        text: '‼️ Backup SERIE ‼️',
        callback_data: 'BACKUP_SERIE'
    },
    backup_serie_pubblico: {
        text: '‼️ Backup SERIE PUBBLICO ‼️',
        callback_data: 'BACKUP_SERIE_PUBBLICO'
    },
    fine_gestione_utente: { 
        text: '✅ ok ✅',
        callback_data: 'PANNELLO_GESTIONE_UTENTI'
    },
    cambia_stato_richieste (stato_corrente) {
        if (stato_corrente) {
            return {
                text: '📫 Chiudi richieste 📫',
                callback_data: 'CHIUDI_RICHIESTE'
            }
        } else {
            return {
                text: '📭 Apri richieste 📭',
                callback_data: 'APRI_RICHIESTE'
            }
        }
        
    },
    pannello_aggiungi_film: {
        text: '➕ Aggiungi Film ➕',
        callback_data: 'PANNELLO_AGGIUNGI_FILM'
    },
    pannello_aggiungi_serie: {
        text: '➕ Aggiungi Serie ➕',
        callback_data: 'PANNELLO_AGGIUNGI_SERIE'
    },
    pannello_elimina_film: {
        text: '❌ Elimina Film ❌',
        callback_data: 'PANNELLO_ELIMINA_FILM'
    },
    pannello_elimina_serie: {
        text: '❌ Elimina Serie ❌',
        callback_data: 'PANNELLO_ELIMINA_SERIE'
    },

    crea_locandina: { 
        text: "📝 Crea locandina 📝",
        callback_data: 'PANNELLO_CREA_LOCANDINA'
    },
    crea_locandina_serie: { 
        text: "📝 Crea locandina 📝",
        callback_data: 'PANNELLO_CREA_LOCANDINA_SERIE'
    },

    elimina_film(movie_id) {
        return {
            text: '❌ Elimina Film ❌',
            callback_data: 'ELIMINA_FILM: ' + movie_id
        }
    },
    elimina_serie(serie_id) {
        return {
            text: '❌ Elimina Serie ❌',
            callback_data: 'ELIMINA_SERIE: ' + serie_id
        }
    },

    /*           UTENTI - FILM          */

    pannello_HOME: {
        text: '🏠 Torna alla home 🏠',
        callback_data: 'PANNELLO_BENVENUTO'
    },
    pannello_film: {
        text: "🍿 Film 🍿",
        callback_data: 'PANNELLO_FILM'
    },
    pannello_ricerca_film_titolo: {
        text: "🔎 Titolo 🔎",
        callback_data: 'PANNELLO_RICERCA_FILM_TITOLO'
    },
    pannello_ricerca_film_genere: {
        text: "📚 Genere 📚",
        callback_data: 'PANNELLO_RICERCA_FILM_GENERE'
    },
    pannello_ricerca_film_lettera: {
        text: "🔠 A - Z 🔠",
        callback_data: 'PANNELLO_RICERCA_FILM_LETTERA'
    },
    pannello_ricerca_film_anno: {
        text: "📆 Anno 📆",
        callback_data: 'PANNELLO_RICERCA_FILM_ANNO'
    },
    pannello_risultati_film_più_votati: {
        text: "⭐️ Più votati ⭐️",
        callback_data: 'RISULTATI_FILM_PIÙ_VOTATI'
    },
    pannello_risultati_film_random: {
        text: "🎲 Random 🎲",
        callback_data: 'RISULTATI_FILM_RANDOM'
    },
    pannello_file_film: {
        text: "🍿 Guarda Film 🍿",
        callback_data: 'PANNELLO_FILE_FILM'
    },

    /*          UTENTI - SERIE TV           */

    pannello_serie_tv: {
        text: "📺 Serie tv 📺",
        callback_data: 'PANNELLO_SERIE_TV'
    },
    pannello_ricerca_serie_titolo: {
        text: "🔎 Titolo 🔎",
        callback_data: 'PANNELLO_RICERCA_SERIE_TITOLO'
    },
    pannello_ricerca_serie_genere: {
        text: "📚 Genere 📚",
        callback_data: 'PANNELLO_RICERCA_SERIE_GENERE'
    },
    pannello_ricerca_serie_lettera: {
        text: "🔠 A - Z 🔠",
        callback_data: 'PANNELLO_RICERCA_SERIE_LETTERA'
    },
    pannello_ricerca_serie_anno: {
        text: "📆 Anno 📆",
        callback_data: 'PANNELLO_RICERCA_SERIE_ANNO'
    },
    pannello_risultati_serie_più_votate: {
        text: "⭐️ Più votati ⭐️",
        callback_data: 'RISULTATI_SERIE_PIÙ_VOTATE'
    },
    pannello_risultati_serie_random: {
        text: "🎲 Random 🎲",
        callback_data: 'RISULTATI_SERIE_RANDOM'
    },
    pannello_file_serie: {
        text: "🍿 Guarda Serie 🍿",
        callback_data: 'PANNELLO_FILE_SERIE'
    },

    /*          UTENTI - RICHIESTE           */

    pannello_richieste_film: {
        text: "📨 Richiedi Film 📨",
        callback_data: 'PANNELLO_RICHIESTE'
    },

    pannello_richieste_serie: {
        text: "📨 Richiedi Serie 📨",
        callback_data: 'PANNELLO_RICHIESTA_SERIE'
    },

    pannello_richieste: {
        text: "📨  Richieste  📨",
        callback_data: 'PANNELLO_RICHIESTE'
    },

    richiedi_film: {
        text: "🎬 Film 🎬",
        callback_data: 'PANNELLO_RICHIESTA_FILM'
    },

    richiedi_film_sub_ita: {
        text: "🇺🇸  Film [SUB-ITA] 🇯🇵",
        callback_data: 'PANNELLO_RICHIESTA_FILM_SUB_ITA'
    },

    richiedi_serie: {
        text: "📺 Serie tv 📺",
        callback_data: 'PANNELLO_RICHIESTA_SERIE'
    },


    indietro (callback_data) {
        return {
            text: "🔙 Indietro 🔙",
            callback_data: callback_data
        }
    }
}

