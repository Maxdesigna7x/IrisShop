import sqlite3
import utils

DB = 'shop.db'


def create_connection():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()
    return conn, cursor


def register_new_product(nombre, descripcion, costo, precio, fecha, id_categoria, stock):
    conn, cursor = create_connection()

    cursor.execute("SELECT MAX(id) FROM productos")
    last_id = cursor.fetchone()[0]
    id_for_image = last_id + 1 if last_id is not None else 0
    nombreFix = utils.clean_filename(nombre)
    dir_image = f"{id_categoria}_{id_for_image}_{nombreFix}.jpg"

    add_product_to_db = '''INSERT INTO productos (nombre, descripcion, costo, precio, imagen, fecha, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)'''
    cursor.execute(add_product_to_db, (nombreFix, descripcion, costo, precio, dir_image, fecha, id_categoria))
    product_id = cursor.lastrowid

    add_product_to_stock = '''INSERT INTO stock (id_producto, cantidad) VALUES (?, ?)'''
    add_product_to_stock_query = add_product_to_stock.format(product_id, stock)
    cursor.execute(add_product_to_stock_query, (product_id, stock))

    conn.commit()  # Commit the transaction
    conn.close()
    return product_id


def get_producto(producto_id):
    conn, cursor = create_connection()
    query = '''SELECT p.nombre, p.id_categoria, p.imagen, s.cantidad
               FROM productos p
               JOIN stock s ON p.id=s.id_producto
               WHERE p.id=?'''
    result = cursor.execute(query, (producto_id,))
    row = result.fetchone()
    conn.close()
    return row if row else None


def increase_stock_existing_product(product_id, quantity):
    conn, cursor = create_connection()

    search_product = '''SELECT id FROM productos WHERE id=?'''
    #product_id = None

    try:
        result = cursor.execute(search_product, (product_id,)).fetchone()
        product_id = result[0] if result else None
    except sqlite3.Error as e:
        print('Error searching for product', e)

    if product_id is not None:
        add_to_stock = '''UPDATE stock SET cantidad=cantidad+? WHERE id_producto=?'''
        query = add_to_stock.format(quantity, product_id)
        cursor.execute(query, (quantity, product_id))
        conn.commit()  # Commit the transaction
        conn.close()
        return True
    else:
        print('Product not found')
        conn.close()


def get_existing_client(conn, cliente):
    cursor = conn.cursor()
    query = "SELECT id FROM clientes WHERE nombre = ? OR telefono = ?"
    cursor.execute(query, (cliente['nombre'], cliente['telefono']))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        # If the client does not exist, create a new one and return its id
        return register_new_client(conn, cliente)


def register_new_client(conn, cliente):
    cursor = conn.cursor()
    query = "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)"
    cursor.execute(query, (cliente['nombre'], cliente['telefono']))
    conn.commit()
    return cursor.lastrowid


def registro_de_venta(venta):
    conn, cursor = create_connection()
    cliente_id = get_existing_client(conn, venta['cliente'])

    # Check if exist each product
    for product_id in venta['productos']:
        query = '''SELECT * FROM productos WHERE id=?'''
        result = cursor.execute(query, (product_id['id'],)).fetchone()

        if not result:
            raise Exception(f'Product with ID {product_id} not found')

    # Check if there's enough stock for each product in the sale
    for producto in venta['productos']:
        query = "SELECT cantidad FROM stock WHERE id_producto = ?"
        cursor.execute(query, (producto['id'],))
        result = cursor.fetchone()

        if not result or result[0] < producto['cantidad']:
            raise Exception("No hay suficiente stock para el producto {} en la venta".format(producto['nombre']))

    # Register the sale in the `ventas` table
    query = "INSERT INTO ventas (id_cliente, fecha) VALUES (?, ?)"
    cursor.execute(query, (cliente_id, venta['fecha']))
    venta_id = cursor.lastrowid

    # Register the sale details in the `detalle de venta` table
    for producto in venta['productos']:
        query = "INSERT INTO detalledeventa (id_venta, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)"
        cursor.execute(query, (venta_id, producto['id'], producto['cantidad'], producto['precio']))

    conn.commit()
    conn.close()


def create_categoria(nombre):
    conn, cursor = create_connection()
    # Check if the category with the given name already exists
    cursor.execute("SELECT * FROM categorias WHERE nombre=?", (nombre,))
    if cursor.fetchone():
        print("Category already exists")
        return

    cursor.execute("INSERT INTO categorias (nombre) VALUES (?)", (nombre,))
    conn.commit()
    conn.close()


def obtener_categorias():
    conn, cursor = create_connection()

    # Retrieve all category names from the 'categorias' table
    cursor.execute("SELECT nombre FROM categorias")
    categorias = cursor.fetchall()

    conn.close()

    # Return the list of category names
    return [category[0] for category in categorias]


# ------------------- Use Examples of functions --------------------------------
# Sample venta data with a new client and some products
ventaExample = {
    'cliente': {'nombre': 'John Doe', 'telefono': '1234567890'},
    'productos': [
        {'id': 2, 'cantidad': 5, 'precio': 5},
        {'id': 3, 'cantidad': 3, 'precio': 14}
    ],
    'fecha': '2022-03-28'
}

# nombre, descripcion, costo, precio, imagen, fecha, id_categoria, stock
item_nombre = 'Vestido'
item_descripcion = 'Vestido sexy pa porno'
item_costo = 25.0
item_precio = 40.0
item_imagen = None
item_fecha = '2022-02-14'
item_id_categoria = 1
item_stock = 8

"""
register_new_product(nombre=item_nombre,
                     descripcion=item_descripcion,
                     costo=item_costo,
                     precio=item_precio,
                     imagen=item_imagen,
                     fecha=item_fecha,
                     id_categoria=item_id_categoria,
                     stock=item_stock)

# Ejemplo de uso get_producto:
producto_id = 5
resultado = get_producto(producto_id)
if resultado is not None:
    print("ID:", producto_id)
    print("Nombre:", resultado[0])
    print("Categoría:", resultado[1])
    print("Stock Actual:", resultado[3])
    print("Imagen:", resultado[2])
else:
    print("No se encontró ningún producto con ese ID.")  
             
"""
#registro_de_venta(ventaExample)
# create_categoria("vestidos")
# create_categoria("pantalones")
# create_categoria("shores")
# increase_stock_existing_product(3, 12)