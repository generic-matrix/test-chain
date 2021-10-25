<!-- TABLE OF CONTENTS -->
### About The Project

> This is a blockchain project from scratch , using the custom made blockchain have created a cryptocurrency. 

### The project features:
* P2P connections to create a blockchain

### To install 
Run 
```
npm install .
```
### To Run test
```
npm run test
```

### How to use
You can open two terminal 

```
Terminal 1 : npm run dev
Terminal 2 : HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001  npm run dev
```
This ports were given for an exampple, you can use any

You can head over to cURL or Postman to check the blocks in the blockchain:
```
curl --location --request GET 'http://<host>:<port>/blocks'
```

To mine a block in blockchain:
```
curl --location --request POST 'http://<host>:<port>/mine' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data" : "your data"
}'
```

### Functional Requirements
* To create a distributed and decentrilized blockchain 
* To implement POW algo
* To use SHA256 algo to generate hash
* To implement variable mine rate


