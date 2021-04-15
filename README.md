
For a class assignment, I made a chatroom app using React.js and sequelize. 

When first starting the app, you are prompted to log in with a username and password. The password must be 8 - 32 characters long and contain a capital, lowercase, number, and special character. If you do not have an account, click on signup to make one. The provided username and password are compared to the username and password hash stored in a database. If they match, you will be logged in.

After logging in, an RSA keypair is generated. The public key is saved to your user database while the private key is stored during the session. A new keypair is generated each session. To begin chatting, use the search bar to look up a user. If the user exists, you’ll be provided their name and public key. If it doesn’t exist or they are offline (defined as there being more than 20 seconds since the last time they contacted the server) nothing happens. If a user is found, A session key is made and is sent to the other user using their public key. When they receive the message, they decrypt the message with their private key to get the session key and they can begin chatting.

Users ping the server every 5 seconds to confirm they are online and confirm the online status of the people they are chatting with and they ping it every half second to check for messages. 

# Implementation
To deploy the app, you must have node.js and mysql installed on your computer. 

Nodejs can be downloaded here: https://nodejs.org/en/download/
For SQL, I recommend using Workbench: https://www.mysql.com/products/workbench/

Once you have workbench installed, run it and set up a localhost connection by clicking the + icon. You can name it whatever you want but keep the other default values as-is. Once you’ve made your connection, click on it to go to the main query page. Type the command
CREATE DATABASE IF NOT EXISTS chat_DB;
and then click on the lightning bolt icon.

To set up the application, open a terminal, cd to where you want to save the application and run the following commands:
git clone https://github.com/mweston6288/chatroomApp.git
cd chatroomApp
npm run setup

Once setup is finished, you’ll be prompted with a few questions to make the certificate and private key. You can fill them in or leave them blank. Finally, to start the app, run npm run start and then go to https://localhost:8081. Depending on your browser securities, a warning will appear because of the app using a self-signed certificate. Ignore it and continue. 



# How to Use
After the app runs, you’ll be asked to log in. If you don’t have an account, click on sign up in the bottom right corner of the login window. The username must be unique and the password must be 8-32 characters and have capital, lowercase, numbers, and special symbols.

Once you’ve logged in, type in a username in the search bar. Since this is deployed, locally, you’ll need to open a second window to the site and log into a different account. If you type the correct name and hit search, their name will appear under the search bar. Your name will also appear on the other user’s window. Click on the user you want to chat with. The person you are chatting with will be highlighted blue. 

You can then type a message into the chat window. When you click send, the message you sent will appear under the text field and it will also appear on the other user’s page if they selected you to chat with (Your name must be highlighted blue on their screen). 


Video demonstration: https://youtu.be/M551Hilf53U

# Issues and limitations
Because this project was made in Javascript, any system limits in Javascript apply to this. In particular, Javascript does not allow client-to-client communication. To work around this, the server has to act as a middleman for all communication. When a user sends a message, it is saved in a database on the server and then the recipient checks the server for that message.

Another limitation I found was there aren’t any frameworks available that provide encryption options like I was hoping for. The closest thing I found was a framework called node-forge (https://www.npmjs.com/package/node-forge/v/0.10.0) . However, it seems primarily intended for demonstration purposes rather than for any practical use.

When transferring anything between client and server, the data is sent as a JSON object. JSON does not support transferring methods and the methods that node-forge uses for encryption and decryption are linked to the keys and ciphers it makes. As an example you’ll see frequently in the code, if I use the rsa.generateKeyPair() method it will create a public key pair. Then to encrypt something, I have to use publicKey.encrypt(). However, when I send the public key to another user so they can send me an encrypted message, the public key is packaged in a JSON object which stores the key values (publicKey.n and publicKey.e) but does not have the publicKey.encrypt() message. So the public key can no longer encrypt anything. To work around it, I have the code build a new public key and then replace the data values.

Known bugs
There is a small possibility when a message is received that it will get lost because the app decides to check and update contacts at the same time it is going through the contacts to determine who sent it.

If a user logs out and logs back in within 20 seconds, the users’ session keys will desync and their message will not decrypt properly.


# Conclusion
This is a far-from-perfect implementation of a chatroom app. At the bare minimum I learned a bit about how Javascript objects work and how to manipulate them and I also got a feeol for what goes on when sending and receiving data. One of my original ideas for this project involved having the server save every message for users which I ultimately decided against because of the sheer overhead needed to keep it secure. For instance, if I stored the encrypted messages, I’d also need to store the session keys so they could be decrypted. Because storing the session keys is a risk, I decided to not permanently save messages.

While it’s not an actually good app, I do feel like it demonstrates the very basic steps that go into encryption and key exchange. Each user has a public and private key. The public key is freely available for use while the private key is held by the user. When someone wants to communicate, they make a session key and encrypt it with the recipient’s public key. The recipient decrypts the message using their private key and then the two of them send messages, using the session key to encrypt and decrypt the message.

