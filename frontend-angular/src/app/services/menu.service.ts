import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem, DishReview } from '../models/restaurant.model';
import { RestaurantService } from './restaurant.service';

const MENU_STORAGE_KEY = 'foodcourt_menu_items_v1';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private restaurantService = inject(RestaurantService);

  private readonly initialDishes: MenuItem[] = [
    {
      id: 'dish-1',
      name: 'Signature Truffle Butter Chicken',
      category: 'mains',
      price: 495,
      description: 'Slow-simmered tender chicken morsels in a velvety tomato-cream reduction, finished with white truffle ghee and smoked fenugreek.',
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      isChefSpecial: true,
      prepTime: '20 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-1',
          userName: 'Arjun Singhania',
          rating: 5,
          comment: 'The hint of white truffle in the gravy takes classic butter chicken to luxury heights! Absolutely divine.',
          date: '2026-11-20'
        },
        {
          id: 'rev-2',
          userName: 'Neha Roy',
          rating: 5,
          comment: 'Perfect portion size and melts in the mouth. Paired with garlic naan, it is unbeatable.',
          date: '2026-11-18'
        }
      ]
    },
    {
      id: 'dish-2',
      name: 'Paneer Lababdar with Charred Peppers',
      category: 'mains',
      price: 420,
      description: 'Cottage cheese cubes tossed with bell peppers and spiced cashew gravy, garnished with crisp ginger juliennes and saffron cream.',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isSpicy: true,
      prepTime: '18 mins',
      rating: 4.8,
      reviews: [
        {
          id: 'rev-3',
          userName: 'Ramesh Patel',
          rating: 5,
          comment: 'Paneer was super soft and fresh. The gravy had the exact balance of tanginess and richness.',
          date: '2026-11-22'
        },
        {
          id: 'rev-4',
          userName: 'Sunita Sharma',
          rating: 4,
          comment: 'Very tasty vegetarian main course. Family loved it.',
          date: '2026-11-15'
        }
      ]
    },
    {
      id: 'dish-3',
      name: 'Crispy Avocado & Sweet Corn Tartlets',
      category: 'starters',
      price: 360,
      description: 'Golden tart shells filled with Hass avocado mousse, charred sweet corn, pomegranate pearls, and tamarind-lime glaze.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isChefSpecial: true,
      prepTime: '12 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-5',
          userName: 'Ria Sen',
          rating: 5,
          comment: 'The presentation was like a five-star Michelin plating! Crunchy, creamy, and totally refreshing.',
          date: '2026-11-23'
        }
      ]
    },
    {
      id: 'dish-4',
      name: 'Galouti Kebab on Mini Saffron Paratha',
      category: 'starters',
      price: 480,
      description: 'Melt-in-mouth spiced lamb patties infused with potli masala, served over silvered saffron sheermal crisps with mint mousse.',
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      isChefSpecial: true,
      prepTime: '15 mins',
      rating: 5.0,
      reviews: [
        {
          id: 'rev-6',
          userName: 'Vikram Malhotra',
          rating: 5,
          comment: 'Hands down the most authentic Galouti kebab outside Lucknow. Literally disintegrates into flavor on your tongue.',
          date: '2026-11-21'
        },
        {
          id: 'rev-7',
          userName: 'Ayesha Khan',
          rating: 5,
          comment: 'Unbelievably delicious! Will come back just for this starter.',
          date: '2026-11-19'
        }
      ]
    },
    {
      id: 'dish-5',
      name: 'Dum Pukht Awadhi Lamb Biryani',
      category: 'mains',
      price: 580,
      description: 'Long-grain aged basmati rice layered with aromatic tender lamb, saffron milk, caramelized shallots, and slow-cooked in a dough-sealed handi.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      isSpicy: true,
      prepTime: '25 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-8',
          userName: 'Karan Mehra',
          rating: 5,
          comment: 'Aroma hits you the moment the clay handi is opened. Rice grains are perfectly separated and meat is so tender.',
          date: '2026-11-22'
        }
      ]
    },
    {
      id: 'dish-6',
      name: 'Belgian Dark Chocolate Lava Fondant',
      category: 'desserts',
      price: 340,
      description: '70% Valrhona dark chocolate cake with a molten truffle molten core, accompanied by Madagascar vanilla bean gelato and cocoa dust.',
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isChefSpecial: true,
      prepTime: '14 mins',
      rating: 5.0,
      reviews: [
        {
          id: 'rev-9',
          userName: 'Pooja Hegde',
          rating: 5,
          comment: 'The chocolate eruption is glorious! Matches the White & Chocolate restaurant aesthetic so nicely.',
          date: '2026-11-24'
        },
        {
          id: 'rev-10',
          userName: 'Rohan Joshi',
          rating: 5,
          comment: 'Not overly sweet, pure rich cocoa bliss. 10/10.',
          date: '2026-11-19'
        }
      ]
    },
    {
      id: 'dish-7',
      name: 'Saffron & Cardamom Shahi Tukda Mousse',
      category: 'desserts',
      price: 310,
      description: 'Ghee-crisped brioche cubes soaked in rose rabri, layered with saffron chantilly and 24k edible gold leaf.',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '10 mins',
      rating: 4.8,
      reviews: [
        {
          id: 'rev-11',
          userName: 'Deepak Varma',
          rating: 5,
          comment: 'Royal dessert! The cardamom fragrance is mesmerizing.',
          date: '2026-11-17'
        }
      ]
    },
    {
      id: 'dish-8',
      name: 'Smoked Berry & Rosemary Craft Mocktail',
      category: 'beverages',
      price: 240,
      description: 'Muddled wild blueberries, crushed rosemary, fresh pomegranate extract, touched with sparkling elderflower water and cold applewood smoke.',
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '8 mins',
      rating: 4.7,
      reviews: [
        {
          id: 'rev-12',
          userName: 'Ananya Roy',
          rating: 5,
          comment: 'Arrived under a glass cloche with aromatic smoke. So refreshing and photogenic!',
          date: '2026-11-23'
        }
      ]
    },
    {
      id: 'dish-9',
      name: 'Darjeeling First Flush Royal Tea Service',
      category: 'beverages',
      price: 210,
      description: 'Single-estate champagne of teas brewed at 92°C, served with organic wildflower honey, almond biscotti, and lemon twists.',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '6 mins',
      rating: 4.8,
      reviews: [
        {
          id: 'rev-13',
          userName: 'David Miller',
          rating: 5,
          comment: 'Delicate floral notes. Perfect afternoon beverage.',
          date: '2026-11-16'
        }
      ]
    }
  ];

  private menuSubject = new BehaviorSubject<MenuItem[]>(this.loadStoredMenu());
  public menu$: Observable<MenuItem[]> = this.menuSubject.asObservable();

  private loadStoredMenu(): MenuItem[] {
    try {
      const stored = localStorage.getItem(MENU_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return this.initialDishes;
  }

  private saveMenu(items: MenuItem[]): void {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // fallback
    }
    this.menuSubject.next(items);
  }

  getDishes(): MenuItem[] {
    return this.menuSubject.value;
  }

  getDishById(id: string): MenuItem | undefined {
    return this.menuSubject.value.find(d => d.id === id);
  }

  addReview(dishId: string, review: Omit<DishReview, 'id' | 'date'>): void {
    const dishes = [...this.menuSubject.value];
    const index = dishes.findIndex(d => d.id === dishId);

    if (index !== -1) {
      const newReview: DishReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userName: review.userName || 'Anonymous Diner',
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString().split('T')[0]
      };

      const currentReviews = dishes[index].reviews || [];
      const updatedReviews = [newReview, ...currentReviews];
      const avgRating = Number(
        (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
      );

      dishes[index] = {
        ...dishes[index],
        reviews: updatedReviews,
        rating: avgRating
      };

      this.saveMenu(dishes);
      this.restaurantService.showToast(`Thank you ${newReview.userName}! Your review has been added.`, 'success');
    }
  }

  resetMenuToDefaults(): void {
    this.saveMenu(this.initialDishes);
    this.restaurantService.showToast('Menu dishes and reviews reset to gourmet defaults.', 'info');
  }
}
