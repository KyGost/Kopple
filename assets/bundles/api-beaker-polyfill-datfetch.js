export default !/.*(BeakerBrowser).*/g.test(navigator.userAgent)
	? window.fetch
	: async (...args) => {
			if (args[1]) {
				if (args[1].method) {
					if (args[1].method === "PUT") {
						await beaker.hyperdrive.writeFile(args[0], args[1].body);
						return new Response(); // TODO: Improve fake response
					}
				}
				if (args[1].headers) {
					if (args[1].headers["X-Resolve"] === "none") {
						let [drive, path] = (
							args[0] +
							(args[0].endsWith("/") ? "" : "/") +
							"*"
						)
							.replace(/^.*:\/\/([^\/]*)(.*)$/i, "$1,$2")
							.split(",");
						let queryResult = await beaker.hyperdrive.query({
							drive: drive,
							path: path,
						});
						return new Response(
							JSON.stringify(
								queryResult.map(
									(item) =>
										item.path.replace(/^.*\/([^\/]*)$/i, "$1") +
										(item.stat.isDirectory() ? "/" : "")
								)
							)
						);
						// TODO: Improve fake response
						// TODO: Non-JSON output
						// TODO: Clean
					}
				}
			}
			return window.fetch(...args);
	  };
