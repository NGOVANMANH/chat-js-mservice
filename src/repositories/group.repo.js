const GroupModel = require("../models/group.model");

class GroupRepo {
  createGroupSync = async ({ name, avatarUrl, memberIds }) => {
    const newGroup = new GroupModel({
      name,
      avatarUrl,
      memberIds,
    });

    const savedGroup = await newGroup.save();

    return savedGroup;
  };

  findGroupByIdSync = async (id) => {
    const exsitingGroup = await GroupModel.findById(id);

    if (!exsitingGroup) {
      const error = new Error("Group not found.");
      error.statusCode = 404;
    }

    return exsitingGroup;
  };
}

module.exports = new GroupRepo();
