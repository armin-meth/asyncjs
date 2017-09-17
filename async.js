function getJSON(url) {
    return new Promise((resolve, reject) => {
        const https = require("https");
        try {
            https.get(url, (response) => {
                let data = "";
                response.on("data", (part) => {
                    data += part;
                });
                response.on("end", () => {
                    try {
                         resolve(JSON.parse(data));
                    }
                    catch(e) {
                        reject("Error parsing data");
                    }
                });
            }).on("error", () => {
                reject("Error downloading data");
            });
        }
        catch(e) {
            reject("Error: " + e.message);
        }
    });
}
 
function request(generator) {
    var iterator = generator();
    function process(result) {
        if (result.done) {
            return;
        }
        const value = result.value;
        if (value instanceof Promise) {
            value.then(
                (data) => {
                    console.log(data);
                    process(iterator.next());
                }
            )
            .catch(
                err => {
                    iterator.throw(err);
                }
            );
        }
    }
    try {
        process(iterator.next());
    } 
    catch(e) {
        iterator.throw(e);
    }
}

function *DataGenerator() {
    try {
        yield getJSON("https://jsonplaceholder.typicode.com/posts/1");
        yield getJSON("https://jsonplaceholder.typicode.com/posts/2");
        // yield getJSON("https://jsonplaceholder.typicode.com/"); // Parsing error
        // yield getJSON(""); // Domain name error
    }
    catch (e) {
        console.log(e);
    }
}

// Run

console.log("Before");
request(DataGenerator);
console.log("After");