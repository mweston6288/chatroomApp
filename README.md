# chatroomApp
A class project: Make a secure chat room

## Considerations
* Will need to make a server
* Will need to save messages either locally or in a database (local more practical)
* Will need a username/password

## Plans
* Build in C++; If unable, switch to Javascript
* Server connects to a database; database stores user info, and pending messages
* Client sends message to server; server stores it in database
* Client connects to server to receive pending messages; server deletes message after sending to client
* Client pings server every 5-10 seconds
* Message chains are stored locally

## Plans for secure message storage
* On user creation, make a public/private key
* public key is stored in server, private is stored on localstorage
* When users send messages, a shared key is generated
* shared key is stored in database after being encrypted by user public key

## limits with solution
* User cannot change keys
* User cannot change devices

## Promising solution
https://github.com/digitalbazaar/forge#performance

## Idea for security
* on login, create a key pair. Store public in server. Store private in userContext
* When sending first message, flag as key delivery. Create shared key
* Get receiver's public key. Encrypt shared key using public key
* Recevier gets key and decrypts using their private key.

## Breakthrough
* Saving public key top DB causes it to lose it's methods. Can restore by building another key and setting each value.
						keypair.publicKey.e.data = res.data.publicKey.e.data
						keypair.publicKey.e.s = res.data.publicKey.e.s
						keypair.publicKey.e.t = res.data.publicKey.e.t
						keypair.publicKey.n.data = res.data.publicKey.n.data
						keypair.publicKey.n.s = res.data.publicKey.n.s
						keypair.publicKey.n.t = res.data.publicKey.n.t
* Saving private key to context keeps the key. No further action needed