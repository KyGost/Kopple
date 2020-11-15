import Constant from "./constant.js";
import Setting from "./setting.js";

import fetch from "../bundles/api-beaker-polyfill-datfetch.js";

import Markdown from "hyper://7a9332a74279a911bd01e5d016fed0d790256637c3dc4423635b4ab3d9074880+1164/index.js"; // TODO: Use version (+X)
import hider from "hyper://7a9332a74279a911bd01e5d016fed0d790256637c3dc4423635b4ab3d9074880+1164/plugins/hider.js"; // TODO: Use version (+X)
import iframe from "hyper://7a9332a74279a911bd01e5d016fed0d790256637c3dc4423635b4ab3d9074880+1164/plugins/iframe.js"; // TODO: Use version (+X)
import todo from "hyper://7a9332a74279a911bd01e5d016fed0d790256637c3dc4423635b4ab3d9074880+1164/plugins/todo.js"; // TODO: Use version (+X)
Markdown.use(...hider);
Markdown.use(...iframe);
Markdown.use(...todo);

// Constants
/// Formatters/Converters
/// Intl
const rtf = new Intl.RelativeTimeFormat();
const dtf = new Intl.DateTimeFormat("lt-LT");
/// Other
const dateUnits = {
	year: 24 * 60 * 60 * 1000 * 365,
	month: (24 * 60 * 60 * 1000 * 365) / 12,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000,
	second: 1000,
};

// Functions
const newElement = (
	elementClass,
	tag,
	contents = [],
	attributes = {},
	special = () => {}
) => {
	let element = document.createElement(tag);
	element.classList.add(elementClass);
	if (Array.isArray(contents))
		contents.forEach(async (content) => {
			element.appendChild(content);
		});
	else element.innerHTML = contents;
	Object.keys(attributes).forEach(async (attribute) => {
		if (attribute === "events")
			Object.keys(attributes[attribute]).forEach((interaction) =>
				element.addEventListener(
					interaction,
					attributes[attribute][interaction]
				)
			);
		else element.setAttribute(attribute, attributes[attribute]);
	});
	special(element);
	return element;
};

const fromTemplate = (template, templateValues) => {
	const specialAttributes = ["innerHTML", "innerText", "outerHTML"];
	let element = template.content.cloneNode(true);
	Object.keys(templateValues).forEach((item) => {
		let itemElement = element.querySelector("." + item);
		Object.keys(templateValues[item]).forEach((attribute) => {
			if (attribute === "interactions")
				Object.keys(templateValues[item][attribute]).forEach((interaction) => {
					itemElement.addEventListener(
						interaction,
						templateValues[item][attribute][interaction]
					);
				});
			if (attribute === "appendChildren")
				templateValues[item][attribute].forEach((child) => {
					itemElement.appendChild(child);
				});
			else if (specialAttributes.includes(attribute))
				itemElement[attribute] = templateValues[item][attribute];
			else itemElement.setAttribute(attribute, templateValues[item][attribute]);
		});
	});
	return element;
};
const getTemplate = (template) => {
	return fetch(`/client/assets/elements/${template}.html`, { method: "GET" })
		.then((response) => response.text())
		.then((text) => {
			return new DOMParser()
				.parseFromString(text, "text/html")
				.querySelector("template");
		});
};

const appropriateUnit = (difference) => {
	for (let unit in dateUnits)
		if (unit === "second" || Math.abs(difference) > dateUnits[unit])
			return unit;
};
const formatDateDifference = (date) => {
	let difference = date - new Date();
	let unit = appropriateUnit(difference);
	try {
		return rtf.format(Math.round(difference / dateUnits[unit]), unit);
	} catch (error) {
		console.log("Format errored, date attempted:", date, "; Error: ", error);
		return 0;
	}
};
const formatDateTime = (date) => {
	return dtf.format(date);
};

const markdownToHTML = (markdown) => {
	return Markdown.render(unescape(escape(markdown).replace(/%A0/g, "%20")));
};

const selfAsFollow = () => { // Just do inline?
	return {
		address: location.host,
	};
};

const preventHTMLInContentEditable = (event) => {
	if (event.key === "Enter") {
		document.execCommand("insertLineBreak");
		event.preventDefault();
	}
};

// Random Junk
const arrayFromCSV = (CSV) => {
	return CSV.split(",").filter((element) => element !== "");
};
const sortElementsByPostedSort = (a, b) =>
	a.classList.contains("post")
		? sortElementsByPostedSortPinned(a, b) ??
		  sortElementsByPostedSortPosted(a, b)
		: sortElementsByPostedSortPosted(a, b);
const sortElementsByPostedSortPosted = (a, b) =>
	a.getAttribute("posted") > b.getAttribute("posted") ? -1 : 1;
const sortElementsByPostedSortPinned = (a, b) =>
	a.getAttribute("pin") === "true"
		? -1
		: b.getAttribute("pin") === "true"
		? 1
		: null;
const sortElementsByPosted = (className) => {
	Array.from(document.querySelectorAll(`.${className}`))
		.sort(sortElementsByPostedSort)
		.forEach((element) => element.parentElement.appendChild(element));
};

// File IO
const timeoutSignal = (time = Constant.IOTimeout) => {
	let controller = new AbortController();
	let signal = controller.signal;
	setTimeout(() => controller.abort(), time);
	return signal;
};
const readFromFile = (file) => {
	return fetch(profileLocationFromFile(file), { method: "GET" })
		.then((response) => response.json())
		.then((json) => json);
};
const writeToFile = (file, object) => {
	return fetch(profileLocationFromFile(file), {
		method: "PUT",
		body: JSON.stringify(object),
	});
};
const locationFromFile = (file) => {
	if (!Constant.acceptedFiles.includes(file)) throw "Not an accepted file!";
	else return `/store/${file}.json`;
};
const profileLocationFromFile = (file) => {
	if (!Constant.acceptedFiles.includes(file)) throw "Not an accepted file!";
	else return `hyper://${Setting.profileDrive}${locationFromFile(file)}`;
};

export {
	newElement,
	fromTemplate,
	getTemplate,
	formatDateDifference,
	formatDateTime,
	markdownToHTML,
	selfAsFollow,
	preventHTMLInContentEditable,
	arrayFromCSV,
	sortElementsByPosted,
	readFromFile,
	writeToFile,
	locationFromFile,
	profileLocationFromFile,
	timeoutSignal,
};
