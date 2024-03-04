window.onload = function() {
    UpdateCategorys();
  };

  const input = document.getElementById("item_stock");
  input.addEventListener("input", function() {
    // Obtener el valor del input
    let value = parseFloat(input.value);
    // Redondear hacia abajo al entero más cercano
    value = Math.floor(value);
    // Establecer el valor redondeado en el input
    input.value = value;
  });

function UpdateCategorys()
{
  console.log("va a actualizar");  
    fetch('/obtener-categorias')
    .then(response => response.json())
    .then(data => {
      //console.log(data); // Log the JSON object to the browser console
      const categorias = JSON.parse(data.categorias);
      const dropdown = document.getElementById('category-dropdown');
      // Limpiar todas las opciones existentes
      while (dropdown.options.length > 0) {
        categoryDropdown.remove(0);
        }
      categorias.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
      });
    })
    .catch(error => console.log(error));
}

document.getElementById('button_atras').addEventListener('click', (event) => {
  event.preventDefault();
  location.href = "/";
  event.stopPropagation();
});
 
const show_categorysButton = document.getElementById("show_categorys");
const addCategoryButton = document.getElementById("add-category-button");
const cancelCategoryButton = document.getElementById("cancel-category-button");
const newcategoryInput = document.getElementById("new-category-input");
const categoryDropdown = document.getElementById("category-dropdown");
//<input type="text" id="new-category" class="hidden"></input>

show_categorysButton.addEventListener('click', async (event) => {
    event.preventDefault();
    toggleVisibility("show_categorys", false)    
    toggleVisibility("category-dropdown", false)
    toggleVisibility("cancel-category-button", true)
    toggleVisibility("add-category-button", true)
    toggleVisibility("new-category-input", true)
    event.stopPropagation();
});

cancelCategoryButton.addEventListener('click', async (event) => {
  event.preventDefault();
  toggleVisibility("show_categorys", true)
    toggleVisibility("category-dropdown", true)
    toggleVisibility("add-category-button", false)
    toggleVisibility("cancel-category-button", false)
    toggleVisibility("new-category-input", false)
  event.stopPropagation();
});

function toggleVisibility(inputId, value=true) {
    // Selecciona el elemento de entrada de texto por su ID
    var inputElement = document.getElementById(inputId);
    
    // Alterna entre mostrar y ocultar el elemento utilizando la propiedad style.display
    if  (value) {
      inputElement.style.display = "block";
    } else {
      inputElement.style.display = "none";
    }
  }


  addCategoryButton.addEventListener('click', (event) => {
    event.preventDefault();
  
    // Verifica que el campo de entrada de texto no esté vacío
    if (newcategoryInput.value !== "") {
      // Prepara los datos a enviar al servidor
      const data = new FormData();
      data.append("name", newcategoryInput.value);
      console.log("esto es pinga pura");
  
      // Realiza una solicitud POST al servidor utilizando fetch
      fetch('/create-categoria', {
        method: "POST",
        body: data
      })
        .then(response => {
          // Verifica si la solicitud fue exitosa
          if (!response.ok) {
            throw new Error('Error en la solicitud');
          }
          // Procesa la respuesta del servidor
          return response.json();
        })
        .then(data => {
          // Procesa la respuesta del servidor
          console.log("agrego una categoria");    
          console.log(data);        
          // Reinicia el valor del campo de entrada de texto
          newcategoryInput.value = "";
          UpdateCategorys();
        })
        .catch(error => {
          if (error.message === 'Error en la solicitud') {
            // Muestra un mensaje de error al usuario
            alert('Hubo un error al crear la categoría. Por favor, intenta de nuevo.');
          } else {
            console.error(error);
          }
        });
    }
    
    toggleVisibility("show_categorys", true)
    toggleVisibility("category-dropdown", true)
    toggleVisibility("add-category-button", false)
    toggleVisibility("cancel-category-button", false)
    toggleVisibility("new-category-input", false)
    event.stopPropagation();
  });


