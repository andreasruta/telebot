const db = require('../models');
const Serie = db.serie;

// supporto per la paginazione
const getPagination = (page) => {
	const limit = 10;
	const offset = page ? page * limit : 0;

	return { limit, offset };
}

// Restituisce il numero di serie presenti nel database
exports.count = async () => {
	const result = await Serie.count().then((count) => {
		if (count) return count;
		else return '?';
	}).catch((err) => {
		console.error(err);
		return '?'
	})
	return result;
}

// Crea e salva una nuova serie. TMDB == true, locandina di TMDB; TMDB == false, locandina creata da admin
exports.create = async (inputSerie, season, id_locandina, files_messages_id, TMDB) => {
	if (!inputSerie) { return; }

	let genere = [];
	let titolo = '';
	let anno = '';

	// genres in TMDB è un array di oggetti, nella locandina creata dall'admin è un semplice array
	if (TMDB) {
		inputSerie.genres.forEach(currentGenere => {
			genere.push(currentGenere.name);
		});
		titolo = inputSerie.name + '  [Stagione ' + inputSerie.seasons[season].season_number + ']';
		anno = inputSerie.seasons[season].air_date.substring(0, 4);
	} else {
		titolo = inputSerie.title;
		anno = inputSerie.air_date;
		genere = inputSerie.genres;
	}
	console.log(genere);

	// Crea una serie
	const serie = new Serie({
		titolo: titolo,
		anno: anno,
		genere: genere,
		voto: inputSerie.vote_average,
		id_locandina: id_locandina,
		TMDB_id: inputSerie.id,
		season_index: season,
		files_messages_id: files_messages_id
	});

	// Salva la serie nel db e restituisce l'oggetto salvato, in modo da avere poi a disposizione l'id.
	const data = await serie.save(serie).then(data => {
		if (data) {
			return data;
		}
	}).catch(err => {
		console.error(err);
		return false;
	});
	return data;

};

// Aggiorna una serie
exports.update = async (id, update) => {
	if (!id) {
		return;		
	}

	const rersult = await Serie.findByIdAndUpdate(id, update).then(data => {
		if (!data) {
			return({
				message: `Non è possibile aggiornare il film con id=${id}. Il film non è stato trovato.`
			});
		} else {
			return({
				message: 'Film aggiornato con successo.'
			});
		}
	}).catch(err => {
		console.error(err);
		return({
			message: `Errore nell'aggiornamento del film con id=${id}.`
		});
	});
	return rersult;
};

// Trova un singolo film in base all'id
exports.findOne = async (id) => {

	const data = await Serie.findById(id).then(data => {
		if (!data) {
			return ({
				message: `Non esiste un film con id=${id}.`
			});
		} else {
			return (data);
		}
	}).catch(err => {
		return ({
			message: err.message || 'Qualcosa è andato storto.'
		});
	});
    return data;
};

// Recupera tutti i film dal db in base al titolo
exports.findAll = async (tipo_ricerca, valore, page) => {
	let condition = {};
	let sorting = '';
	switch (tipo_ricerca) {
		case 'TITOLO':
			condition = { titolo: { $regex: new RegExp(valore), $options: "i"}};
			sorting = { titolo: 1 };
			break;
		case 'GENERE':
			condition = { genere: valore };
			sorting = { titolo: 1 };
			break;
		case 'LETTERA':
			condition = { titolo: { $regex: '^' + valore, $options: "i"}};
			sorting = { titolo: 1 };
			break;
		case 'ANNO':
			condition = { anno: valore };
			break;
		case 'PIÙ_VOTATI':
			condition = {voto: { $not: /^(n|s|S|N|i).*/ } };
			sorting = { voto: -1 };
			break;
	}
	

	const { limit, offset } = getPagination(page);
	const options = {
		limit: limit,
		offset: offset,
		sort: sorting
	}

	const data = await Serie.paginate(condition, options).then(data => {
		return({
			hasPrevPage: data.hasPrevPage,
			hasNextPage: data.hasNextPage,
			totalConfirmed: data.totalDocs,
			series: data.docs,
			totalPages: data.totalPages,
			currentPage: data.page -1
		});
	}).catch(err => {
		return({
			message: err.message || 'Qualcosa è andato storto.'
		});
	});
	return data;
};

// Recupera un film random
exports.findRandom = async () => {

	const result = await Serie.count().then( async (count) => {

		let random = Math.floor(Math.random() * count)

		const result = await Serie.findOne().skip(random).then(
			(result) => {
				//console.log(result);
				return result;
			}
		).catch((err) => {
			console.error(err);
		});
		return result;
	}).catch((err) => {
		console.error(err);
	});

	return result;
}

// Recupera tutti i film dal db in base al titolo
exports.findAll_backup = async () => {

	const data = await Serie.find({}, null, {sort: {_id: 1}}).then(data => {
		return data;
	}).catch(err => {
		return({
			message: err.message || 'Qualcosa è andato storto.'
		});
	});
	return data;
};

// Cancella film in base all'id, cancella anche i messaggi contenenti locandina e files
exports.delete = async (serieId) => {
	if (!serieId) { return; }

	// Salva il film nel db e restituisce l'oggetto salvato, in modo da avere poi a disposizione l'id.
	const data = await Serie.findByIdAndRemove(serieId).then(data => {
		if (data) {
			return data;
		}
	}).catch(err => {
		console.error(err);
		return false;
	});
	return data;
};

exports.getGenres = async () => {
	return await Serie.distinct('genere');
}

exports.riepilogo = async () => {
	const date = new Date();
	date.setDate(date.getDate() - 1);
	const results = await Serie.find({createdAt: {$gte: date}}, {titolo: 1, anno: 1}).then((result) => {
		if (result) {
			return result;
		} else {
			return null;
		}
	}).catch((err) => {
		console.error(err);
	});
	return results;
}