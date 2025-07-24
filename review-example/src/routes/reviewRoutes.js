const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewController');

router.get('/', controller.readAllReview);
router.post('/', controller.createReview);
router.get('/:id', controller.readReviewById);
router.put('/:id', controller.updateReviewById);
router.delete('/:id', controller.deleteReviewById);
//Test
module.exports = router;