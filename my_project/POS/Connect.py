import pyrfc
import configparser
from pyrfc import Connection
import pyodbc
from functools import reduce
from tabulate import tabulate


# ============================================================================================= #
# ============================================================================================= #
# ===========================SAP CONNECTOR WITH PYTHON========================================== #
# ============================================================================================= #
# ============================================================================================= #

def connection():
    # Read the SAP configuration from the config file
    config = configparser.ConfigParser()
    config.read('.\\SAP\\config.ini')
    # Create a connection to SAP
    conn    = Connection(
    user        = config['SAP']['User'],
    passwd      = config['SAP']['Password'],
    client      = config['SAP']['Client'],
    ashost      = config['SAP']['AppServer'],
    sysnr       = config['SAP']['SystemNumber'],
    saprouter   = config['SAP']['Saprouter']
)
    return conn

# ============================================================================================= #
# ============================================================================================= #
# ===========================SQL CONNECTOR WITH PYTHON========================================== #
# ============================================================================================= #
# ============================================================================================= #

def connection_SQL(QuerySQL,QuerySQL_Style):
    # Read the SQL configuration from the config file
    config = configparser.ConfigParser()
    config.read('.\\SAP\\configSQL.ini')
    # Create a connection to SAP
    username    = config['SQL']['username']
    password    = config['SQL']['password']
    server      = config['SQL']['server']
    database    = config['SQL']['database']

    connection = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+ server + ';DATABASE=' + database + ';Trusted_Connection=yes;UID=' + username + ';PWD=' + password)
    cursor=connection.cursor()

    cursor.execute(QuerySQL) 

    if( QuerySQL_Style == "Insert" or QuerySQL_Style == "Update" or QuerySQL_Style == "Delete"):
        connection.commit()
    elif(QuerySQL_Style == "Select"):        
        ListDatas = cursor.fetchall() 
        data = []
        for i in ListDatas:    
           # if(row != None ):
           data.append(i)
        return data

    cursor.close()
    connection.close()
    

# ============================================================================================= #
# ============================================================================================= #
# ============================================================================================= #
# ============================================================================================= #