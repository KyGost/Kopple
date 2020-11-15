const getName = (object) => {
	return object ? Object.keys(object)[0] : object;
};

var State = {
	get hash() {
		var hash = {};
		location.hash.split("#").forEach((item) => {
			if (item === "") return;
			let values = item.split(":");
			let specific = {};
			specific[values[1]] = values[2];
			hash[values[0]] = specific;
		});
		return hash;
	},
	set hash(hash) {
		location.hash = Object.keys(hash)
			.map((item) => {
				let specific = getName(hash[item]);
				return [item, specific, hash[item][specific]].join(":");
			})
			.join("#");
	},
	get page() {
		let hash = this.hash;
		return hash.PAGE ? Object.keys(hash.PAGE)[0] : "FEED";
	},
	set page(value) {
		this.hashSet("PAGE", value);
	},
	hashSet: (type, value) => {
		let hash = State.hash;
		console.log(hash);
		hash[type] = typeof value === "object" ? value : { [value]: undefined };
		location.hash = Object.keys(hash)
			.map((item) => {
				let specific = getName(hash[item]);
				return [item, specific, hash[item][specific]].join(":");
			})
			.join("#");
	},
};
export default State;
