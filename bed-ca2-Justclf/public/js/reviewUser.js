// Review page functionality
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // If not logged in, hide the review form but show existing reviews
        const reviewForm = document.querySelector('.review-form-container');
        if (reviewForm) {
            reviewForm.style.display = 'none';
        }
    }
    
    // Load existing reviews
    loadAllReviews();
    
    // Set up review form if user is logged in
    if (token) {
        setupReviewForm(token);
        setupStarRating();
    }
});

// Load all reviews
function loadAllReviews() {
    const callback = (responseStatus, responseData) => {
        console.log("Reviews responseStatus:", responseStatus);
        console.log("Reviews responseData:", responseData);
        
        if (responseStatus === 200) {
            displayReviews(responseData);
            updateReviewStats(responseData);
        } else {
            console.error("Failed to load reviews:", responseData);
            showNoReviews("Failed to load reviews. Please try again.");
        }
    }
    fetchMethod(currentUrl + "/api/reviews", callback, "GET", null, null);
}

// Display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviews || reviews.length === 0) {
        showNoReviews("No reviews yet. Be the first hunter to share your experience!");
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => {
        const reviewDate = new Date(review.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const isCurrentUser = getCurrentUsername() === review.username;
        
        return `
            <div class="review-item ${isCurrentUser ? 'current-user' : ''}" data-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">${review.username}</div>
                        <div class="review-stars">
                            ${generateStarDisplay(review.rating)}
                        </div>
                    </div>
                    ${isCurrentUser ? `
                        <div class="review-actions">
                            <button class="edit-btn" onclick="editReview(${review.id}, ${review.rating}, '${review.comment}')">Edit</button>
                            <button class="delete-btn" onclick="deleteReview(${review.id})">Delete</button>
                        </div>
                    ` : ''}
                </div>
                <div class="review-text">${review.comment}</div>
                <div class="review-date">${reviewDate}</div>
            </div>
        `;
    }).join('');
}

// Generate star display
function generateStarDisplay(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star">★</span>';
        } else {
            stars += '<span class="star">☆</span>';
        }
    }
    return stars;
}

// Update review statistics
function updateReviewStats(reviews) {
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? 
        (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : 
        '0.0';

    document.querySelector('.avg-number').textContent = avgRating;
    document.querySelector('.total-reviews').textContent = `${totalReviews} review${totalReviews !== 1 ? 's' : ''}`;

    // Update average stars display
    const avgStars = document.querySelectorAll('.avg-stars .star');
    const rating = parseFloat(avgRating);
    avgStars.forEach((star, index) => {
        if (index < Math.floor(rating)) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

// Show no reviews message
function showNoReviews(message) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = `<div class="no-reviews"><p>${message}</p></div>`;
}

// Set up review form
function setupReviewForm(token) {
    const reviewForm = document.getElementById('reviewForm');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const rating = getSelectedRating();
            const comment = document.getElementById('reviewText').value.trim();
            
            if (rating === 0) {
                alert('Please select a star rating');
                return;
            }
            
            if (!comment) {
                alert('Please write a review');
                return;
            }
            
            const data = {
                rating: rating,
                comment: comment
            };
            
            const callback = (responseStatus, responseData) => {
                console.log("Create review responseStatus:", responseStatus);
                console.log("Create review responseData:", responseData);
                
                if (responseStatus === 201) {
                    alert('Thank you for your review!');
                    reviewForm.reset();
                    resetStarRating();
                    loadAllReviews();
                } else {
                    alert(responseData.message || 'Failed to submit review. Please try again.');
                }
            }
            
            fetchMethod(currentUrl + "/api/reviews", callback, "POST", data, token);
        });
    }
}

// Set up star rating
function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.value);
            setStarRating(rating);
            updateRatingText(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const hoverValue = parseInt(this.dataset.value);
            highlightStars(hoverValue);
        });
    });
    
    // Reset on mouse leave
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        const currentRating = getSelectedRating();
        highlightStars(currentRating);
    });
}

// Set star rating
function setStarRating(rating) {
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Highlight stars
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Get selected rating
function getSelectedRating() {
    const activeStars = document.querySelectorAll('.star-rating .star.active');
    return activeStars.length;
}

// Update rating text
function updateRatingText(rating) {
    const ratingText = document.querySelector('.rating-text');
    ratingText.textContent = `You rated: ${rating} star${rating !== 1 ? 's' : ''}`;
}

// Reset star rating
function resetStarRating() {
    setStarRating(0);
    document.querySelector('.rating-text').textContent = 'Click on a star to rate!';
}

// Edit review
function editReview(reviewId, currentRating, currentComment) {
    // Pre-fill form
    document.getElementById('reviewText').value = currentComment;
    setStarRating(currentRating);
    updateRatingText(currentRating);
    
    // Change form to edit mode
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Update Review';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        updateReview(reviewId);
    };
    
    // Scroll to form
    document.querySelector('.review-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Update review
function updateReview(reviewId) {
    const token = localStorage.getItem('token');
    const rating = getSelectedRating();
    const comment = document.getElementById('reviewText').value.trim();
    
    if (rating === 0) {
        alert('Please select a star rating');
        return;
    }
    
    if (!comment) {
        alert('Please write a review');
        return;
    }
    
    const data = {
        rating: rating,
        comment: comment
    };
    
    const callback = (responseStatus, responseData) => {
        console.log("Update review responseStatus:", responseStatus);
        console.log("Update review responseData:", responseData);
        
        if (responseStatus === 200) {
            alert('Review updated successfully!');
            resetReviewForm();
            loadAllReviews();
        } else {
            alert(responseData.message || 'Failed to update review. Please try again.');
        }
    }
    
    fetchMethod(currentUrl + `/api/reviews/${reviewId}`, callback, "PUT", data, token);
}

// Delete review
function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    const callback = (responseStatus, responseData) => {
        console.log("Delete review responseStatus:", responseStatus);
        console.log("Delete review responseData:", responseData);
        
        if (responseStatus === 200) {
            alert('Review deleted successfully!');
            loadAllReviews();
        } else {
            alert(responseData.message || 'Failed to delete review. Please try again.');
        }
    }
    
    fetchMethod(currentUrl + `/api/reviews/${reviewId}`, callback, "DELETE", null, token);
}

// Reset review form
function resetReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.reset();
    resetStarRating();
    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Submit Review';
    submitBtn.onclick = null;
}

// Get current username (you'll need to implement this based on your auth system)
function getCurrentUsername() {
    // This is a simple implementation - you might want to decode the JWT token
    // or make an API call to get the current user's username
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.username; // Adjust based on your JWT structure
        } catch (e) {
            return null;
        }
    }
    return null;
}