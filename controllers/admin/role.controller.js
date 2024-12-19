const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhom quyen",
    records: records,
  });
};
const create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tao nhom quyen",
  });
};
const createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

const edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
    };
    const record = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Sửa quyền",
      record: record,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

const editPatch = async (req, res) => {
  try {
    await Role.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Edit role successfully!");
    res.redirect(`back`);
  } catch (error) {
    req.flash("error", "Edit role failed!");
  }
};

const permissions = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: records,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
const permissionsPatch = async (req, res) => {
  // console.log(req.body);
  const permissions = JSON.parse(req.body.roles);
  for (const item of permissions) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
module.exports = {
  index,
  create,
  createPost,
  edit,
  editPatch,
  permissions,
  permissionsPatch,
};
