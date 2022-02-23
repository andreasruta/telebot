// utilizzato per tenere lo stato corrente del bot

module.exports = (mongoose) => {

	const schema = mongoose.Schema({
			richieste_aperte: Boolean,
			richieste_film: Number,
			richieste_film_sub_ita: Number,
			richieste_serie: Number
		},
		{ timestamps: true }
	);

	// Fa in modo che l'attributo "_id" venga sostituito con "id"
	schema.method("toJSON", function() {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const Bot = mongoose.model("Bot", schema);
	return Bot;
};

//'_id', 'createdAt', 'updatedAt', '__v' creati automaticamente