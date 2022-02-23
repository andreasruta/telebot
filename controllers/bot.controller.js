const db = require('../models');
const Bot = db.Bot;

// Restituisce lo stato delle richieste. true = richieste aperte, false = richieste chiuse
exports.find = async () => {

	const open = await Bot.find().then(data => {
        return data[0];
	}).catch((err) => {
		console.error(err);
        return false;
	});
    return open;
};

// Restituisce lo stato delle richieste. true = richieste aperte, false = richieste chiuse
exports.requests_state = async () => {

	const open = await Bot.find().then(data => {
        return data[0].richieste_aperte;
	}).catch((err) => {
		console.error(err);
        return false;
	});
    return open;
};

exports.update = async (nuovo_stato) => {

	Bot.findByIdAndUpdate('61689d46a19bf70e0a2c0697', {richieste_aperte: nuovo_stato}).then(data => {
		if (!data) {
			return({
				message: `Impossibile aggiornare lo stato delle richieste.`
			});
		} else {
			return({
				message: 'Stato richieste aggiornato con successo.'
			});
		}
	}).catch(err => {
		console.error(err);
		return({
			message: `Errore nell'aggiornamento.`
		});
	});
};

exports.aggiornaRichieste = async (tipo) => {

	let aggiornamento = '';

	switch (tipo) {
		case 'film': aggiornamento = {$inc : {'richieste_film' : 1}};
			break;
		case 'film_sub_ita': aggiornamento = {$inc : {'richieste_film_sub_ita' : 1}};
			break;
		case 'serie': aggiornamento = {$inc : {'richieste_serie' : 1}};
			break;
	}

	Bot.findByIdAndUpdate('61689d46a19bf70e0a2c0697', aggiornamento).then(data => {
		if (!data) {
			return({
				message: `Impossibile aggiornare il numero delle richieste.`
			});
		} else {
			return({
				message: 'Numero richieste aggiornato con successo.'
			});
		}
	}).catch(err => {
		console.error(err);
		return({
			message: `Errore nell'aggiornamento.`
		});
	});
};