module.exports = (mongoose) => {

	const schema = mongoose.Schema({
			nome: String,
            film_visti: Number,
            serie_viste: Number,
            chat_id: Number,
			username: String,
			super_admin: Boolean
		},
		{ timestamps: true }
	);

	// Fa in modo che l'attributo "_id" venga sostituito con "id"
	schema.method("toJSON", function() {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const Admin = mongoose.model("Admin", schema);
	return Admin;
};

//'_id', 'createdAt', 'updatedAt', '__v' creati automaticamente