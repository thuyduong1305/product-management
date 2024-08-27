module.exports = (query) => { 
      let filterStatus = [
        {
          name: "Tất cả",
          status: "",
          class: "",
        },
        {
          name: "Hoạt động",
          status: "active",
          class: "",
        },
        {
          name: "Dừng hoạt động",
          status: "inactive",
          class: "",
        },
      ];
      if (query.status) {
        const index = filterStatus.find(
          (item) => item.status === query.status
        );
        index.class = "active";
      } else {
        const index = filterStatus.find((item) => item.status == "");
        index.class = "active";
      }
      return filterStatus;
 }