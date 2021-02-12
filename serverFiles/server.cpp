/*
	Code acquired from https://ncona.com/2019/04/building-a-simple-server-with-cpp/
	with intents to edit
*/

/*
	compile command g++ server.cpp -l sqlite3
*/ 

#include <sys/socket.h> // For socket functions
#include <netinet/in.h> // For sockaddr_in
#include <cstdlib>		// For exit() and EXIT_FAILURE
#include <iostream>		// For cout
#include <unistd.h>		// For read
#include <sqlite3.h>
#include <signal.h>
#include <string.h>
#include <sys/types.h>
#include <arpa/inet.h> //close

#include "database.h"
using namespace std;


int main()
{
	Database db;
	// Create the DB. Close if failed
	if (!db.init()){
		return 0;
	}
	db.insert("User", "test");
	db.insert("User2", "test");
	db.remove(1);

	int opt = 1;
	int server, addrlen, newClient, clientSockets[30], maxClientss = 30, i, valread, sd;
	int maxSocket;
	struct sockaddr_in address;

	char buffer[1025]; //data buffer of 1K

	//set of socket descriptors
	fd_set readfds;

	//a message
	string message = "ECHO Daemon v1.0 \r\n";

	//initialise all clientSockets[] to 0 so not checked
	for (i = 0; i < maxClientss; i++)
	{
		clientSockets[i] = 0;
	}

	//create a master socket
	if ((server = socket(AF_INET, SOCK_STREAM, 0)) == 0)
	{
		perror("socket failed");
		exit(EXIT_FAILURE);
	}

	//set master socket to allow multiple connections ,
	//this is just a good habit, it will work without this
	if (setsockopt(server, SOL_SOCKET, SO_REUSEADDR, (char *)&opt, sizeof(opt)) < 0)
	{
		perror("setsockopt");
		exit(EXIT_FAILURE);
	}

	//type of socket created
	address.sin_family = AF_INET;
	address.sin_addr.s_addr = INADDR_ANY;
	address.sin_port = htons(9999);

	//bind the socket to localhost port 8888
	if (bind(server, (struct sockaddr *)&address, sizeof(address)) < 0)
	{
		perror("bind failed");
		exit(EXIT_FAILURE);
	}
	printf("Listener on port %d \n", 9999);

	//try to specify maximum of 3 pending connections for the master socket
	if (listen(server, 3) < 0)
	{
		perror("listen");
		exit(EXIT_FAILURE);
	}

	//accept the incoming connection
	addrlen = sizeof(address);
	signal(SIGPIPE, SIG_IGN);

	puts("Waiting for connections ...");

	while (1)
	{
		//clear the socket set
		FD_ZERO(&readfds);

		//add master socket to set
		FD_SET(server, &readfds);
		maxSocket = server;

		//add child sockets to set
		for (i = 0; i < maxClientss; i++)
		{
			//socket descriptor
			sd = clientSockets[i];

			//if valid socket descriptor then add to read list
			if (sd > 0)
				FD_SET(sd, &readfds);

			//highest file descriptor number, need it for the select function
			if (sd > maxSocket)
				maxSocket = sd;
		}

		//wait for an activity on one of the sockets , timeout is NULL ,
		//so wait indefinitely
		if ((select(maxSocket + 1, &readfds, NULL, NULL, NULL) < 0) && (errno != EINTR))
		{
			printf("select error");
		}

		//If something happened on the master socket ,
		//then its an incoming connection
		if (FD_ISSET(server, &readfds))
		{
			if ((newClient = accept(server, (struct sockaddr *)&address, (socklen_t *)&addrlen)) < 0)
			{
				perror("accept");
				exit(EXIT_FAILURE);
			}

			//inform user of socket number - used in send and receive commands
			printf("New connection , socket fd is %d , ip is : %s , port : %d\n ", newClient, inet_ntoa(address.sin_addr), ntohs(address.sin_port));

			//send new connection greeting message
			if (send(newClient, message.c_str(), message.size(), 0) != message.size())
			{
				perror("send");
			}

			puts("Welcome message sent successfully");

			//add new socket to array of sockets
			for (i = 0; i < maxClientss; i++)
			{
				//if position is empty
				if (clientSockets[i] == 0)
				{
					clientSockets[i] = newClient;
					printf("Adding to list of sockets as %d\n", i);

					break;
				}
			}
		}

		//else its some IO operation on some other socket
		for (i = 0; i < maxClientss; i++)
		{
			sd = clientSockets[i];

			if (FD_ISSET(sd, &readfds))
			{
				//Check if it was for closing , and also read the
				//incoming message
				if ((valread = read(sd, buffer, 1024)) == 0)
				{
					//Somebody disconnected , get his details and print
					getpeername(sd, (struct sockaddr *)&address,(socklen_t *)&addrlen);
					printf("Host disconnected , ip %s , port %d \n",
						   inet_ntoa(address.sin_addr), ntohs(address.sin_port));

					//Close the socket and mark as 0 in list for reuse
					close(sd);
					clientSockets[i] = 0;
				}
				//Echo back the message that came in
				else
				{
					//set the string terminating NULL byte on the end
					//of the data read
					buffer[valread] = '\0';
					cout << buffer << endl;
					db.parse(buffer);
					send(sd, buffer, strlen(buffer), 0);
				}
			}
		}
	}
}
