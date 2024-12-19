const createTree = (arr, parentId = "") => {
  // Khởi tạo một mảng rỗng để chứa các node gốc trong cây
  const tree = [];

  // Lọc ra tất cả các phần tử có parent_id bằng với parentId hiện tại
  const filteredItems = arr.filter((item) => item.parent_id === parentId);

  // Nếu không có phần tử nào khớp, trả về mảng rỗng (điều kiện dừng)
  if (filteredItems.length === 0) {
    return tree;
  }

  // Với mỗi phần tử khớp, tạo ra một node mới
  filteredItems.forEach((item) => {
    const newItem = item; // Tạo một bản sao của item

    // Gọi đệ quy để tìm các phần tử con (children) của node hiện tại
    const children = createTree(arr, item.id);

    // Nếu có con, gán vào thuộc tính children của newItem
    if (children.length > 0) {
      newItem.children = children;
    }

    // Thêm newItem vào cây (tree)
    tree.push(newItem);
  });

  // Trả về cây đã tạo ra
  return tree;
};
module.exports = createTree;
