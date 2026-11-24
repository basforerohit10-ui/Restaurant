import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { MenuItem, DishReview } from '../../models/restaurant.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="menu-page">
      <!-- Luxury Culinary Welcome Banner -->
      <div class="menu-hero">
        <div class="hero-left">
          <div class="hero-badge">🍽️ FOOD COURT GOURMET SELECTION • WHITE &amp; CHOCOLATE</div>
          <h1>Epicurean Dishes &amp; Dining Menu</h1>
          <p>Hand-crafted culinary specialties with guest reviews, transparent pricing, and instant table booking.</p>
        </div>
        <div class="hero-right">
          <a routerLink="/reservations" class="btn-reserve-table">
            <span>📅 Reserve a Dining Table</span>
            <span class="btn-arrow">→</span>
          </a>
        </div>
      </div>

      <!-- Category Filter Pills & Search Bar -->
      <div class="filter-bar">
        <div class="category-pills">
          <button
            *ngFor="let cat of categories"
            class="cat-btn"
            [class.active]="selectedCategory === cat.id"
            (click)="selectedCategory = cat.id"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </div>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search dish by name, ingredients, or flavor..."
            class="menu-search-input"
          />
        </div>
      </div>

      <!-- Dishes Grid -->
      <div class="dishes-grid">
        <div class="empty-state" *ngIf="filteredDishes.length === 0">
          <span class="empty-icon">🍲</span>
          <h3>No dishes matched your search</h3>
          <p>Try searching with another keyword or select "All Dishes".</p>
        </div>

        <div class="dish-card" *ngFor="let dish of filteredDishes">
          <!-- Small Photo Thumbnail & Badges -->
          <div class="dish-thumb-wrap">
            <img [src]="dish.imageUrl" [alt]="dish.name" class="dish-thumb" loading="lazy" />
            <div class="thumb-badges">
              <span class="diet-badge" [class.veg]="dish.isVeg" [class.nonveg]="!dish.isVeg">
                <span class="diet-dot"></span>
                {{ dish.isVeg ? 'VEG' : 'NON-VEG' }}
              </span>
              <span class="special-badge" *ngIf="dish.isChefSpecial">✨ Chef's Special</span>
            </div>
          </div>

          <!-- Dish Content & Pricing -->
          <div class="dish-body">
            <div class="dish-header-row">
              <h3 class="dish-name">{{ dish.name }}</h3>
              <div class="dish-price">₹{{ dish.price }}</div>
            </div>

            <p class="dish-desc">{{ dish.description }}</p>

            <div class="dish-meta-row">
              <span class="meta-pill">⏱️ {{ dish.prepTime }}</span>
              <span class="meta-pill category-pill">{{ dish.category | uppercase }}</span>
              <div class="rating-pill" (click)="openReviewModal(dish)" title="Click to view all reviews">
                <span class="star-icon">⭐</span>
                <strong>{{ dish.rating }}</strong>
                <span class="review-count">({{ dish.reviews.length }} reviews)</span>
              </div>
            </div>

            <!-- Card Action Footer -->
            <div class="dish-actions">
              <button class="btn-read-reviews" (click)="openReviewModal(dish)">
                <span>💬 Reviews ({{ dish.reviews.length }})</span>
              </button>
              <button class="btn-add-review" (click)="openAddReviewModal(dish)">
                <span>✍️ Write Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: View Reviews -->
      <div class="modal-backdrop" *ngIf="activeReviewDish" (click)="closeModals()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <div class="modal-dish-preview">
              <img [src]="activeReviewDish.imageUrl" class="modal-thumb" />
              <div>
                <span class="modal-category">{{ activeReviewDish.category | uppercase }}</span>
                <h3>{{ activeReviewDish.name }}</h3>
                <span class="modal-price">₹{{ activeReviewDish.price }} • ⭐ {{ activeReviewDish.rating }} / 5.0</span>
              </div>
            </div>
            <button class="btn-close" (click)="closeModals()">✕</button>
          </div>

          <div class="modal-reviews-list">
            <div class="reviews-title-row">
              <h4>Guest Ratings &amp; Reviews ({{ activeReviewDish.reviews.length }})</h4>
              <button class="btn-inline-add" (click)="openAddReviewModal(activeReviewDish)">+ Write Review</button>
            </div>

            <div class="empty-reviews" *ngIf="activeReviewDish.reviews.length === 0">
              <p>No reviews yet for this dish. Be the first to share your experience!</p>
            </div>

            <div class="review-item" *ngFor="let rev of activeReviewDish.reviews">
              <div class="rev-top">
                <div class="rev-user">
                  <span class="user-avatar-circle">👤</span>
                  <strong>{{ rev.userName }}</strong>
                </div>
                <div class="rev-meta">
                  <div class="rev-stars">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= rev.rating">★</span>
                  </div>
                  <span class="rev-date">{{ rev.date }}</span>
                </div>
              </div>
              <p class="rev-comment">"{{ rev.comment }}"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Add Review Form -->
      <div class="modal-backdrop" *ngIf="addingReviewDish" (click)="closeModals()">
        <div class="modal-card small-modal" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <div>
              <span class="modal-category">WRITE A REVIEW</span>
              <h3>{{ addingReviewDish.name }}</h3>
            </div>
            <button class="btn-close" (click)="closeModals()">✕</button>
          </div>

          <form (ngSubmit)="submitReview()" class="review-form">
            <div class="form-group">
              <label>YOUR NAME</label>
              <input type="text" [(ngModel)]="newReviewerName" name="reviewerName" placeholder="Enter your name" required />
            </div>

            <div class="form-group">
              <label>RATING (1 TO 5 STARS)</label>
              <div class="star-rating-selector">
                <button
                  type="button"
                  *ngFor="let val of [1,2,3,4,5]"
                  class="star-select-btn"
                  [class.active]="newRating >= val"
                  (click)="newRating = val"
                >
                  ★
                </button>
                <span class="rating-label">{{ newRating }} / 5 Stars</span>
              </div>
            </div>

            <div class="form-group">
              <label>YOUR REVIEW &amp; TASTE EXPERIENCE</label>
              <textarea
                [(ngModel)]="newComment"
                name="comment"
                rows="3"
                placeholder="How did the dish taste? Flavors, aroma, presentation..."
                required
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="closeModals()">Cancel</button>
              <button type="submit" class="btn-submit-review" [disabled]="!newComment.trim()">
                Publish Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-page {
      display: flex;
      flex-direction: column;
      gap: 22px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Hero Banner: Luxury Chocolate & White */
    .menu-hero {
      background: linear-gradient(135deg, #26140b, #3b2012);
      border: 1px solid rgba(217, 119, 6, 0.3);
      border-radius: 20px;
      padding: 2.25rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      box-shadow: 0 10px 30px rgba(38, 20, 11, 0.25);
    }
    .hero-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.3);
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 8px;
    }
    .hero-left h1 {
      margin: 0 0 6px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 2.1rem;
      color: #fffbf7;
      font-weight: 700;
    }
    .hero-left p {
      margin: 0;
      color: #dfcebf;
      font-size: 0.95rem;
      max-width: 600px;
    }
    .btn-reserve-table {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #d97706, #b45309);
      color: #ffffff;
      padding: 13px 22px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.94rem;
      box-shadow: 0 4px 16px rgba(217, 119, 6, 0.35);
      transition: all 0.2s ease;
    }
    .btn-reserve-table:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
    }
    .btn-arrow {
      font-weight: 800;
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 16px;
      padding: 12px 18px;
      box-shadow: 0 4px 14px rgba(74, 40, 22, 0.04);
    }
    .category-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .cat-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.1);
      color: #573926;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .cat-btn:hover {
      background: #f4ece1;
      color: #231208;
    }
    .cat-btn.active {
      background: #26140b;
      color: #ffffff;
      border-color: #26140b;
      box-shadow: 0 2px 8px rgba(38, 20, 11, 0.25);
    }

    .search-box {
      position: relative;
      min-width: 280px;
      flex: 1;
      max-width: 380px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9rem;
      opacity: 0.7;
      pointer-events: none;
    }
    .menu-search-input {
      width: 100%;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 10px;
      padding: 9px 12px 9px 36px;
      color: #231208;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s ease;
    }
    .menu-search-input:focus {
      border-color: #8c4f2e;
      background: #ffffff;
    }

    /* Dishes Grid */
    .dishes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      background: #ffffff;
      border: 1px dashed rgba(74, 40, 22, 0.2);
      border-radius: 18px;
      padding: 3.5rem 2rem;
      color: #7d5b45;
    }
    .empty-icon {
      font-size: 2.8rem;
      margin-bottom: 8px;
    }

    /* Dish Card: Pure White with Chocolate accents */
    .dish-card {
      background: #ffffff;
      border: 1px solid rgba(74, 40, 22, 0.12);
      border-radius: 18px;
      padding: 1.25rem;
      display: flex;
      gap: 16px;
      box-shadow: 0 4px 16px rgba(74, 40, 22, 0.05);
      transition: all 0.2s ease;
    }
    .dish-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(74, 40, 22, 0.1);
      border-color: rgba(74, 40, 22, 0.25);
    }

    /* Small Photo Thumbnail */
    .dish-thumb-wrap {
      width: 110px;
      height: 110px;
      position: relative;
      flex-shrink: 0;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(74, 40, 22, 0.14);
      background: #f4ece1;
    }
    .dish-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }
    .dish-card:hover .dish-thumb {
      transform: scale(1.06);
    }
    .thumb-badges {
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .diet-badge {
      font-size: 0.6rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      width: fit-content;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .diet-badge.veg {
      background: #ffffff;
      color: #15803d;
      border: 1px solid #16a34a;
    }
    .diet-badge.nonveg {
      background: #ffffff;
      color: #be123c;
      border: 1px solid #e11d48;
    }
    .diet-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .veg .diet-dot { background: #16a34a; }
    .nonveg .diet-dot { background: #e11d48; }

    .special-badge {
      font-size: 0.58rem;
      font-weight: 800;
      background: #78350f;
      color: #fef3c7;
      padding: 2px 5px;
      border-radius: 4px;
      width: fit-content;
      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
    }

    /* Dish Body */
    .dish-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .dish-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .dish-name {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.08rem;
      color: #231208;
      font-weight: 700;
      line-height: 1.25;
    }
    .dish-price {
      font-size: 1.15rem;
      font-weight: 800;
      color: #8c4f2e;
      white-space: nowrap;
    }

    .dish-desc {
      margin: 6px 0 10px;
      color: #7d5b45;
      font-size: 0.82rem;
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .dish-meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .meta-pill {
      font-size: 0.7rem;
      font-weight: 700;
      color: #6e3d23;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.1);
      padding: 3px 8px;
      border-radius: 6px;
    }
    .category-pill {
      color: #b45309;
      background: #fef3c7;
      border-color: rgba(217, 119, 6, 0.2);
    }

    .rating-pill {
      font-size: 0.72rem;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.12);
      padding: 3px 8px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .rating-pill:hover {
      background: #f4ece1;
    }
    .star-icon { color: #f59e0b; }
    .review-count { color: #7d5b45; font-size: 0.68rem; }

    /* Dish Actions */
    .dish-actions {
      display: flex;
      gap: 8px;
    }
    .btn-read-reviews {
      flex: 1;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.15);
      color: #522d1a;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-read-reviews:hover {
      background: #522d1a;
      color: #ffffff;
      border-color: #522d1a;
    }
    .btn-add-review {
      background: #ffffff;
      border: 1px solid rgba(217, 119, 6, 0.35);
      color: #b45309;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-add-review:hover {
      background: #fef3c7;
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 14, 8, 0.65);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease;
    }
    .modal-card {
      width: 100%;
      max-width: 580px;
      max-height: 85vh;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid rgba(74, 40, 22, 0.15);
      box-shadow: 0 16px 40px rgba(38, 20, 11, 0.3);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .small-modal { max-width: 480px; }

    .modal-head {
      padding: 1.5rem 1.75rem;
      border-bottom: 1px solid rgba(74, 40, 22, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      background: #faf7f2;
    }
    .modal-dish-preview {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .modal-thumb {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      object-fit: cover;
      border: 1px solid rgba(74, 40, 22, 0.14);
    }
    .modal-category {
      font-size: 0.65rem;
      font-weight: 800;
      color: #b45309;
      letter-spacing: 0.08em;
    }
    .modal-dish-preview h3 {
      margin: 2px 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.15rem;
      color: #231208;
    }
    .modal-price {
      font-size: 0.82rem;
      font-weight: 700;
      color: #8c4f2e;
    }
    .btn-close {
      background: none;
      border: 1px solid rgba(74, 40, 22, 0.15);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1rem;
      color: #573926;
      cursor: pointer;
    }
    .btn-close:hover { background: #e2ad8e; color: #231208; }

    /* Modal Reviews List */
    .modal-reviews-list {
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .reviews-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .reviews-title-row h4 {
      margin: 0;
      font-size: 0.92rem;
      color: #231208;
    }
    .btn-inline-add {
      background: none;
      border: none;
      color: #b45309;
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-inline-add:hover { text-decoration: underline; }

    .review-item {
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.08);
      border-radius: 12px;
      padding: 12px 14px;
    }
    .rev-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .rev-user {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.84rem;
      color: #231208;
    }
    .user-avatar-circle {
      width: 24px;
      height: 24px;
      background: #f4ece1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }
    .rev-meta {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .rev-stars .star {
      color: #d1d5db;
      font-size: 0.85rem;
    }
    .rev-stars .star.filled {
      color: #f59e0b;
    }
    .rev-date {
      font-size: 0.7rem;
      color: #9c806f;
    }
    .rev-comment {
      margin: 0;
      color: #573926;
      font-size: 0.84rem;
      line-height: 1.45;
      font-style: italic;
    }

    /* Add Review Form */
    .review-form {
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .review-form label {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #573926;
      margin-bottom: 6px;
      display: block;
    }
    .review-form input, .review-form textarea {
      width: 100%;
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.14);
      border-radius: 10px;
      padding: 10px 12px;
      font-family: inherit;
      font-size: 0.88rem;
      color: #231208;
      outline: none;
    }
    .review-form input:focus, .review-form textarea:focus {
      border-color: #8c4f2e;
      background: #ffffff;
    }
    .star-rating-selector {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .star-select-btn {
      background: none;
      border: none;
      font-size: 1.6rem;
      color: #d1d5db;
      cursor: pointer;
      transition: color 0.15s ease;
      padding: 0 2px;
    }
    .star-select-btn.active {
      color: #f59e0b;
    }
    .rating-label {
      margin-left: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      color: #8c4f2e;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 6px;
    }
    .btn-cancel {
      background: #faf7f2;
      border: 1px solid rgba(74, 40, 22, 0.15);
      color: #573926;
      padding: 9px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.84rem;
      cursor: pointer;
    }
    .btn-submit-review {
      background: #26140b;
      color: #ffffff;
      border: none;
      padding: 9px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.84rem;
      cursor: pointer;
    }
    .btn-submit-review:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .dish-card {
        flex-direction: column;
      }
      .dish-thumb-wrap {
        width: 100%;
        height: 180px;
      }
    }
  `]
})
export class MenuComponent {
  private menuService = inject(MenuService);
  private authService = inject(AuthService);

  searchQuery = '';
  selectedCategory = 'all';

  categories = [
    { id: 'all', label: 'All Dishes', icon: '🍽️' },
    { id: 'starters', label: 'Starters', icon: '🥑' },
    { id: 'mains', label: 'Main Course', icon: '🍛' },
    { id: 'desserts', label: 'Desserts', icon: '🍫' },
    { id: 'beverages', label: 'Beverages', icon: '🍹' }
  ];

  activeReviewDish: MenuItem | null = null;
  addingReviewDish: MenuItem | null = null;

  newReviewerName = this.authService.getCurrentUser()?.name || 'Valued Diner';
  newRating = 5;
  newComment = '';

  get filteredDishes(): MenuItem[] {
    const dishes = this.menuService.getDishes();
    return dishes.filter(dish => {
      const matchCat = this.selectedCategory === 'all' || dish.category === this.selectedCategory;
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }

  openReviewModal(dish: MenuItem): void {
    this.activeReviewDish = dish;
  }

  openAddReviewModal(dish: MenuItem): void {
    this.addingReviewDish = dish;
    this.activeReviewDish = null;
    this.newRating = 5;
    this.newComment = '';
    this.newReviewerName = this.authService.getCurrentUser()?.name || 'Valued Diner';
  }

  closeModals(): void {
    this.activeReviewDish = null;
    this.addingReviewDish = null;
  }

  submitReview(): void {
    if (!this.addingReviewDish || !this.newComment.trim()) return;

    this.menuService.addReview(this.addingReviewDish.id, {
      userName: this.newReviewerName.trim() || 'Anonymous Diner',
      rating: this.newRating,
      comment: this.newComment.trim()
    });

    // Refresh active preview
    const updated = this.menuService.getDishById(this.addingReviewDish.id);
    this.closeModals();
    if (updated) {
      this.activeReviewDish = updated;
    }
  }
}
