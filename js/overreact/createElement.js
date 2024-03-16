export default (tagName, { attrs = {}, chiildren = [] } = {}) => {
  return {
    tagName,
    attrs,
    chiildren,
  };
};
