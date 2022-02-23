module.exports = (mongoose) => {

	const schema = mongoose.Schema({
			nome: String,
            data_ultima_richiesta_film: Date,
            data_ultima_richiesta_serie: Date,
            film_visti: Number,
            serie_viste: Number,
			ammonizioni: Number,
            chat_id: Number,
			username: String,
			banned: Boolean
		},
		{ timestamps: true }
	);

	// Fa in modo che l'attributo "_id" venga sostituito con "id"
	schema.method("toJSON", function() {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const User = mongoose.model("User", schema);
	return User;
};

//'_id', 'createdAt', 'updatedAt', '__v' creati automaticamente