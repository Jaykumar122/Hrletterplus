// backend/routes/template.routes.js
const express = require("express");
const router = express.Router();
const {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/template.controller");
const verifyToken = require("../middleware/auth.middleware");

router.use(verifyToken);

router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

module.exports = router;