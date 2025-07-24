const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


router.get('/', controller.readAllReview);
// router.get('/:id', controller.readReviewById);

router.post('/', jwtMiddleware.verifyToken, controller.createReview);
router.put('/:id', jwtMiddleware.verifyToken, controller.updateReviewById);
router.delete('/:id', jwtMiddleware.verifyToken, controller.deleteReviewById);

module.exports = router;