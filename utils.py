import re
import os
from werkzeug.utils import secure_filename
from PIL import Image # You might need to install Pillow library for handling images


def save_image(img, category_id, product_id, product_name):
    filename = f'{category_id}_{product_id}_{secure_filename(product_name)}.jpg'
    upload_folder = 'assets_images'
    filepath = os.path.join(upload_folder, filename)
    img.save(filepath)    
    return filename


def clean_filename(filename):
    # Reemplaza caracteres no válidos por guiones bajos
    filename = re.sub(r"[^\w\s-]", "", filename)
    # Reemplaza espacios en blanco por guiones bajos
    filename = filename.replace(" ", "_")
    # Convierte a minúsculas
    filename = filename.lower()
    print("este es el nombre arregladoooooooooooooooo: " + filename)
    return filename

# Load image data from a file or request
# image_file = Image.open('girl.jpg')

# category_id = 13
# product_id = 2
# product_name = 'short'

# filename = save_image(image_file, category_id, product_id, product_name)
# print(f"Saved image with filename: {filename}")
