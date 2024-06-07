module.exports = (app) => {
  app.use("/", require("./welcomeRouter"));
  app.use("/convert", require("./convertRouter"));

};
