#include "database.h"
#include <iostream>
#include <sqlite3.h>

using namespace std;

int Database::init(){
	string sql = "CREATE TABLE IF NOT EXISTS PERSON("
				 "ID INT PRIMARY KEY     NOT NULL, "
				 "NAME           TEXT    NOT NULL, "
				 "SURNAME          TEXT     NOT NULL, "
				 "AGE            INT     NOT NULL, "
				 "ADDRESS        CHAR(50), "
				 "SALARY         REAL );";
	int exit = 0;
	exit = sqlite3_open("example.db", &DB);
	char *messaggeError;
	exit = sqlite3_exec(DB, sql.c_str(), NULL, 0, &messaggeError);

	if (exit != SQLITE_OK)
	{
		cerr << "Error Create Table" << endl;
		sqlite3_free(messaggeError);
		return 0;
	}
	else
		cout << "Table created Successfully" << endl;
	return 1;
}
void Database::close(){
	sqlite3_close(DB);
}