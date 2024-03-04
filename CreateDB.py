import sqlite3

DB = 'shop.db'

def create_productos_table():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS productos (
                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                     nombre TEXT NOT NULL,
                     descripcion TEXT,
                     costo REAL NOT NULL,
                     precio REAL NOT NULL,
                     imagen VARCHAR,
                     fecha DATE, -- Depending on your SQL dialect you might need to use a specific data type for date and time
                     id_categoria INT,
                     FOREIGN KEY (id_categoria) REFERENCES categorias(id)
                 )''')
    conn.commit()
    conn.close()

def create_stock_table():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS stock (
                     id INTEGER PRIMARY KEY,
                     id_producto INT,
                     cantidad INT,
                     FOREIGN KEY (id_producto) REFERENCES productos(id)
                 )''')
    conn.commit()
    conn.close()

def create_categorias_table():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS categorias (
                     id INTEGER PRIMARY KEY,
                     nombre TEXT NOT NULL
                 )''')
    conn.commit()
    conn.close()

def create_clientes_table():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS clientes (
                     id INTEGER PRIMARY KEY,
                     nombre TEXT NOT NULL,
                     telefono TEXT, -- Depending on your SQL dialect you might need to use a specific data type for phone numbers
                     password TEXT
                 )''')
    conn.commit()
    conn.close()

def create_ventas_table():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS ventas (
                     id INTEGER PRIMARY KEY,
                     id_cliente INT,
                     fecha DATE -- Depending on your SQL dialect you might need to use a specific data type for date and time
                 )''')
    conn.commit()
    conn.close()

def create_detalle_de_venta_table():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS detalledeventa (
                     id INTEGER PRIMARY KEY,
                     id_venta INT,
                     id_producto INT,
                     cantidad INT,
                     FOREIGN KEY (id_venta) REFERENCES ventas(id),
                     FOREIGN KEY (id_producto) REFERENCES productos(id)
                 )''')
    conn.commit()
    conn.close()

create_productos_table()
create_stock_table()
create_categorias_table()
create_clientes_table()
create_ventas_table()
create_detalle_de_venta_table()
