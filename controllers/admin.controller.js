const db = require('../models');
const Admin = db.admin;
const User = db.user;

// Crea e salva un nuovo admin (Promuove un utente ad admin)
exports.create = async (chat_id_or_username) => {
	if (!chat_id_or_username) { return; }

    var query = { $or: [ {chat_id: isNaN(chat_id_or_username) ? 0 : chat_id_or_username },
		{username: chat_id_or_username} ]},
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

	const user = await User.findOne({ $or: [ {chat_id: isNaN(chat_id_or_username) ? 0 : chat_id_or_username },
		{username: chat_id_or_username} ]});

    // Cerca admin nel db, se non è presente lo crea
    const data = await Admin.findOneAndUpdate(query, user, options).then((result) => {
        if (result) {
            return true;
        } else {
			return false;
		}
    }).catch((err) => {
        console.error(err);
        return false;
    })
	return data;
};

// Trova un singolo admin in base all'id della chat
exports.findOne = async (chat_id) => {

	const isAdmin = await Admin.findOne({ chat_id: chat_id }).then(data => {
		if (!data) {
			return false;
		} else {
			return data;
		}
	}).catch((err) => {
		console.error(err);
        return false;
	});
    return isAdmin;
};

// Aggiorna l'admin
exports.update = async (chat_id, update) => {
	if (!chat_id) {
		return;		
	}

	const rersult = await Admin.findOneAndUpdate({ chat_id: chat_id }, update).then(data => {
		if (!data) {
			return({
				message: `Non è possibile aggiornare l'admin con chat_id=${chat_id}. L'admin non è stato trovato.`
			});
		} else {
			return({
				message: 'Admin aggiornato con successo.'
			});
		}
	}).catch(err => {
		console.error(err);
		return({
			message: `Errore nell'aggiornamento dell'admin con chat_id=${chat_id}.`
		});
	});
	return rersult;
};

// Elimina admin
exports.delete = async (chat_id_or_username) => {
	if (!chat_id_or_username) { return; }

	// Salva il film nel db e restituisce l'oggetto salvato, in modo da avere poi a disposizione l'id.
	const data = await Admin.findOneAndDelete({ $or: [ {chat_id: isNaN(chat_id_or_username) ? 0 : chat_id_or_username },
		{username: chat_id_or_username} ]}).then(data => {
		if (data) {
			return data;
		}
	}).catch(err => {
		console.error(err);
		return false;
	});
	return data;
};