from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
from datetime import datetime
import os
import json
import FunctionDB
from PIL import Image
import base64

app = Flask(__name__)

# Configura la carpeta donde se guardarán las imágenes
UPLOAD_FOLDER = 'assets_images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ---------------------- cargar paginas ----------------------------------------

@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/create_product')
def load_create_product():
    return send_from_directory('templates', 'create_product.html')

@app.route('/increase_stock')
def load_increase_stock():
    return send_from_directory('templates', 'increase_stock.html')

@app.route('/sell_product')
def load_sell_product():
    return send_from_directory('templates', 'sell_product.html')

@app.route('/search_purchases')
def load_search_purchases():
    return send_from_directory('templates', 'search_purchases.html')

@app.route('/daily_sales')
def load_daily_sales():
    return send_from_directory('templates', 'daily_sales.html')

@app.route('/gallery')
def load_gallery():
    return send_from_directory('templates', 'gallery.html')

# ---------------------- cargar paginas ----------------------------------------
@app.route('/registrar-producto', methods=['POST'])
def registrar_producto():
    # Obtiene los datos enviados desde el formulario HTML
    nameOrigin = request.form['name']
    nameData = FunctionDB.utils.clean_filename(nameOrigin)
    descriptionData = request.form['description']
    category_id = request.form['category_id']
    imageData = request.files['image']
    costData = request.form['cost']
    priceData = request.form['price']
    stockData = request.form['stock']

    product_id = FunctionDB.register_new_product(nombre=nameData,
                     descripcion=descriptionData,
                     costo=costData,
                     precio=priceData,
                     fecha=datetime.now(),
                     id_categoria=category_id,
                     stock=stockData)
    
    # upload_image
    # Verifica si se ha seleccionado una imagen
    if imageData:
        # Genera un nombre único para la imagen
        filename = f"{category_id}_{product_id}_{nameData}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Guarda la imagen en la carpeta "assets_images"
        imageData.save(filepath)

        # Crea un diccionario con la respuesta del servidor
        response = {
            'success': True,
            'message': 'La imagen se ha cargado correctamente.'
        }

        # Convierte el diccionario en un JSON y agrega el encabezado "Content-Type: application/json"
        return jsonify(response), 200, {'Content-Type': 'application/json'}

    # Si no se ha seleccionado una imagen, devuelve un error en formato JSON
    response = {
        'success': False,
        'message': 'Error al cargar la imagen.'
    }

    return jsonify(response), 400, {'Content-Type': 'application/json'}


@app.route('/get-info-by-id', methods=['POST'])
def getInfoById():
    # Obtiene los datos enviados desde el formulario HTML
    producto_id = request.form['id']

    response = FunctionDB.get_producto(producto_id)

    if response is not None:
        # Lee la imagen como bytes
        image_path = 'assets_images/' + response[2]
        with open(image_path, 'rb') as image_file:
            image_bytes = image_file.read()

        # Convierte los bytes de la imagen a una cadena base64
        image_base64 = base64.b64encode(image_bytes).decode()

        data = {
            "nombre": response[0],
            "categoria": response[1],
            "stock": response[3],
            "imagen": image_base64
        }
        payload = {"id": producto_id, **dict(data)}
        return jsonify({"success": True, "payload": payload}), 200
    else:
        return jsonify({"success": False, "error": f'Product with ID={producto_id} was not found.'}), 404


@app.route('/increase-stock', methods=['POST'])
def increase_stock():
    # Obtiene los datos enviados desde el formulario HTML
    producto_id = request.form['id']
    stock_increase = request.form['stock_increase']

    response = FunctionDB.increase_stock_existing_product(product_id=producto_id, quantity=stock_increase)

    if response is not None:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 404


@app.route('/assets/<path:filename>')
def send_file(filename):
    return send_from_directory('assets_images', filename)


@app.route('/obtener-categorias')
def obtener_datos():
    categorias = FunctionDB.obtener_categorias()
    categorias_json = json.dumps(categorias)
    print("esta obteniendo categorias ahoraaaaa")
    return jsonify({"categorias": categorias_json})


@app.route('/create-categoria', methods=['POST'])
def create_categoria():
    category_name = request.form.get('name')    
    print(category_name)
    FunctionDB.create_categoria(category_name)
    response = {
        'success': True,
        'message': 'Se creo la categoria.'
    }

    return jsonify(response), 200, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)