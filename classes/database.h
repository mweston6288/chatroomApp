#include <sqlite3.h>
#include <iostream>
using namespace std;
class Database {
	public:
		int init();
		void close();
		int insert(string username, string password);
	private:
		sqlite3 *DB;
};