#include <sqlite3.h>
#include <iostream>
using namespace std;
class Database {
	public:
		int init();
		void parse(char s[]);
		void close();
		int insert(string username, string password);
		int remove(int rowid);
	private:
		sqlite3 *DB;
};