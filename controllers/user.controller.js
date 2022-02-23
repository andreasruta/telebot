const db = require('../models');
const User = db.user;

// Crea e salva un nuovo utente
exports.create = (chat_id, nome, username) => {
	if (!chat_id) { return; }

    var query = {chat_id: chat_id},
    update = { nome: nome, chat_id: chat_id, username: username },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Cerca utente nel db, se non è presente lo crea
    User.findOneAndUpdate(query, update, options).then((result) => {
        if (result) {
            return result;
        }
    }).catch((err) => {
        console.error(err);
        return;
    })
};

// Trova un singolo utente in base all'id della chat
exports.findOne = async (chat_id_or_username) => {

	const data = await User.findOne({ $or: [ {chat_id: isNaN(chat_id_or_username) ? 0 : chat_id_or_username },
		{username: chat_id_or_username} ]}).then(data => {
		if (!data) {
			return (false);
		} else {
			return (data);
		}
	}).catch((err) => {
        console.error(err);
		return ({
			message: err.message || 'Qualcosa è andato storto.'
		});
	});
    return data;
};

// Trova tutti gli utenti
exports.findAll = async () => {

	const data = await User.find().then(data => {
		if (!data) {
			return (false);
		} else {
			return (data);
		}
	}).catch((err) => {
        console.error(err);
		return ({
			message: err.message || 'Qualcosa è andato storto.'
		});
	});
    return data;
};

// Aggiorna l'utente
exports.update = async (chat_id_or_username, update) => {
	if (!chat_id_or_username) {
		return;		
	}

	const rersult = await User.findOneAndUpdate({ $or: [ {chat_id: isNaN(chat_id_or_username) ? 0 : chat_id_or_username },
			{username: chat_id_or_username} ]}, update).then(data => {
		if (!data) {
			return false;
		} else {
			return data;
		}
	}).catch(err => {
		console.error(err);
		return false;
	});
	return rersult;
};

// Restituisce il numero di utenti presenti nel database
exports.count = async () => {
	const result = await User.count().then((count) => {
		if (count) return count;
		else return '?';
	}).catch((err) => {
		console.error(err);
		return '?'
	})
	return result;
}

// Restituisce il numero di utenti bannati
exports.bannedCount = async () => {
	const result = await User.count({ banned: true }).then((count) => {
		if (count) return count;
		else return 0;
	}).catch((err) => {
		console.error(err);
		return '?'
	})
	return result;
}

// Restituisce il numero di utenti con almeno un warn
exports.warnedCount = async () => {
	const result = await User.count({ ammonizioni: { $gte: 1 }}).then((count) => {
		if (count) return count;
		else return 0;
	}).catch((err) => {
		console.error(err);
		return '?'
	})
	return result;
}

// Restituisce la lista degli utenti con almeno un warn
exports.warnedList = async () => {
	const result = await User.find({ ammonizioni: { $gte: 1 }}, null, { sort: { ammonizioni: -1 }}).then((data) => {
		if (data) return data;
		else return false;
	}).catch((err) => {
		console.error(err);
		return false;
	})
	return result;
}

// Restituisce la lista degli utenti bannati
exports.bannedList = async () => {
	const result = await User.find({ banned: true }).then((data) => {
		if (data) return data;
		else return false;
	}).catch((err) => {
		console.error(err);
		return false;
	})
	return result;
}