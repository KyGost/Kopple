import Constant from "./constant.js";
import Setting from "./setting.js";

import Actions from "./actions.js";

import fetch from "../bundles/api-beaker-polyfill-datfetch.js";

import {
	readFromFile,
	writeToFile,
	locationFromFile,
	timeoutSignal,
} from "./utilities.js";

var crawled; // TODO: Perhaps this can be done better?
const crawl = (options) => {
	return new Promise((resolve, reject) => {
		if (options.origin) crawled = [];
		crawled.push(options.address);
		console.log("Crawling", options.address, options.distance, "steps to go.");

		var waitFor = [];
		Store.knowledgeBase[options.address] = [];
		options.crawlFiles[0].forEach((file) => {
			waitFor.push(
				new Promise((resolveInner, reject) => {
					try {
						let startTime = performance.now();
						fetch("hyper://" + options.address + locationFromFile(file), {
							signal: timeoutSignal(),
						})
							.then((response) => response.json())
							.then((result) => {
								Store.knowledgeBase[options.address][file] = result;

								if (file === "follows" && options.distance > 0) {
									var awaitCrawls = [];
									result.forEach((follow) => {
										if (
											follow.address?.length === 64 &&
											!crawled.includes(follow.address)
										) {
											if (options.crawlFiles.length > 1)
												options.crawlFiles.shift();
											awaitCrawls.push(
												crawl({
													...options,
													distance: options.distance - 1,
													address: follow.address,
													origin: false,
												})
											);
										}
									});
									Promise.all(awaitCrawls).then(() => {
										resolveInner();
									});
								} else resolveInner();
							})
							.catch((error) => {
								console.log(
									"Bad crawl, address:",
									options.address,
									"Error:",
									error,
									"Attempted for:",
									performance.now() - startTime,
									"ms"
								);
								resolveInner();
							});
					} catch (error) {
						console.log(error);
					}
				})
			);
		});
		Promise.all(waitFor).then(() => {
			Store.knowledgeBase[options.address].self = Store.knowledgeBase[
				options.address
			].self?.map((self) => {
				return {
					...Constant.dataDefault.self,
					...self,
					name:
						Store.files.follows.find(
							(follow) => follow.address === options.address
						)?.nickname ?? self.name,
				};
			});
			const poster = {
				address: options.address,
				name: Store.knowledgeBase[options.address]?.self?.[0].name,
				avatar: Store.knowledgeBase[options.address]?.self?.[0].avatar,
			};
			Store.knowledgeBase[options.address].feed = Store.knowledgeBase[
				options.address
			].feed?.map((post) => {
				return {
					poster: poster,
					...Constant.dataDefault.post,
					...post,
				};
			});
			Store.knowledgeBase[options.address].interactions = Store.knowledgeBase[
				options.address
			].interactions?.map((interaction) => {
				return {
					poster: poster,
					...Constant.dataDefault.interaction,
					...interaction,
				};
			});
			options.onComplete(options.address);
			resolve();
		});
	});
};

let Store = {
	files: {}, // TODO: Find a way to automatically save whenever an object under files is changed.
	knowledgeBase: {},
	saveFiles: () => {
		return new Promise((resolve, reject) => {
			let awaitSave = [];
			Constant.acceptedFiles.forEach((file) => {
				awaitSave.push(writeToFile(file, store.files[file]));
			});
			Promise.all(awaitSave).then(resolve);
		});
	},
	loadFiles: () => {
		return new Promise((resolve, reject) => {
			let loadingFiles = [];
			Constant.acceptedFiles.forEach((file) => {
				loadingFiles.push(
					readFromFile(file)
						.then((result) => {
							store.files[file] = result;
						})
						.catch(console.error)
				);
			});
			Promise.all(loadingFiles).then(resolve).catch(resolve);
		});
	},
	update: (options) => {
		const defaultOptions = {
			onComplete: () => {},
			distance: Setting.crawlDistance,
			address: Setting.profileDrive,
			origin: true,
			crawlFiles: [Constant.acceptedFiles],
		};
		return crawl({ ...defaultOptions, ...options }).then(() => {
			console.log("Knowledge Base Filled");
		});
	},
};
export default Store;
