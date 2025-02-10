const express = require('express');
const { getUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', auth, getUsers);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
