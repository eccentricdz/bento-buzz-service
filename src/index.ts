import express from "express";
import { fetchArticles } from "./utils/data";
import { andThen, pipe } from "ramda";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.get(
  "/",
  // eslint-disable-next-line
  (req, res) => pipe(fetchArticles, andThen(res.json.bind(res)))(),
);

app.listen(port, () => {
  console.info(`🍱 Bento Buzz is listening on port ${port}`);
});
