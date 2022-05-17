const express = require("express");
const redis = require("redis");
const app = express();

const PORT = process.env.PORT || 3002;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost";

const client = redis.createClient({ url: REDIS_URL });
(async () => {
    await client.connect();
})();

app.get("/counter/:bookId", async (req, res) => {
    const { bookId } = req.params;

    try {
        const cnt = await client.get(bookId);
        res.json({ bookId, cnt });
    } catch (e) {
        console.error(e);
        res.statusCode(500).json({ errcode: 500, errmsg: "redis error" });
    }
});

app.post("/counter/:bookId/incr", async (req, res) => {
    const { bookId } = req.params;

    try {
        const cnt = await client.incr(bookId);
        res.json({ bookId, cnt });
    } catch (e) {
        console.error(e);
        res.statusCode(500).json({ errcode: 500, errmsg: "redis error" });
    }
});

app.use((req, res) => {
    res.statusCode(404).json({ status: 404, msg: "Not found" });
});

app.use((err, req, res, next) => {
    res.statusCode(500).json({ status: 500, msg: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Приложение слушает порт http://localhost:${PORT}`);
});
