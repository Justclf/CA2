// Review page functionality
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        const reviewForm = document.querySelector('.review-form-container');
        if (reviewForm) {
            reviewForm.style.display = 'none';
        }
    }

    loadAllReviews();
    if (token) {
        setupReviewForm(token);
        setupStarRating();
    }
});

// load all reviews
function loadAllReviews() {
    const callback = (responseStatus, responseData) => {
        console.log("Reviews responseStatus:", responseStatus);
        console.log("Reviews responseData:", responseData);
        
        if (responseStatus === 200) {
            displayReviews(responseData);
            updateReviewStats(responseData);
        } else {
            console.error("Failed to load reviews:", responseData);
        }
    }
    fetchMethod(currentUrl + "/api/reviews", callback, "GET", null, null);
}

// display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList'); // Link with the HTML thru here
    const token = localStorage.getItem('token');
    let currentUserId = null;

    if (token) { // ai
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.userId;
        } catch (e) {
            console.log("Error reading token:", e);
        }
    }

    reviewsList.innerHTML = reviews.map(review => { // review is passed as an array and loops thru each review object and returns an array of HTML strings
        const reviewDate = new Date(review.created_at).toLocaleDateString('en-US', { // take the time in review.created_at.
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const amCurrentUser = currentUserId && review.user_id === currentUserId;
        
        return `
            <div class="review-item ${amCurrentUser ? 'current-user' : ''}" data-id="${review.id}"> <!-- Creates a <div> for each review with class "review-item" (adding "current-user" if its the current users) and embeds its ID in data-id -->
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">${review.username}</div>
                        <div class="review-stars">
                            ${generateStarDisplay(review.rating)}
                        </div>
                    </div>
                    ${amCurrentUser ? `
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

// Generate star display ai
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

// update review statistics
function updateReviewStats(reviews) {
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? // If theres more than one review, do the calculation. Else show 0.0
        (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : '0.0'; // sum up all the reviews.rating values from 0, then divide them by totalReviews


    document.querySelector('.avg-number').textContent = avgRating;
    document.querySelector('.total-reviews').textContent = `${totalReviews} reviews`; // show how many reviews 

    // Update average stars display AI
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

// set up review form
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

// choosing the star rating
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
}



// edit review
function editReview(reviewId, currentRating, currentComment) {
    document.getElementById('reviewText').value = currentComment;
    setStarRating(currentRating);
    updateRatingText(currentRating);
    
    // change form to edit mode
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Update Review';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        updateReview(reviewId);
    };
}

// the button to make it submit
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

// delete review
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

// reset the review form
function resetReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.reset();
    resetStarRating();
    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Submit Review';
    submitBtn.onclick = null;
}


// reset star rating when you submit
function resetStarRating() {
    setStarRating(0);
}

// set the star rating
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

// highlight the stars when u hover them
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

// get the selected rating
function getSelectedRating() {
    const activeStars = document.querySelectorAll('.star-rating .star.active');
    return activeStars.length;
}

// show the rating text when u submit
function updateRatingText(rating) {
    const ratingText = document.querySelector('.rating-text');
    ratingText.textContent = `You rated: ${rating} star`;
}
