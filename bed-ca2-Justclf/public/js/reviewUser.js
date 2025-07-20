// // Review page functionality
// document.addEventListener('DOMContentLoaded', function() {
//     let reviews = [];
//     let selectedRating = 0;
//     let currentUser = 'Guest'; // In real app, get from login session
// 
//     const form = document.getElementById('reviewForm');
//     const stars = document.querySelectorAll('.star-rating .star');
//     const ratingText = document.querySelector('.rating-text');
//     const reviewsList = document.getElementById('reviewsList');
// 
//     // Initialize
//     updateReviewsDisplay();
//     updateStats();
// 
//     // Star rating functionality
//     stars.forEach((star, index) => {
//         star.addEventListener('click', function() {
//             selectedRating = parseInt(this.dataset.value);
//             updateStarDisplay();
//             ratingText.textContent = `You rated: ${selectedRating} star${selectedRating !== 1 ? 's' : ''}`;
//         });
// 
//         star.addEventListener('mouseover', function() {
//             const hoverValue = parseInt(this.dataset.value);
//             highlightStars(hoverValue);
//         });
//     });
// 
//     // Reset stars on mouse leave
//     document.querySelector('.star-rating').addEventListener('mouseleave', function() {
//         updateStarDisplay();
//     });
// 
//     // Form submission
//     form.addEventListener('submit', function(e) {
//         e.preventDefault();
//         submitReview();
//     });
// 
//     // Update star display
//     function updateStarDisplay() {
//         stars.forEach((star, index) => {
//             if (index < selectedRating) {
//                 star.classList.add('active');
//             } else {
//                 star.classList.remove('active');
//             }
//         });
//     }
// 
//     // Highlight stars on hover
//     function highlightStars(rating) {
//         stars.forEach((star, index) => {
//             if (index < rating) {
//                 star.classList.add('active');
//             } else {
//                 star.classList.remove('active');
//             }
//         });
//     }
// 
//     // Submit review
//     function submitReview() {
//         const username = document.getElementById('username').value.trim();
//         const reviewText = document.getElementById('reviewText').value.trim();
// 
//         // Validation
//         if (!username) {
//             alert('Please enter your hunter name');
//             return;
//         }
// 
//         if (selectedRating === 0) {
//             alert('Please select a star rating');
//             return;
//         }
// 
//         if (!reviewText) {
//             alert('Please write a review');
//             return;
//         }
// 
//         // Check if user already reviewed
//         const existingReview = reviews.find(review => review.username.toLowerCase() === username.toLowerCase());
//         if (existingReview) {
//             alert('You have already submitted a review. You can edit or delete your existing review.');
//             return;
//         }
// 
//         // Create new review
//         const newReview = {
//             id: Date.now(),
//             username: username,
//             rating: selectedRating,
//             text: reviewText,
//             date: new Date(),
//             isCurrentUser: username.toLowerCase() === currentUser.toLowerCase()
//         };
// 
//         // Add to reviews array
//         reviews.unshift(newReview);
// 
//         // Update display
//         updateReviewsDisplay();
//         updateStats();
// 
//         // Reset form
//         form.reset();
//         selectedRating = 0;
//         updateStarDisplay();
//         ratingText.textContent = 'Click on a star to rate!';
// 
//         alert('Thank you for your review!');
//     }
// 
//     // Update reviews display
//     function updateReviewsDisplay() {
//         if (reviews.length === 0) {
//             reviewsList.innerHTML = `
//                 <div class="no-reviews">
//                     <p>No reviews yet. Be the first hunter to share your experience!</p>
//                 </div>
//             `;
//             return;
//         }
// 
//         reviewsList.innerHTML = reviews.map(review => `
//             <div class="review-item ${review.isCurrentUser ? 'current-user' : ''}" data-id="${review.id}">
//                 <div class="review-header">
//                     <div class="reviewer-info">
//                         <div class="reviewer-name">${review.username}</div>
//                         <div class="review-stars">
//                             ${generateStarDisplay(review.rating)}
//                         </div>
//                     </div>
//                     ${review.isCurrentUser || review.username.toLowerCase() === currentUser.toLowerCase() ? `
//                         <div class="review-actions">
//                             <button class="edit-btn" onclick="editReview(${review.id})">Edit</button>
//                             <button class="delete-btn" onclick="deleteReview(${review.id})">Delete</button>
//                         </div>
//                     ` : ''}
//                 </div>
//                 <div class="review-text">${review.text}</div>
//                 <div class="review-date">${formatDate(review.date)}</div>
//             </div>
//         `).join('');
//     }
// 
//     // Generate star display for reviews
//     function generateStarDisplay(rating) {
//         let stars = '';
//         for (let i = 1; i <= 5; i++) {
//             if (i <= rating) {
//                 stars += '<span class="star">&#9733;</span>';
//             } else {
//                 stars += '<span class="star">&#9734;</span>';
//             }
//         }
//         return stars;
//     }
// 
//     // Update statistics
//     function updateStats() {
//         const totalReviews = reviews.length;
//         const avgRating = totalReviews > 0 ? 
//             (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : 
//             '0.0';
// 
//         document.querySelector('.avg-number').textContent = avgRating;
//         document.querySelector('.total-reviews').textContent = `${totalReviews} review${totalReviews !== 1 ? 's' : ''}`;
// 
//         // Update average stars display
//         const avgStars = document.querySelectorAll('.avg-stars .star');
//         const rating = parseFloat(avgRating);
//         avgStars.forEach((star, index) => {
//             if (index < Math.floor(rating)) {
//                 star.classList.add('filled');
//             } else {
//                 star.classList.remove('filled');
//             }
//         });
//     }
// 
//     // Format date
//     function formatDate(date) {
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     }
// 
//     // Global functions for edit/delete (attached to window)
//     window.editReview = function(reviewId) {
//         const review = reviews.find(r => r.id === reviewId);
//         if (!review) return;
// 
//         // Pre-fill form with existing review data
//         document.getElementById('username').value = review.username;
//         document.getElementById('reviewText').value = review.text;
//         selectedRating = review.rating;
//         updateStarDisplay();
//         ratingText.textContent = `You rated: ${selectedRating} star${selectedRating !== 1 ? 's' : ''}`;
// 
//         // Remove the old review
//         reviews = reviews.filter(r => r.id !== reviewId);
//         updateReviewsDisplay();
//         updateStats();
// 
//         // Scroll to form
//         document.querySelector('.review-form-container').scrollIntoView({ behavior: 'smooth' });
//         
//         alert('Review loaded for editing. Make your changes and submit again.');
//     };
// 
//     window.deleteReview = function(reviewId) {
//         if (!confirm('Are you sure you want to delete this review?')) {
//             return;
//         }
// 
//         reviews = reviews.filter(r => r.id !== reviewId);
//         updateReviewsDisplay();
//         updateStats();
//         
//         alert('Review deleted successfully.');
//     };
// });