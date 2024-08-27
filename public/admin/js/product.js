const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("[form-change-status]");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      const statusChange = statusCurrent === "active" ? "inactive" : "active";

      const action = `${path}/${statusChange}/${id}?_method=PATCH`;
      console.log(action);

      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
// console.log("Success");

const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");

  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault();

    const type = event.target.elements.type.value;

    if (type == "delete-all") {
      const isConfirm = confirm(
        "Are you sure you want to delete these selected documents?"
      );
      if (!isConfirm) {
        return;
      }
    }

    const inputsChecked = document.querySelectorAll("input[name='id']:checked");

    if (inputsChecked.length > 0) {
      const ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if (type == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(",");
      // console.log(inputIds.value);
      formChangeMulti.submit();
    } else {
      alert("Please select at least 1 product!");
    }
  });
}

const buttonsDelete = document.querySelectorAll("[button-delete]");

if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("[form-delete-item]");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm(
        "Are you sure you want to delete this document?"
      );

      if (isConfirm) {
        const id = button.getAttribute("data-id");

        const action = `${path}/${id}?_method=DELETE`;

        formDeleteItem.action = action;

        formDeleteItem.submit();
      }
    });
  });
}

const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (event) => {
    const file = uploadImageInput.files[0];
    if (file) {
      // console.log(file);
      const objectURL = URL.createObjectURL(file);

      // Đảm bảo giải phóng URL cũ để tránh rò rỉ bộ nhớ.
      uploadImagePreview.onload = () => {
        URL.revokeObjectURL(objectURL);
      };
      uploadImagePreview.src = objectURL;
    } else {
      // Nếu không có tệp nào được chọn, xóa ảnh cũ
      uploadImagePreview.src = "";
    }
  });
}
