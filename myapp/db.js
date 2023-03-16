
const redis = require('redis');
const client = redis.createClient(
    {url:"redis://localhost:6379"}
    // {port:6378}
);
console.log("test--")

client.connect()
  .then(async (res) => {
    console.log('connected--');
    // Write your own code here

    // Example
    // const value = await client.lRange('data', 0, -1);
    // console.log(value.length);
    // console.log(value);
    // client.quit();
    client.on("error", function(error) {
        console.error(error);
      });
      
      client.set("bob", "i am bob", redis.print);
      client.get("bob", redis.print);
  })
  .catch((err) => {
    console.log('err happened' + err);
  });