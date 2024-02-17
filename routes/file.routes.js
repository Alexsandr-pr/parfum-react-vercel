const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const FileController = require("../controllers/fileControler")


router.post("", authMiddleware, FileController.createDir )
router.get("", authMiddleware, FileController.getFiles )
router.post("/upload", authMiddleware, FileController.uploadFiles )

router.post("/avatar", authMiddleware, FileController.uploadAvatar )
router.delete("/avatar", authMiddleware, FileController.deleteAvatar )

module.exports = router