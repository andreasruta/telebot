const Buttons = require("./buttons");
const Admin = require("../controllers/admin.controller");
const { Markup } = require('telegraf');

module.exports = {

    /*          SUPER ADMIN         */

    pannello_super_admin: {
        "one_time_keyboard": true,
        inline_keyboard: [
            [ { text: '➕ Aggiungi Admin ➕', callback_data: 'PANNELLO_AGGIUNGI_ADMIN'}],
            [ { text: '❌ Elimina Admin ❌', callback_data: 'PANNELLO_ELIMINA_ADMIN'}],
            [ Buttons.indietro('PANNELLO_ADMIN') ]
        ]
    },

    /*          ADMIN           */

    pannello_benvenuto_admin: {
        "one_time_keyboard": true,
        inline_keyboard: [
            [ 
                Buttons.pannello_film,
                Buttons.pannello_serie_tv
            ],
            [ Buttons.pannello_admin ],
            [ Buttons.pannello_richieste ],
            [
                { text: '🤝 Sponsor 🤝', callback_data: 'PANNELLO_SPONSOR' },
                { text: '🎁 Donazioni 🎁', callback_data: 'PANNELLO_DONAZIONI' }
            ],
            [{ text: '📽 Discussioni Film e Serie TV 🎬', url: 'https://t.me/gliamicidelparchetto' }],
            [{ text: '⁉️ Ho bisogno di aiuto ⁉️', callback_data: 'PANNELLO_AIUTO' }]
        ]
    },
    async pannello_admin(stato_richieste, chat_id) {
        const admin = await Admin.findOne(chat_id);
        if (admin.super_admin) {
            return {
                inline_keyboard: [
                    [ { text: '🦸‍♂️ Super Admin 🦸‍♂️', callback_data: 'PANNELLO_SUPER_ADMIN' }],
                    [ { text: '📊 Statistiche 📊', callback_data: 'PANNELLO_STATISTICHE' }],
                    [ 
                        { text: '🍿 Film 🍿', callback_data: 'PANNELLO_FILM_ADMIN' },
                        { text: '📺 Serie 📺', callback_data: 'PANNELLO_SERIE_ADMIN' }
                    ],
                    [ 
                        { text: '🧙‍♂️ Gestione utenti 🧙‍♂️', callback_data: 'PANNELLO_GESTIONE_UTENTI' },
                    ],
                    [ 
                        { text: '🗞 Riepilogo aggiunte 🗞', callback_data: 'INVIA_RIEPILOGO_GIORNATA' },
                    ],
                    [ Buttons.cambia_stato_richieste(stato_richieste) ],
                    [ Buttons.indietro('PANNELLO_BENVENUTO') ]
                ]
            }
        } else {
            return {
                inline_keyboard: [
                    [ { text: '📊 Statistiche 📊', callback_data: 'PANNELLO_STATISTICHE' }],
                    [ 
                        { text: '🍿 Film 🍿', callback_data: 'PANNELLO_FILM_ADMIN' },
                        { text: '📺 Serie 📺', callback_data: 'PANNELLO_SERIE_ADMIN' }
                    ],
                    [ 
                        { text: '🧙‍♂️ Gestione utenti 🧙‍♂️', callback_data: 'PANNELLO_GESTIONE_UTENTI' },
                    ],
                    [ 
                        { text: '🗞 Riepilogo aggiunte 🗞', callback_data: 'INVIA_RIEPILOGO_GIORNATA' },
                    ],
                    [ Buttons.cambia_stato_richieste(stato_richieste) ],
                    [ Buttons.indietro('PANNELLO_BENVENUTO') ]
                ]
            }
        }
        
    },

    /*          GESTIONE UTENTI         */

    pannello_gestione_utenti: {
        inline_keyboard: [
            [ { text: '🧞‍♂️ Azzera WARN 🧞‍♂️', callback_data: 'PANNELLO_AZZERA_WARN'}],
            [ { text: '⛑ Togli 1 WARN ⛑', callback_data: 'PANNELLO_DIMINUISCI_WARN'}],
            [ { text: '👻 Sbanna utente 👻', callback_data: 'PANNELLO_UNBAN_UTENTE'}],
            [ { text: '🖕🏻 Banna utente 🖕🏻', callback_data: 'PANNELLO_BANNA_UTENTE' } ],
            [ Buttons.indietro('PANNELLO_ADMIN') ]
        ]
    },

    /*          FILM E SERIE            */

    pannello_film_admin: {
        inline_keyboard: [
            [ Buttons.avvia_backup_film ],
            [ Buttons.pannello_aggiungi_film ],
            [ Buttons.pannello_elimina_film ],
            [ Buttons.backup_film_pubblico ],
            [ Buttons.indietro('PANNELLO_ADMIN') ]
        ]
    },
    pannello_serie_admin: {
        inline_keyboard: [
            [ Buttons.avvia_backup_serie ],
            [ Buttons.pannello_aggiungi_serie ],
            [ Buttons.pannello_elimina_serie ],
            [ Buttons.backup_serie_pubblico ],
            [ Buttons.indietro('PANNELLO_ADMIN') ]
        ]
    },
    pannello_aggiungi_film: {
        inline_keyboard: [
            [ Buttons.indietro('PANNELLO_FILM_ADMIN') ]
        ]
    },
    pannello_aggiungi_serie: {
        inline_keyboard: [
            [ Buttons.indietro('PANNELLO_SERIE_ADMIN') ]
        ]
    },
    pannello_dettagli_film_elimina(movie_id) {
        return {
            inline_keyboard: [
                [ Buttons.elimina_film(movie_id) ],
                [ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_ELIMINA') ],
                [ Buttons.pannello_HOME ]
            ]
        }
    },
    pannello_dettagli_serie_elimina(serie_id) {
        return {
            inline_keyboard: [
                [ Buttons.elimina_serie(serie_id) ],
                [ Buttons.indietro('PANNELLO_RISULTATI_RICERCA_ELIMINA_SERIE') ],
                [ Buttons.pannello_HOME ]
            ]
        }
    },


    /*          ADMIN - RICHIESTE          */
    
    pannello_richiesta_presa_in_carico(username_admin) {
        return {
            inline_keyboard: [
                [
                    { text: '✅Accetta', callback_data: 'RICHIESTA_ACCETTATA' },
                    { text: '❌Non trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
                ],
                [
                    { text: '📬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                    { text: '🇮🇹Mai uscito in italia', callback_data: 'RICHIESTA_MAI_USCITO'}
                ],
                [
                    { text: '⏰Appena uscito', callback_data: 'RICHIESTA_APPENA_USCITO'},
                    { text: '⚠️ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
                ],
                [
                    { text: '🟢' + username_admin + '🟢', callback_data: 'VUOTO'}
                ]
            ]
        }
    },

    pannello_richiesta_presa_in_carico_sub_ita(username_admin) {
        return {
            inline_keyboard: [
                [
                    { text: '✅Accetta', callback_data: 'RICHIESTA_ACCETTATA' },
                    { text: '❌Non trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
                ],
                [
                    { text: '📬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                    { text: '⚠️ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
                ],
                [
                    { text: '🟢' + username_admin + '🟢', callback_data: 'VUOTO'}
                ]
            ]
        }
    },

    pannello_richiesta_presa_in_carico_serie(username_admin) {
        return {
            inline_keyboard: [
                [
                    { text: '✅Accetta', callback_data: 'RICHIESTA_ACCETTATA_SERIE' },
                    { text: '❌Non trovata', callback_data: 'RICHIESTA_NON_TROVATO_SERIE'}
                ],
                [
                    { text: '📬Postata in precedenza', callback_data: 'RICHIESTA_POSTATO_SERIE'},
                    { text: '🇮🇹Mai uscita in italia', callback_data: 'RICHIESTA_MAI_USCITO_SERIE'}
                ],
                [
                    { text: '🏗 Serie ancora in corso', callback_data: 'RICHIESTA_IN_CORSO_SERIE'},
                    { text: '⚠️ Richiesta errata', callback_data: 'RICHIESTA_ERRATA_SERIE'}
                ],
                [{ text: '☁️ Serie SKY', callback_data: 'RICHIESTA_SERIE_SKY' }],
                [
                    { text: '🟢' + username_admin + '🟢', callback_data: 'VUOTO'}
                ]
            ]
        }
    },

    /*          UTENTI - HOME           */

        pannello_benvenuto: {
        "one_time_keyboard": true,
        inline_keyboard: [
            [ 
                Buttons.pannello_film,
                Buttons.pannello_serie_tv
            ],
            [ Buttons.pannello_richieste ],
            [{ text: '🤝 Sponsor 🤝', callback_data: 'PANNELLO_SPONSOR' }],
            [{ text: '🎁 Donazioni 🎁', callback_data: 'PANNELLO_DONAZIONI' }],
            [{ text: '📽 Discussioni Film e Serie TV 🎬', url: 'https://t.me/gliamicidelparchetto' }],
            [{ text: '⁉️ Ho bisogno di aiuto ⁉️', callback_data: 'PANNELLO_AIUTO' }]
        ]
    },


    /*          UTENTI - FILM          */

    pannello_film: {
        inline_keyboard: [
            [ Buttons.pannello_ricerca_film_titolo, Buttons.pannello_ricerca_film_genere ],
            [ Buttons.pannello_ricerca_film_lettera, Buttons.pannello_ricerca_film_anno ],
            [ Buttons.pannello_risultati_film_più_votati, Buttons.pannello_risultati_film_random ],
            [ Buttons.indietro('PANNELLO_BENVENUTO') ]
        ]
    },
    pannello_ricerca_film_titolo: {
        inline_keyboard: [
            [ Buttons.indietro('PANNELLO_FILM') ],
            [ Buttons.pannello_HOME ]
        ]
    },
    pannello_dettagli_film_random (pannello_indietro) {
        return {
            inline_keyboard: [
                [ Buttons.pannello_file_film ],
                [ Buttons.pannello_risultati_film_random ],
                [ Buttons.indietro(pannello_indietro) ],
                [ Buttons.pannello_HOME ]
            ]
        }
    },
    pannello_dettagli_film (pannello_indietro) {
        return {
            inline_keyboard: [
                [ Buttons.pannello_file_film ],
                [ Buttons.indietro(pannello_indietro) ],
                [ Buttons.pannello_HOME ]
            ]
        }
    },
    pannello_file_film: {
        inline_keyboard: [
            [ Buttons.pannello_HOME ]
        ]
    },

    /*          UTENTI - SERIE TV           */

    pannello_serie_tv: {
        inline_keyboard: [
            [ Buttons.pannello_ricerca_serie_titolo, Buttons.pannello_ricerca_serie_genere ],
            [ Buttons.pannello_ricerca_serie_lettera, Buttons.pannello_ricerca_serie_anno ],
            [ Buttons.pannello_risultati_serie_più_votate, Buttons.pannello_risultati_serie_random ],
            [{ text: '🏗 Serie in corso 🏗', url: 'https://t.me/Serietv_incorso_Ita' }],
            [{ text: '☁️ Serie SKY original ☁️', url: 'https://t.me/Il_Centopiedi' }],
            [ Buttons.indietro('PANNELLO_BENVENUTO') ]
        ]
    },
    pannello_ricerca_serie_titolo: {
        inline_keyboard: [
            [ Buttons.indietro('PANNELLO_SERIE_TV') ],
            [ Buttons.pannello_HOME ]
        ]
    },
    pannello_dettagli_serie_random (pannello_indietro) {
        return {
            inline_keyboard: [
                [ Buttons.pannello_file_serie ],
                [ Buttons.pannello_risultati_serie_random ],
                [ Buttons.indietro(pannello_indietro) ],
                [ Buttons.pannello_HOME ]
            ]
        }
    },
    pannello_dettagli_serie (pannello_indietro) {
        return {
            inline_keyboard: [
                [ Buttons.pannello_file_serie ],
                [ Buttons.indietro(pannello_indietro) ],
                [ Buttons.pannello_HOME ]
            ]
        }
    },
    pannello_file_serie: {
        inline_keyboard: [
            [ Buttons.pannello_HOME ]
        ]
    },


    /*          UTENTI - RICHIESTE          */
    
    pannello_richieste: {
        inline_keyboard: [
            [ Buttons.richiedi_film ],
            [ Buttons.richiedi_film_sub_ita ],
            [ Buttons.richiedi_serie ],
            [ Buttons.indietro('PANNELLO_BENVENUTO') ]
        ]
    },
    
    pannello_richieste_film: {
        inline_keyboard: [
            [ Buttons.indietro('PANNELLO_RICHIESTE') ],
            [ Buttons.pannello_HOME ]
        ]
    },

    pannello_richiesta_inviata: {
        inline_keyboard: [
            [
                { text: '✅Accetta', callback_data: 'RICHIESTA_ACCETTATA' },
                { text: '❌Non trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
            ],
            [
                { text: '📬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                { text: '🇮🇹Mai uscito in italia', callback_data: 'RICHIESTA_MAI_USCITO'}
            ],
            [
                { text: '⏰Appena uscito', callback_data: 'RICHIESTA_APPENA_USCITO'},
                { text: '⚠️ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
            ],
            [
                { text: '🔴 Prendi in carico 🔴', callback_data: 'RICHIESTA_PRESA_IN_CARICO'}
            ]
        ]
    },

    pannello_richiesta_inviata_SUB_ITA: {
        inline_keyboard: [
            [
                { text: '✅Accetta', callback_data: 'RICHIESTA_ACCETTATA' },
                { text: '❌Non trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
            ],
            [
                { text: '📬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                { text: '⚠️ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
            ],
            [
                { text: '🔴 Prendi in carico 🔴', callback_data: 'RICHIESTA_PRESA_IN_CARICO'}
            ]
        ]
    },

    pannello_richiesta_inviata_serie: {
        inline_keyboard: [
            [
                { text: '✅Accetta', callback_data: 'RICHIESTA_ACCETTATA_SERIE' },
                { text: '❌Non trovata', callback_data: 'RICHIESTA_NON_TROVATO_SERIE'}
            ],
            [
                { text: '📬Postata in precedenza', callback_data: 'RICHIESTA_POSTATO_SERIE'},
                { text: '🇮🇹Mai uscita in italia', callback_data: 'RICHIESTA_MAI_USCITO_SERIE'}
            ],
            [
                { text: '🏗 Serie ancora in corso', callback_data: 'RICHIESTA_IN_CORSO_SERIE'},
                { text: '⚠️ Richiesta errata', callback_data: 'RICHIESTA_ERRATA_SERIE'}
            ],
            [{ text: '☁️ Serie SKY', callback_data: 'RICHIESTA_SERIE_SKY' }],
            [
                { text: '🔴 Prendi in carico 🔴', callback_data: 'RICHIESTA_PRESA_IN_CARICO_SERIE'}
            ]
        ]
    },



    /*          UTENTI - SPONSOR            */
    pannello_sponsor: {
        inline_keyboard: [
            //[Markup.button.switchToChat('👉 Contattaci 👈', '@Italia_FilmSerieTVBot')],
            [ Buttons.indietro('PANNELLO_BENVENUTO') ]
        ]
    },

    /*          UTENTI - DONAZIONI            */
    pannello_donazioni: {
        inline_keyboard: [
            [ Buttons.indietro('PANNELLO_BENVENUTO') ]
        ]
    },

    /*          UTENTI - AIUTO            */
    pannello_aiuto: {
        inline_keyboard: [
            [{ text: '🔎 Come fare una ricerca 🔎', url: 'https://telegra.ph/GUIDA-RICERCA-FILMSERIE-TV-06-27' }],
            [{ text: '🎵 Problemi audio/video 📹', url: 'https://telegra.ph/Per-problemi-audiovideosottotitoli-leggere-qui-12-27' }],
            [ Buttons.indietro('PANNELLO_BENVENUTO') ]
        ]
    }

}