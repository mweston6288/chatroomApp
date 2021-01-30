CC = g++
CFLAGS = -l sqlite3

all: *.cpp classes/*.cpp
	$(CC) *.cpp classes/*.cpp $(CFLAGS)