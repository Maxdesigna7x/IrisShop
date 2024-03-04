document.getElementById('button_atras').addEventListener('click', (event) => {
  event.preventDefault();
  location.href = "/";
  event.stopPropagation();
});

const imageDir = "/assets_images/"

toggleVisibility("product-image", false)
toggleVisibility("button_submit", false)
toggleVisibility("add_stock_input", false)
toggleVisibility("product_description_id", false)


var lastId = 0
const input = document.getElementById("item_id");
input.addEventListener("input", function() {
  // Obtener el valor del input
  let value = parseFloat(input.value);
  
  // Verificar si el valor es un número
  if (isNaN(value)) {
    // Si no es un número, establecer el valor como una cadena vacía
    input.value = "";
    toggleVisibility("button_submit", false)
  } else {
    // Si es un número, redondearlo y establecer el valor en el input
    value = Math.floor(value);
    input.value = value;
  }
});
const stock_input = document.getElementById("add_stock_input");
stock_input.addEventListener("input", function() {
  // Obtener el valor del input
  let value = parseFloat(stock_input.value);
  
  // Verificar si el valor es un número
  if (isNaN(value)) {
    // Si no es un número, establecer el valor como una cadena vacía
    stock_input.value = "";
  } else {
    // Si es un número, redondearlo y establecer el valor en el input
    value = Math.floor(value);
    stock_input.value = value;
  }
});
 


const botonBuscar = document.getElementById("boton_buscar");
const idInput = document.getElementById("item_id");
const buttonSubmit = document.getElementById("button_submit");
const StockInput = document.getElementById("add_stock_input");

// Obtener referencias a los span
const productDescription = document.getElementById("product_description");
const PreNombreSpan = document.getElementById("pre-nombre");
const nombreSpan = document.getElementById("producto-nombre");
const PreCategoriaSpan = document.getElementById("pre-categoria");
const categoriaSpan = document.getElementById("producto-categoria");
const PreStockSpan = document.getElementById("pre-stock-actual");
const stockSpan = document.getElementById("producto-stock-actual");
const imgElement = document.querySelector("#product-image");


botonBuscar.addEventListener('click', async (event) => {
    event.preventDefault();

    if (!idInput.value || idInput.value === "") {
      alert("Inserte el ID del producto")
      return
    }
    // Prepara los datos a enviar al servidor
    const data = new FormData();
    data.append("id", idInput.value);
    lastId = idInput.value;
    // Realiza una solicitud POST al servidor utilizando fetch
    fetch('/get-info-by-id', {
      method: "POST",
      body: data
    })
    .then(response => {
      // Verifica si la respuesta es correcta (estado HTTP 2xx)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Convierte la respuesta a formato JSON
      return response.json();
    })
    .then(data => {
      // Maneja la respuesta JSON del servidor
      if (data.success) {
        // La solicitud fue exitosa, muestra la información del producto
        console.log(data.payload);

        // Asignar nuevos valores
        productDescription.textContent = " Descripcion del Producto";
        PreNombreSpan.textContent = " Nombre: "
        nombreSpan.textContent = data.payload.nombre;
        PreCategoriaSpan.textContent = " Categoria: "
        categoriaSpan.textContent = data.payload.categoria;
        PreStockSpan.textContent = "Stock Actual: "
        stockSpan.textContent = data.payload.stock;

        toggleVisibility("product-image", true)
        toggleVisibility("button_submit", true)
        toggleVisibility("add_stock_input", true)
        toggleVisibility("product_description_id", true)

        // Actualiza la línea siguiente para mostrar la imagen en base64
        imgElement.src = `data:image/jpeg;base64,${data.payload.imagen}`;

        alert("La solicitud del producto id: " + idInput.value + " fue exitosa")
      } else {
        // Hubo un error en la solicitud, muestra el mensaje de error
        console.error(data.error);
      }
    })
    .catch(error => {
      // Hubo un error en la solicitud, muestra el mensaje de error
      console.error('Hubo un error en la solicitud:', error);
    });
    /*toggleVisibility("show_categorys", false) */       
    event.stopPropagation();
});

buttonSubmit.addEventListener('click', async (event) => {
  event.preventDefault(); 
  if (!StockInput.value || StockInput.value === "") {
    alert("Inserta cantidad a aumentar")
    return
  }
  // Prepara los datos a enviar al servidor
  const data = new FormData();
  data.append("stock_increase", StockInput.value);
  data.append("id", lastId);
  
  // Realiza una solicitud POST al servidor utilizando fetch
  fetch('/increase-stock', {
    method: "POST",
    body: data
  })
  .then(response => {
    // Verifica si la respuesta es correcta (estado HTTP 2xx)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Convierte la respuesta a formato JSON
    return response.json();
  })
  .then(data => {
    // Maneja la respuesta JSON del servidor
    if (data.success) {
      // La solicitud fue exitosa, muestra la información del producto
      // Asignar nuevos valores      
      const newStock = parseFloat(stockSpan.textContent) + parseFloat(StockInput.value)
      
      stockSpan.textContent = newStock;
      StockInput.value = "";
            
      alert("Stock aumentado con existo")
    } else {
      // Hubo un error en la solicitud, muestra el mensaje de error
      console.error("Hubo un error en la solicitud");
      alert("Hubo un error en la solicitud")
    }
  })
  .catch(error => {
    // Hubo un error en la solicitud, muestra el mensaje de error
    console.error('Hubo un error en la solicitud:', error);
    alert("Hubo un error en la solicitud")
  });
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