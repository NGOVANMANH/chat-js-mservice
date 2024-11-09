const fs = require("fs");
const path = require("path");
const attachmentService = require("../services/attachment.service");

class AttachmentController {
  uploadFilesSync = async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        const error = new Error("No files uploaded.");
        error.statusCode = 400;
        throw error;
      }

      const attachments = req.files;

      const results = await Promise.allSettled(
        attachments.map((attachment) =>
          attachmentService.saveAttachmentSync(attachment)
        )
      );

      const successfulUploads = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const failedUploads = results
        .filter((result) => result.status === "rejected")
        .map((result) => ({
          file: attachments[results.indexOf(result)].originalname,
          error: result.reason.message,
        }));

      res.status(200).json({
        message: "File upload process completed",
        successfulUploads,
        failedUploads,
      });
    } catch (error) {
      next(error);
    }
  };

  getAttachmentByIdSync = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { serve } = req.query;

      if (!id) {
        const error = new Error("Id is missing");
        error.statusCode = 400;
        throw error;
      }

      const attachment = await attachmentService.getAttachmentByIdSync(id);

      const isLocalFile = attachment.url.startsWith("/");

      if (serve && serve === "true") {
        if (isLocalFile) {
          try {
            await fs.promises.stat(attachment.url);
            return res.sendFile(
              path.resolve(attachment.url),
              {
                headers: {
                  "Content-Disposition": `inline; filename="${attachment.url
                    .split("/")
                    .pop()}"`,
                },
              },
              (err) => {
                if (err) {
                  next(err);
                }
              }
            );
          } catch (err) {
            if (err.code === "ENOENT") {
              const notFoundError = new Error("File not found.");
              notFoundError.statusCode = 404;
              throw notFoundError;
            }
            throw err;
          }
        } else {
          try {
            const cloudinaryResponse = await fetch(attachment.url);

            if (!cloudinaryResponse.ok) {
              const fetchError = new Error(
                "Failed to fetch the file from cloud storage."
              );
              fetchError.statusCode = 502;
              throw fetchError;
            }

            return res.redirect(attachment.url);
          } catch (error) {
            return next(error);
          }
        }
      }

      return res.status(200).json({ attachment });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AttachmentController();
