import Store from "./store.js";

export default class Normaliser {
	constructor(knowledge, defaults, address) {
		this.knowledge = knowledge;
		this.defaults = defaults;
		this.address = address;
		this.normalise("self"); // I don't like this
		this.poster = {
			address,
			name: knowledge.self?.[0].name,
			avatar: knowledge.self?.[0].avatar,
		};
	}
	giveNormalsy = () => {
		Object.keys(this.knowledge).forEach(this.normalise);
	};
	normal = (value, set) => ({
		...this.defaults[set],
		...value,
		...this.specials[set]?.(value),
	});
	normalise = (set) => {
		this.knowledge[set] = this.knowledge[set]?.map((value) =>
			this.normal(value, set)
		);
	};
	specials = {
		self: (value) => ({
			name:
				Store.files.follows.find((follow) => follow.address === this.address)
					?.nickname ?? value.name,
		}),
		feed: (value) => ({
			poster: this.poster,
		}),
		interactions: (value) => ({
			poster: this.poster,
		}),
	};
}
