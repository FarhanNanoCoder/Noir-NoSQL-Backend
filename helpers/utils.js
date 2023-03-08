export const generateUpdateObject = ({ params = [], req }) => {
  var obj;
  params.map((item, index) => {
    obj[item] = req.body[item];
  });
  return obj;
};
