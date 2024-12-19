// table-cart
const tableCart = document.querySelector("[table-cart]");
if (tableCart) {
  const inputsQuantity = tableCart.querySelectorAll("input[name='quantity']");

  inputsQuantity.forEach((input) => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("item-id");
      const quantity = input.value;

      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
// End table-cart
