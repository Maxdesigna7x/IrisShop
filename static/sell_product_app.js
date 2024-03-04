const addProductBtn = document.getElementById('add-product-btn');
const productsList = document.getElementById('products-list');
const sellBtn = document.getElementById('sell-btn');
const cancelBtn = document.getElementById('cancel-btn');

let productIdCounter = 1;

document.getElementById('cancel-btn').addEventListener('click', (event) => {
  event.preventDefault();
  location.href = "/";
  event.stopPropagation();
});

function createProductItem() {
  const productItem = document.createElement('div');
  productItem.className = 'product-item';

  const productIdInput = document.createElement('input');
  productIdInput.type = 'text';
  productIdInput.placeholder = 'ID de producto';

  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.addEventListener('click', () => {
    const productId = productIdInput.value;
    // Aquí puedes obtener la foto, nombre y precio del producto usando el ID
    // Por ahora, usaremos valores de ejemplo
    const productImage = document.createElement('img');
    productImage.src = `https://via.placeholder.com/50x50?text=Producto ${productId}`;
    productImage.className = 'product-image';

    const productName = document.createElement('p');
    productName.textContent = `Producto ${productId}`;

    const productPrice = document.createElement('p');
    productPrice.textContent = '$9.99'; // Precios de ejemplo

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => {
      productItem.remove();
    });

    productItem.innerHTML = '';
    productItem.appendChild(productImage);
    productItem.appendChild(productName);
    productItem.appendChild(productPrice);
    productItem.appendChild(deleteBtn);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.addEventListener('click', () => {
    productItem.remove();
  });

  productItem.appendChild(productIdInput);
  productItem.appendChild(okBtn);
  productItem.appendChild(cancelBtn);

  productsList.appendChild(productItem);
}

addProductBtn.addEventListener('click', createProductItem);