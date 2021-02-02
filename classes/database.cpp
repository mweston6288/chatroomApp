#include "database.h"
#include <iostream>
#include <sqlite3.h>

using namespace std;

int Database::init(){
	string sql = "CREATE TABLE IF NOT EXISTS USERS("
				 "USERNAME TEXT NOT NULL, "
				 "PASSWORD INT NOT NULL);";
	int exit = 0;
	exit = sqlite3_open("chatApp.db", &DB);
	if (exit){
		cout << "Error opening database"<<endl;
	}
	char *messaggeError;
	exit = sqlite3_exec(DB, sql.c_str(), NULL, 0, &messaggeError);

	if (exit != SQLITE_OK)
	{
		cerr << "Error Create Table "<< endl;
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
static int callback(void *data, int argc, char **argv, char **azColName)
{
	int i;
	fprintf(stderr, "%s: ", (const char *)data);

	for (i = 0; i < argc; i++)
	{
		printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
	}

	printf("\n");
	return 0;
}

int Database::insert(string username, string password){
	hash<string> passHash;
	string query = "SELECT * FROM USERS;";
	string sql = "INSERT INTO USERS (USERNAME, PASSWORD) VALUES('"+username+"', " + to_string(passHash(password))+");";

	char *messaggeError;

	int exit = sqlite3_exec(DB, sql.c_str(), NULL, 0, &messaggeError);
	if (exit != SQLITE_OK)
	{
		std::cerr << "Error Insert "<<sql << std::endl;
		sqlite3_free(messaggeError);
	}
	else
		std::cout << "Records created Successfully!" << std::endl;
	sqlite3_exec(DB, query.c_str(), callback, NULL, NULL);
	return 1;
}
int Database::remove(int rowid)
{
	hash<string> passHash;
	string query = "SELECT * FROM USERS;";
	string sql = "DELETE FROM USERS WHERE rowid = "+to_string(rowid)+";";

	char *messaggeError;

	int exit = sqlite3_exec(DB, sql.c_str(), NULL, 0, &messaggeError);
	if (exit != SQLITE_OK)
	{
		std::cerr << "Error Delete " << sql << std::endl;
		sqlite3_free(messaggeError);
	}
	else
		std::cout << "Deleted Successfully!" << std::endl;
	sqlite3_exec(DB, query.c_str(), callback, NULL, NULL);
	return 1;
}