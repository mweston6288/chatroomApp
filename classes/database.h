#include <sqlite3.h>

class Database {
	public:
		int init();
		void close();
	private:
		sqlite3 *DB;
};