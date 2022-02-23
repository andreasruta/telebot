module.exports = (mongoose, mongoosePaginate) => {

	const schema = mongoose.Schema({
			titolo: String,
			anno: Number,
			genere: [String],
			voto: String,
			id_locandina: Number,
			id_locandina_public: Number,
			files_messages_id: Array,
			TMDB_id: Number,
			season_index: Number
		},
		{ timestamps: true }
	);

	// Fa in modo che l'attributo "_id" venga sostituito con "id"
	schema.method("toJSON", function() {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	schema.plugin(mongoosePaginate);

	const Serie = mongoose.model("Serie", schema);
	return Serie;
};

//'_id', 'createdAt', 'updatedAt', '__v' creati automaticamente