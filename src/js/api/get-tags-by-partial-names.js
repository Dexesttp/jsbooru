const database = require("../database");

module.exports = function(req, res) {
    const request = req.query.q ? req.query.q.split(" ") : [];
    const firsts = request.slice(0, -1);
    const queried = request.length > 0 ? request[request.length - 1] : "";
    if(queried === "") {
        res.send([{
            result: request.join(" "),
            query: queried,
            name: request.join(" "),
            match: true,
            count: 0,
        }]);
        return;
    }
    database.getTags(queried, function(results) {
        if(results.length === 0) {
            res.send([{
                result: request.join(" "),
                query: queried,
                name: "(no match)",
                match: false,
                count: 0,
            }]);
            return;
        }
        const str1 = firsts.join(" ");
        const str = str1 ? str1 + " " : "";
        res.send(results.map(r => ({
            result: str + r.name,
            query: queried,
            name: r.name,
            match: true,
            count: r.count || 0,
        })));
    });
}
