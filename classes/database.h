#include <sqlite3.h>

class Database {
	public:
		Database();
		int exit;
	private:
		sqlite3 *DB;
};