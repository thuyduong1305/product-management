const SettingGeneral = require("../../models/setting-general.model");
const systemConfig = require("../../config/system");
const general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    settingsGeneral: settingGeneral,
  });
};
const generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingsGeneral) {
    await SettingGeneral.updateOne({ _id: settingGeneral._id }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  res.redirect("back");
};

module.exports = { general, generalPatch };
