import { newElement, markdownToHTML } from "./utilities.js";
import Actions from "./actions.js";
import Constant from "./constant.js";
import State from "./state.js";
import Store from "./store.js";
import Setting from "./setting.js";

import Post from "../elements/post.js";
import Dialog from "../elements/dialog.js";

const PageType = {
	FEED: async (fresh) => {
		if (fresh) Actions.clearFeed();
		await Store.update({
			onComplete: (result) => Actions.loadFeed(result, { pin: "user" }),
			crawlFiles: [
				["feed", "interactions", "self", "follows"],
				["feed", "interactions", "self", "follows"],
				["interactions", "self", "follows"],
			],
		});
		Actions.loadInteractions.load();
	},
	NEWINSTALL: () => {
		Actions.resetFiles();
		window.location.hash = "";
		alert(
			"Welcome to Kopple!\nTell people your address is:\n" +
				location.hostname +
				"\n(You can copy it from the URL bar)\n\nYou should probably bookmark this page by the way!"
		);
	},
	PROFILE: async () => {
		let address = State.hash.PAGE.PROFILE;

		Actions.clearFeed();
		await Store.update({
			onComplete: (result) => Actions.loadFeed(result, { pin: "all" }),
			address: address,
			crawlFiles: [
				["feed", "interactions", "self", "follows"],
				["interactions", "self", "follows"],
			],
		});
		Actions.loadInteractions.load();

		const self = Store.knowledgeBase[address].self[0];
		document.querySelector("#profileInformationAvatar").src = self.avatar;
		document.querySelector("#profileInformationName").innerText = self.name; // TODO: Check nickname
		document.querySelector(
			"#profileInformationDescription"
		).innerHTML = markdownToHTML(self.description ?? "");

		var options = [];
		if (address === Setting.profileDrive) {
			options.push(
				newElement("dropdown-item", "li", "Edit", undefined, (element) => {
					element.addEventListener("click", () => {}); // TODO
				})
			);
		} else {
			let following = Store.files.follows.find(
				(follow) => follow.address === address
			);
			options = options.concat([
				newElement(
					"dropdown-item",
					"li",
					following ? "Unfollow" : "Follow", // TODO: Check if user is already following
					undefined,
					(element) => {
						element.addEventListener("click", () => {
							following = !following;
							element.innerText = following ? "Unfollow" : "Follow";
							if (following) Store.files.follows.push({ address: address });
							else
								Store.files.follows = Store.files.follows.filter(
									(follow) => follow.address !== address
								);
							Store.saveFiles();
						});
					}
				),
				newElement("dropdown-item", "li", "Block", undefined, (element) => {
					element.addEventListener("click", () => {}); // TODO: Dependancy: Service worker
				}),
			]);
			if (following)
				options.push(
					newElement(
						"dropdown-item",
						"li",
						"Set nickname",
						undefined,
						(element) => {
							element.addEventListener("click", () => {
								new Dialog({
									title: `Set ${self.name}'s nickname`,
									notes: "Enter a nickname",
									doneText: "Set",
									inputs: [
										{
											id: "nickname",
											label: "Nickname",
											type: "text",
											placeholder: "Johnny",
										},
									],
									doneClick: () => {
										Store.files.follows.find(
											(follow) => follow.address === address
										).nickname = document.querySelector("#nickname").value;
										Store.saveFiles();
									},
								});
							});
						}
					)
				);
		}

		let optionsElement = document.querySelector(
			"#profileInformationEditOptions"
		);
		Array.from(optionsElement.children).forEach((element) =>
			optionsElement.removeChild(element)
		);
		options.forEach((option) => {
			optionsElement.appendChild(option);
		});
	},
	POST: async () => {
		let [address, identity] = State.hash.PAGE.POST.split("-");
		let feedElement = document.getElementById(Constant.id.feedID);

		await Store.update({
			distance: 0,
			address: address,
			crawlFiles: [["feed", "self"]],
		});
		Actions.clearFeed();

		let { feed } = Store.knowledgeBase[address];
		let post = feed.find((post) => post.identity == identity);
		if (post) {
			post = {
				identity: identity,
				...post,
			};

			feedElement.appendChild(new Post(post).asHTML());
		} else
			feedElement.appendChild(
				newElement(
					"post", // not really but works with existing code this way
					"div",
					[newElement("warning", "div", "POST NOT FOUND")]
				)
			);
	},
};

export default PageType;
