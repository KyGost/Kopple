import Constant from "./constant.js";
import Setting from "./setting.js";

import Actions from "./actions.js";
import Normaliser from "./normaliser.js";

import fetch from "../bundles/api-beaker-polyfill-datfetch.js";

import {
	readFromFile,
	writeToFile,
	locationFromFile,
	timeoutSignal,
} from "./utilities.js";

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

var crawled; // TODO: Perhaps this can be done better?
const crawl = (options) =>
	new Promise((resolve, reject) => {
		if (options.origin) crawled = [];
		crawled.push(options.address);
		console.log("Crawling", options.address, options.distance, "steps to go.");

		Store.knowledgeBase[options.address] = [];
		Promise.all(
			options.crawlFiles[0].map(
				(file) =>
					new Promise((resolveInner, reject) => {
						let startTime = performance.now();
						fetch(`hyper://${options.address}${locationFromFile(file)}`, {
							signal: timeoutSignal(),
						})
							.then((response) => response.json())
							.then((result) => {
								Store.knowledgeBase[options.address][file] = result;
								resolveInner(options);
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
					})
			)
		)
			.then(() => complete(options))
			.then((outgoingCrawls) => Promise.all(outgoingCrawls))
			.then(resolve);
	});

const complete = (options) => {
	const knowledge = Store.knowledgeBase[options.address];
	if (!knowledge) return false;

	normalise(options, knowledge);
	options.onComplete(options.address);
	return crawlFurther(options, knowledge);
};

const normalise = (options, knowledge) => {
	new Normaliser(
		knowledge,
		Constant.dataDefault,
		options.address
	).giveNormalsy();
};

const crawlFurther = (options, knowledge) => {
	if (knowledge.follows && options.distance > 0) {
		return knowledge.follows.map((follow) => {
			if (follow.address?.length === 64 && !crawled.includes(follow.address)) {
				if (options.crawlFiles.length > 1) options.crawlFiles.shift();
				return crawl({
					...options,
					distance: options.distance - 1,
					address: follow.address,
					origin: false,
				});
			} else return [];
		});
	} else return [];
};

export default Store;
