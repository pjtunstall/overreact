export function makeRouter(routes, isHash) {
  const router = () => {
    let path;
    if (isHash) {
      path = window.location.hash.slice(2);
    } else {
      path = window.location.pathname.slice(1);
    }
    
    if (routes[path]) {
      routes[path]();
    } else {
      console.log(`Route ${path} not found`);
    }
  };

  window.addEventListener("popstate", router);
  return router;
}
