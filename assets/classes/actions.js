import Theme from "./theme.js";

import Constant from "./constant.js";
import State from "./state.js";
import Store from "./store.js";

import fetch from "../bundles/api-beaker-polyfill-datfetch.js";

import { profileLocationFromFile, sortElementsByPosted } from "./utilities.js";

import Post from "../elements/post.js";
import Reply from "../elements/reply.js";

const loadTheme = (theme) => {
	let themeObject = Theme[theme];
	Object.keys(themeObject).forEach((variable) => {
		document.documentElement.style.setProperty(variable, themeObject[variable]);
	});
};

const loadFeed = (
	address,
	options = {
		pin: "none",
	}
) => {
	let feedElement = document.getElementById(Constant.id.feedID);
	clearFeed(address);
	let knowledge = Store.knowledgeBase[address];
	let { feed, interactions } = knowledge;
	let filter = State.hash.FILTER && Object.keys(State.hash.FILTER)[0]; // Not particularly clean
	if (filter) {
		let filterTest = new RegExp(filter, "i");
		feed = feed?.filter((post) => filterTest.test(post.topics?.join())); // Includes is case sensitive
	}

	if (feed !== undefined)
		feed.forEach((post) => {
			feedElement.appendChild(new Post(post, options).asHTML());
		});

	if (interactions !== undefined)
		interactions.forEach((interaction) => {
			if (!loadInteractions.interactionGroups[interaction.type])
				loadInteractions.interactionGroups[interaction.type] = []; // TODO: Maybe there's a better way to assign this?
			loadInteractions.interactionGroups[interaction.type].push(interaction);
		});

	sortElementsByPosted("post");
};

const loadInteractions = {
	interactionGroups: {},
	load: function () {
		clearFeed(undefined, true);
		this.interactionGroups.reply = this.interactionGroups.reply?.concat(
			this.interactionGroups.comment
		); // Legacy
		this.interactionGroups.reply?.forEach((reply) => {
			let postElementID = ["post", reply.address, reply.postIdentity].join("-");
			let postElement = document.getElementById(postElementID);
			if (!postElement)
				console.log(
					"Post:",
					postElementID,
					"not found, interaction not loaded."
				);
			else {
				let repliesElement = postElement.querySelector(".replies");
				postElement.classList.add("hasReplies");
				repliesElement.appendChild(new Reply(reply).asHTML());
			}
		});
		sortElementsByPosted("reply");
		this.interactionGroups = {};
	},
};

const clearFeed = (address, replies = false) => {
	let query = `#${Constant.id.feedID}>${
		replies ? " .reply" : !address ? ".post" : "*[id^=post-" + address + "]"
	}`;
	Array.from(document.querySelectorAll(query)).forEach((postElement) => {
		postElement.parentElement.removeChild(postElement);
	});
};

const resetFiles = async () => {
	for (var i = 0; i < Constant.acceptedFiles.length; i++) {
		let file = Constant.acceptedFiles[i];
		let content = file == "self" ? [{}] : [];
		await fetch(profileLocationFromFile(file), {
			method: "PUT",
			body: JSON.stringify(content),
		});
	}
	location.reload();
};

export default { loadTheme, loadFeed, loadInteractions, clearFeed, resetFiles };
