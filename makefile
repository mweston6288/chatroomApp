CC = g++
CFLAGS = -l sqlite3

all: serverFiles/*.cpp clientFiles/*.cpp
	$(CC) serverFiles/*.cpp -o server $(CFLAGS)
	$(CC) clientFiles/*.cpp -o client $(CFLAGS) -std=c++14 -pthread
