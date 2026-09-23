const express = require("express");
const app = express();
const path = require("path");
const indexRouter = require("./routes/indexRouter");

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`app is listening on port ${PORT}`);
});
