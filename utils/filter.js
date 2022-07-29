module.exports = (body, ...include) => {
  const data = Object.keys(body);
  const newBody = data.reduce((acc, ele) => {
    if (include.includes(ele)) acc[ele] = body[ele];
    return acc;
  }, {});
  return newBody;
};
