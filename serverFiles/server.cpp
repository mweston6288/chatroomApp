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

	// Create a socket (IPv4, TCP)
	int sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd == -1)
	{
		cout << "Failed to create socket. errno: " << errno << endl;
		exit(EXIT_FAILURE);
	}

	// Listen to port 9999 on any address
	sockaddr_in sockaddr;
	sockaddr.sin_family = AF_INET;
	sockaddr.sin_addr.s_addr = INADDR_ANY;
	sockaddr.sin_port = htons(9999); // htons is necessary to convert a number to
									 // network byte order
	if (bind(sockfd, (struct sockaddr *)&sockaddr, sizeof(sockaddr)) < 0)
	{
		cout << "Failed to bind to port 9999. errno: " << errno << endl;
		exit(EXIT_FAILURE);
	}

	// Start listening. Hold at most 10 connections in the queue
	if (listen(sockfd, 10) < 0)
	{
		cout << "Failed to listen on socket. errno: " << errno << endl;
		exit(EXIT_FAILURE);
	}

	// Grab a connection from the queue
	auto addrlen = sizeof(sockaddr);
	CONNECT:
	int connection = accept(sockfd, (struct sockaddr *)&sockaddr, (socklen_t *)&addrlen);
	signal(SIGPIPE, SIG_IGN);
	if (connection < 0)
	{
		cout << "Failed to grab connection. errno: " << errno << endl;
		exit(EXIT_FAILURE);
	}

	// Read from the connection
	char buffer[100];
	int bytesRead;

	while ((bytesRead = recv(connection, buffer, 100, 0))>0){
		cout << "The message was: " << buffer<<endl;
		fflush(stdout);
		// Send a message to the connection
		string response = "Good talking to you\n";

		send(connection, response.c_str(), response.size(), 0);
	}
	goto CONNECT;
	// Close the connections
	close(connection);
	close(sockfd);
	db.close();
}