const database = require("../database");
const encode = require("../utils").encode;

module.exports = function(req, res) {
    const unsafeRequest = req.query.q ? req.query.q.split(" ") : [];
    const request = unsafeRequest.map(tag => encode(tag));
    const firsts = request.slice(0, -1);
    const queried = request.length > 0 ? request[request.length - 1] : "";
    if (queried === "" || queried === "*") {
        res.send([
            {
                result: request.join(" "),
                type: "all-match",
                query: queried,
                name: request.join(" "),
                match: true,
                count: 0,
                count: 0,
                count: queried === "*" ? "all" : 0,
            },
        ]);
        return;
    }
    database.getTags(queried).then(function (results) {
        if (results.length === 0) {
            res.send([
                {
                    result: request.join(" "),
                    type: "no-match",
                    query: queried,
                    name: "(no match)",
                    match: false,
                    count: 0,
                },
            ]);
            return;
        }
        const str1 = firsts.join(" ");
        const str = str1 ? str1 + " " : "";
        Promise.all(
            results.map((tag) => {
                return new Promise(function (resolve, reject) {
                    database.getCountByTagList(tag.name).then((count) => {
                        resolve({
                            name: tag.name,
                            type: tag.type || "no-type",
                            count: count,
                        });
                    });
                });
            })
        ).then((tags) => {
            res.send(
                tags.map((r) => ({
                    result: str + r.name,
                    type: r.type,
                    query: queried,
                    name: r.name,
                    match: true,
                    count: r.count || 0,
                }))
            );
        });
    });
};
