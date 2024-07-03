// export function makeRouter(routes) {
//   const router = function () {
//     const hash = window.location.hash.slice(2);
//     const parts = hash.split("/");
//     const route = routes[parts[0]];
//     if (route) {
//       route(parts[1]);
//     } else {
//       console.log("Route not found");
//     }
//   };
//   window.onhashchange = router;
//   return router;
// }

export function makeRouter(routes) {
  const router = () => {
    const path = window.location.hash.slice(1);

    if (routes[path]) {
      routes[path]();
    } else {
      console.log(`Route ${path} not found`);
    }
  };

  window.addEventListener("popstate", router);
  window.addEventListener("hashchange", router);
  return router;
}
