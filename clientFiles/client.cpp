// Client side C/C++ program to demonstrate Socket programming
#include <stdio.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <netdb.h>
#define PORT 9999
#define LOCAL "127.0.0.1"

int main(int argc, char const *argv[])
{
	int sock;
	struct sockaddr_in server;
	char clientMessage[1024];
	char serverMessage[1024];

	char *IPBuffer;
	struct hostent *host;


	// Create a socket to send messages. Domain is IPv4 and TCP
	if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0)
	{
		printf("\n Socket creation error \n");
		return -1;
	}

	server.sin_family = AF_INET;
	server.sin_port = htons(PORT);

	// get IP address of Eustis3
	// If unable to, swap to localhost
	host = gethostbyname(LOCAL);

	IPBuffer = inet_ntoa(*((struct in_addr *)host->h_addr_list[0]));
	inet_pton(AF_INET, IPBuffer, &server.sin_addr);

	// Attempt to connect to server
	if (connect(sock, (struct sockaddr *)&server, sizeof(server)) < 0)
	{
		printf("\nConnection Failed \n");
		return -1;
	}

	while (1)
	{
		fgets(clientMessage, 1024, stdin);
		if (!strcmp(clientMessage, "\n"))
			continue;
		strcpy(clientMessage, strtok(clientMessage, "\n"));
		send(sock, clientMessage, strlen(clientMessage) + 1, 0);
		recv(sock, serverMessage, 1024, 0);
		if (!strcmp(serverMessage, "DC"))
		{
			printf("User input ends; end the client program\n");
			break;
		}
		printf("Answer from server: %s\n", serverMessage);
	}

	return 0;
}
