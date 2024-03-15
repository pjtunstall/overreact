export function createRouter(routes) {
	return function router() {
		const hash = window.location.hash.slice(2);
		const parts = hash.split("/");
		const route = routes[parts[0]];
		if (route) {
			route(parts[1]);
		} else {
			console.log("Route not found");
		}
	};
}
