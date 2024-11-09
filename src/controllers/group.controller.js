const CustomError = require("../Errors/CustomError");
const groupService = require("../services/group.service");

class GroupController {
  createGroupSync = async (req, res, next) => {
    try {
      const { name, avatarUrl, memberIds } = req.body;

      if (!name || !memberIds) {
        const error = new Error("Missing data.");
        error.statusCode = 400;
        throw error;
      }

      const newGroup = await groupService.createGroupSync({
        name,
        avatarUrl,
        memberIds,
      });

      res.status(201).json({
        group: newGroup,
      });
    } catch (error) {
      next(error);
    }
  };
  getGroupByIdSync = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomError("Id is missing.", 400);
      }

      const group = await groupService.getGroupByIdSync(id);

      return res.status(200).json({
        group,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new GroupController();
