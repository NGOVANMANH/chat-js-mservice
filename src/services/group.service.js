const groupRepo = require("../repositories/group.repo");
const userService = require("./user.service");

class GroupService {
  createGroupSync = async ({ name, avatarUrl, memberIds }) => {
    const findUserResults = await Promise.allSettled(
      memberIds.map((userId) => userService.findUserByIdSync(userId))
    );

    const exsitingUsers = findUserResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const notExistingUserIds = findUserResults
      .filter((result) => result.status === "rejected")
      .map((result) => ({
        userId: memberIds[findUserResults.indexOf(result)],
        error: result.reason.message,
      }));

    if (exsitingUsers.length <= 2) {
      const error = new Error("Group members >= 2");
      error.statusCode = 400;
      throw error;
    }

    const newGroup = await groupRepo.createGroupSync({
      name,
      avatarUrl,
      memberIds: exsitingUsers.map((user) => user._id),
    });

    return {
      group: newGroup,
      notExistingUserIds,
    };
  };

  getGroupByIdSync = async (id) => {
    return await groupRepo.findGroupByIdSync(id);
  };
}

module.exports = new GroupService();
