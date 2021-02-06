CC = g++
CFLAGS = -l sqlite3

all: serverFiles/*.cpp
	$(CC) serverFiles/*.cpp -o server $(CFLAGS)
