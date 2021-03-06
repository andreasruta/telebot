const Buttons = require("./buttons");
const Admin = require("../controllers/admin.controller");
const { Markup } = require('telegraf');

module.exports = {

    /*          SUPER ADMIN         */

    pannello_super_admin: {
        "one_time_keyboard": true,
        inline_keyboard: [
            [ { text: 'β Aggiungi Admin β', callback_data: 'PANNELLO_AGGIUNGI_ADMIN'}],
            [ { text: 'β Elimina Admin β', callback_data: 'PANNELLO_ELIMINA_ADMIN'}],
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
                { text: 'π€ Sponsor π€', callback_data: 'PANNELLO_SPONSOR' },
                { text: 'π Donazioni π', callback_data: 'PANNELLO_DONAZIONI' }
            ],
            [{ text: 'π½ Discussioni Film e Serie TV π¬', url: 'https://t.me/gliamicidelparchetto' }],
            [{ text: 'βοΈ Ho bisogno di aiuto βοΈ', callback_data: 'PANNELLO_AIUTO' }]
        ]
    },
    async pannello_admin(stato_richieste, chat_id) {
        const admin = await Admin.findOne(chat_id);
        if (admin.super_admin) {
            return {
                inline_keyboard: [
                    [ { text: 'π¦ΈββοΈ Super Admin π¦ΈββοΈ', callback_data: 'PANNELLO_SUPER_ADMIN' }],
                    [ { text: 'π Statistiche π', callback_data: 'PANNELLO_STATISTICHE' }],
                    [ 
                        { text: 'πΏ Film πΏ', callback_data: 'PANNELLO_FILM_ADMIN' },
                        { text: 'πΊ Serie πΊ', callback_data: 'PANNELLO_SERIE_ADMIN' }
                    ],
                    [ 
                        { text: 'π§ββοΈ Gestione utenti π§ββοΈ', callback_data: 'PANNELLO_GESTIONE_UTENTI' },
                    ],
                    [ 
                        { text: 'π Riepilogo aggiunte π', callback_data: 'INVIA_RIEPILOGO_GIORNATA' },
                    ],
                    [ Buttons.cambia_stato_richieste(stato_richieste) ],
                    [ Buttons.indietro('PANNELLO_BENVENUTO') ]
                ]
            }
        } else {
            return {
                inline_keyboard: [
                    [ { text: 'π Statistiche π', callback_data: 'PANNELLO_STATISTICHE' }],
                    [ 
                        { text: 'πΏ Film πΏ', callback_data: 'PANNELLO_FILM_ADMIN' },
                        { text: 'πΊ Serie πΊ', callback_data: 'PANNELLO_SERIE_ADMIN' }
                    ],
                    [ 
                        { text: 'π§ββοΈ Gestione utenti π§ββοΈ', callback_data: 'PANNELLO_GESTIONE_UTENTI' },
                    ],
                    [ 
                        { text: 'π Riepilogo aggiunte π', callback_data: 'INVIA_RIEPILOGO_GIORNATA' },
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
            [ { text: 'π§ββοΈ Azzera WARN π§ββοΈ', callback_data: 'PANNELLO_AZZERA_WARN'}],
            [ { text: 'β Togli 1 WARN β', callback_data: 'PANNELLO_DIMINUISCI_WARN'}],
            [ { text: 'π» Sbanna utente π»', callback_data: 'PANNELLO_UNBAN_UTENTE'}],
            [ { text: 'ππ» Banna utente ππ»', callback_data: 'PANNELLO_BANNA_UTENTE' } ],
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
                    { text: 'βAccetta', callback_data: 'RICHIESTA_ACCETTATA' },
                    { text: 'βNon trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
                ],
                [
                    { text: 'π¬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                    { text: 'π?πΉMai uscito in italia', callback_data: 'RICHIESTA_MAI_USCITO'}
                ],
                [
                    { text: 'β°Appena uscito', callback_data: 'RICHIESTA_APPENA_USCITO'},
                    { text: 'β οΈ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
                ],
                [
                    { text: 'π’' + username_admin + 'π’', callback_data: 'VUOTO'}
                ]
            ]
        }
    },

    pannello_richiesta_presa_in_carico_sub_ita(username_admin) {
        return {
            inline_keyboard: [
                [
                    { text: 'βAccetta', callback_data: 'RICHIESTA_ACCETTATA' },
                    { text: 'βNon trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
                ],
                [
                    { text: 'π¬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                    { text: 'β οΈ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
                ],
                [
                    { text: 'π’' + username_admin + 'π’', callback_data: 'VUOTO'}
                ]
            ]
        }
    },

    pannello_richiesta_presa_in_carico_serie(username_admin) {
        return {
            inline_keyboard: [
                [
                    { text: 'βAccetta', callback_data: 'RICHIESTA_ACCETTATA_SERIE' },
                    { text: 'βNon trovata', callback_data: 'RICHIESTA_NON_TROVATO_SERIE'}
                ],
                [
                    { text: 'π¬Postata in precedenza', callback_data: 'RICHIESTA_POSTATO_SERIE'},
                    { text: 'π?πΉMai uscita in italia', callback_data: 'RICHIESTA_MAI_USCITO_SERIE'}
                ],
                [
                    { text: 'π Serie ancora in corso', callback_data: 'RICHIESTA_IN_CORSO_SERIE'},
                    { text: 'β οΈ Richiesta errata', callback_data: 'RICHIESTA_ERRATA_SERIE'}
                ],
                [{ text: 'βοΈ Serie SKY', callback_data: 'RICHIESTA_SERIE_SKY' }],
                [
                    { text: 'π’' + username_admin + 'π’', callback_data: 'VUOTO'}
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
            [{ text: 'π€ Sponsor π€', callback_data: 'PANNELLO_SPONSOR' }],
            [{ text: 'π Donazioni π', callback_data: 'PANNELLO_DONAZIONI' }],
            [{ text: 'π½ Discussioni Film e Serie TV π¬', url: 'https://t.me/gliamicidelparchetto' }],
            [{ text: 'βοΈ Ho bisogno di aiuto βοΈ', callback_data: 'PANNELLO_AIUTO' }]
        ]
    },


    /*          UTENTI - FILM          */

    pannello_film: {
        inline_keyboard: [
            [ Buttons.pannello_ricerca_film_titolo, Buttons.pannello_ricerca_film_genere ],
            [ Buttons.pannello_ricerca_film_lettera, Buttons.pannello_ricerca_film_anno ],
            [ Buttons.pannello_risultati_film_piΓΉ_votati, Buttons.pannello_risultati_film_random ],
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
            [ Buttons.pannello_risultati_serie_piΓΉ_votate, Buttons.pannello_risultati_serie_random ],
            [{ text: 'π Serie in corso π', url: 'https://t.me/Serietv_incorso_Ita' }],
            [{ text: 'βοΈ Serie SKY original βοΈ', url: 'https://t.me/ilpiuveloce_ita' }],
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
                { text: 'βAccetta', callback_data: 'RICHIESTA_ACCETTATA' },
                { text: 'βNon trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
            ],
            [
                { text: 'π¬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                { text: 'π?πΉMai uscito in italia', callback_data: 'RICHIESTA_MAI_USCITO'}
            ],
            [
                { text: 'β°Appena uscito', callback_data: 'RICHIESTA_APPENA_USCITO'},
                { text: 'β οΈ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
            ],
            [
                { text: 'π΄ Prendi in carico π΄', callback_data: 'RICHIESTA_PRESA_IN_CARICO'}
            ]
        ]
    },

    pannello_richiesta_inviata_SUB_ITA: {
        inline_keyboard: [
            [
                { text: 'βAccetta', callback_data: 'RICHIESTA_ACCETTATA' },
                { text: 'βNon trovato', callback_data: 'RICHIESTA_NON_TROVATO'}
            ],
            [
                { text: 'π¬Postato in precedenza', callback_data: 'RICHIESTA_POSTATO'},
                { text: 'β οΈ Richiesta errata', callback_data: 'RICHIESTA_ERRATA'}
            ],
            [
                { text: 'π΄ Prendi in carico π΄', callback_data: 'RICHIESTA_PRESA_IN_CARICO'}
            ]
        ]
    },

    pannello_richiesta_inviata_serie: {
        inline_keyboard: [
            [
                { text: 'βAccetta', callback_data: 'RICHIESTA_ACCETTATA_SERIE' },
                { text: 'βNon trovata', callback_data: 'RICHIESTA_NON_TROVATO_SERIE'}
            ],
            [
                { text: 'π¬Postata in precedenza', callback_data: 'RICHIESTA_POSTATO_SERIE'},
                { text: 'π?πΉMai uscita in italia', callback_data: 'RICHIESTA_MAI_USCITO_SERIE'}
            ],
            [
                { text: 'π Serie ancora in corso', callback_data: 'RICHIESTA_IN_CORSO_SERIE'},
                { text: 'β οΈ Richiesta errata', callback_data: 'RICHIESTA_ERRATA_SERIE'}
            ],
            [{ text: 'βοΈ Serie SKY', callback_data: 'RICHIESTA_SERIE_SKY' }],
            [
                { text: 'π΄ Prendi in carico π΄', callback_data: 'RICHIESTA_PRESA_IN_CARICO_SERIE'}
            ]
        ]
    },



    /*          UTENTI - SPONSOR            */
    pannello_sponsor: {
        inline_keyboard: [
            //[Markup.button.switchToChat('π Contattaci π', '@Italia_FilmSerieTVBot')],
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
            [{ text: 'π Come fare una ricerca π', url: 'https://telegra.ph/GUIDA-RICERCA-FILMSERIE-TV-06-27' }],
            [{ text: 'π΅ Problemi audio/video πΉ', url: 'https://telegra.ph/Per-problemi-audiovideosottotitoli-leggere-qui-12-27' }],
            [ Buttons.indietro('PANNELLO_BENVENUTO') ]
        ]
    }

}