// Obtiene una referencia al formulario
const form = document.getElementById('image-form');

// Agrega un evento de envío al formulario
form.addEventListener('submit', function(event) {
  // Evita que el navegador envíe el formulario de forma predeterminada
  event.preventDefault();

  // Obtiene los valores de los campos del formulario
    //const productId = document.getElementById('product_id');
    const categoryId = document.getElementById('category-dropdown');
    const name = document.getElementById('item_nombre');
    const image = document.getElementById('image');
    const description = document.getElementById('item_descripcion');
    const costo = document.getElementById('item_costo');
    const precio = document.getElementById('item_precio');
    const stock = document.getElementById('item_stock');

    // Redimensiona la imagen
    resizeImage(image.files[0])
    .then(resizedImage => {
        // Crea un objeto FormData para enviar los datos del formulario
        const formData = new FormData();
        //formData.append('product_id', productId.value);
        formData.append('name', name.value);
        formData.append('description', description.value);
        formData.append('category_id', categoryId.value);        
        formData.append('image', resizedImage, 'image.jpg');
        formData.append('cost', costo.value);
        formData.append('price', precio.value);
        formData.append('stock', stock.value);

    // Envía los datos del formulario a través de AJAX
    fetch('/registrar-producto', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Muestra un mensaje de éxito o error
      if (data.success) {
        alert('La imagen se ha cargado correctamente.');

        // Vacía los campos del formulario 
        stock.value = '';
        precio.value = '';
        costo.value = '';
        description.value = '';
        categoryId.value = '';
        name.value = '';
        image.value = '';
        previewImage(event)
      } else {
        alert('Ha ocurrido un error al cargar la imagen. 1');
      }
    })
    .catch(error => {
      console.error(error);
      alert('Ha ocurrido un error al cargar la imagen. 2');
    });
  })
  .catch(error => {
    console.error(error);
    alert('Ha ocurrido un error al redimensionar la imagen.');
  });
});


function resizeImage(image) {
    return new Promise((resolve, reject) => {
      // Crea un objeto Image para representar la imagen seleccionada
      const img = new Image();
      img.src = URL.createObjectURL(image);
  
      // Espera a que la imagen se haya cargado completamente
      img.onload = function() {
        // Obtiene las dimensiones originales de la imagen
        const originalWidth = img.width;
        const originalHeight = img.height;
  
        // Calcula las nuevas dimensiones de la imagen redimensionada
        let width = originalWidth;
        let height = originalHeight;
        if (width > 1024 || height > 1024) {
          if (width > height) {
            height = (height * 1024) / width;
            width = 1024;
          } else {
            width = (width * 1024) / height;
            height = 1024;
          }
        }
  
        // Crea un elemento <canvas> y su contexto 2D
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Redimensiona el elemento <canvas>
        canvas.width = width;
        canvas.height = height;
  
        // Dibuja la imagen redimensionada en el elemento <canvas>
        ctx.drawImage(img, 0, 0, width, height);
  
        // Obtiene los datos de la imagen redimensionada en formato de archivo
        canvas.toBlob(blob => {
          if (!blob) {
            reject(new Error('Error al redimensionar la imagen'));
          } else {
            resolve(blob);
          }
        }, 'image/jpeg', 0.8);
      };
  
      // Maneja el error en caso de que la imagen no se haya podido cargar
      img.onerror = function() {
        reject(new Error('Error al cargar la imagen'));
      };
    });
  }

  function previewImage(event) {
    const input = event.target;
    
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      
      // Cuando termine de leer el archivo...
      reader.onload = function() {
        const imgElement = document.getElementById('preview-image');
        
        // Establecemos la fuente de la imagen como data URL
        imgElement.src = reader.result;
      };
      
      // Leemos el archivo como Data URL
      reader.readAsDataURL(input.files[0]);
    } else {
      // Si no hay ningún archivo seleccionado, limpiamos la vista previa
      const imgElement = document.getElementById('preview-image');
      imgElement.src = "/static/usage_images/preview1.jpg";
    }
  }