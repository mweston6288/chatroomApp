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
