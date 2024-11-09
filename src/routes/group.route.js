const groupController = require("../controllers/group.controller");
const AppRoute = require("./route.class");

class GroupRoute extends AppRoute {
  constructor() {
    super();
    this.router.post("/", groupController.createGroupSync);
    this.router.get("/:id", groupController.getGroupByIdSync);
  }
}

module.exports = new GroupRoute();
