import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem, DishReview } from '../models/restaurant.model';
import { RestaurantService } from './restaurant.service';

const MENU_STORAGE_KEY = 'foodcourt_menu_items_v2';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private restaurantService = inject(RestaurantService);

  private readonly initialDishes: MenuItem[] = [
    // ==================== STARTERS & APPETIZERS ====================
    {
      id: 'dish-1',
      name: 'Crispy Avocado & Sweet Corn Tartlets',
      category: 'starters',
      price: 360,
      description: 'Golden shortcrust tart shells filled with Hass avocado mousse, charred sweet corn, pomegranate pearls, and tamarind-lime glaze.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isChefSpecial: true,
      prepTime: '12 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-1',
          userName: 'Ria Sen',
          rating: 5,
          comment: 'The presentation was like a five-star Michelin plating! Crunchy, creamy, and totally refreshing.',
          date: '2026-11-23'
        },
        {
          id: 'rev-2',
          userName: 'Kunal Kapoor',
          rating: 5,
          comment: 'Perfect light appetizer before the mains. Tart shells stay crisp!',
          date: '2026-11-20'
        }
      ]
    },
    {
      id: 'dish-2',
      name: 'Galouti Kebab on Mini Saffron Paratha',
      category: 'starters',
      price: 480,
      description: 'Melt-in-mouth spiced lamb patties infused with 32 potli masalas, served over silvered saffron sheermal crisps with mint mousse.',
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      isChefSpecial: true,
      prepTime: '15 mins',
      rating: 5.0,
      reviews: [
        {
          id: 'rev-3',
          userName: 'Vikram Malhotra',
          rating: 5,
          comment: 'Hands down the most authentic Galouti kebab outside Lucknow. Literally melts away.',
          date: '2026-11-21'
        },
        {
          id: 'rev-4',
          userName: 'Ayesha Khan',
          rating: 5,
          comment: 'Unbelievably delicious! Will come back just for this starter.',
          date: '2026-11-19'
        }
      ]
    },
    {
      id: 'dish-3',
      name: 'Dahi Ke Kebab with Mint Emulsion',
      category: 'starters',
      price: 340,
      description: 'Velvety spiced hung curd medallions with a crisp panko-semolina crust, served with roasted cumin pomegranate chutney.',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '14 mins',
      rating: 4.8,
      reviews: [
        {
          id: 'rev-5',
          userName: 'Pooja Verma',
          rating: 5,
          comment: 'Crispy outside, super creamy hung curd inside. Simply exquisite!',
          date: '2026-11-22'
        }
      ]
    },
    {
      id: 'dish-4',
      name: 'Tandoori Zafrani Tiger Prawns',
      category: 'starters',
      price: 620,
      description: 'Jumbo bay prawns marinated in Kashmiri saffron yogurt, crushed carom seeds, and yellow chili, flame-roasted in the clay oven.',
      imageUrl: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      isChefSpecial: true,
      prepTime: '16 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-6',
          userName: 'Sameer Joshi',
          rating: 5,
          comment: 'Juicy, succulent prawns with just the right amount of smokiness.',
          date: '2026-11-23'
        }
      ]
    },
    {
      id: 'dish-5',
      name: 'Murgh Malai Tikka with Cardamom Foam',
      category: 'starters',
      price: 450,
      description: 'Tender chicken supremes steeped in clotted cream, white pepper, and green cardamom, char-grilled to golden perfection.',
      imageUrl: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      prepTime: '15 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-7',
          userName: 'Nikhil Saxena',
          rating: 5,
          comment: 'Softest chicken tikka in town! The cardamom aroma is incredible.',
          date: '2026-11-18'
        }
      ]
    },
    {
      id: 'dish-6',
      name: 'Crispy Lotus Stem in Smoked Honey Chili',
      category: 'starters',
      price: 330,
      description: 'Thinly sliced crisp lotus root glazed with organic wild honey, toasted sesame seeds, scallions, and crushed bird-eye chilies.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isSpicy: true,
      prepTime: '12 mins',
      rating: 4.7,
      reviews: [
        {
          id: 'rev-8',
          userName: 'Divya Nair',
          rating: 5,
          comment: 'Super addictive crunch! Sweet and spicy balance is top notch.',
          date: '2026-11-21'
        }
      ]
    },

    // ==================== MAIN COURSE ====================
    {
      id: 'dish-7',
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
          id: 'rev-9',
          userName: 'Arjun Singhania',
          rating: 5,
          comment: 'The hint of white truffle in the gravy takes classic butter chicken to luxury heights! Absolutely divine.',
          date: '2026-11-20'
        },
        {
          id: 'rev-10',
          userName: 'Neha Roy',
          rating: 5,
          comment: 'Perfect portion size and melts in the mouth. Paired with garlic naan, it is unbeatable.',
          date: '2026-11-18'
        }
      ]
    },
    {
      id: 'dish-8',
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
          id: 'rev-11',
          userName: 'Ramesh Patel',
          rating: 5,
          comment: 'Paneer was super soft and fresh. The gravy had the exact balance of tanginess and richness.',
          date: '2026-11-22'
        }
      ]
    },
    {
      id: 'dish-9',
      name: 'Dum Pukht Awadhi Lamb Biryani',
      category: 'mains',
      price: 580,
      description: 'Long-grain aged basmati rice layered with aromatic tender lamb, saffron milk, caramelized shallots, and slow-cooked in a dough-sealed clay handi.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      isSpicy: true,
      prepTime: '25 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-12',
          userName: 'Karan Mehra',
          rating: 5,
          comment: 'Aroma hits you the moment the clay handi is opened. Rice grains are perfectly separated and meat is so tender.',
          date: '2026-11-22'
        }
      ]
    },
    {
      id: 'dish-10',
      name: 'Dal Bukhara (18-Hour Slow Simmered)',
      category: 'mains',
      price: 380,
      description: 'Whole black urad lentils gently simmered over slow charcoal embers for 18 hours with vine-ripened plum tomatoes and churned white butter.',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isChefSpecial: true,
      prepTime: '15 mins',
      rating: 5.0,
      reviews: [
        {
          id: 'rev-13',
          userName: 'Aditya Gupta',
          rating: 5,
          comment: 'Rich, creamy, smoky perfection. Best Dal Bukhara I have ever tasted in my life.',
          date: '2026-11-24'
        }
      ]
    },
    {
      id: 'dish-11',
      name: 'Kashmiri Rogan Josh with Ratanjot Bark',
      category: 'mains',
      price: 540,
      description: 'Prime cut mutton braised in an intensely aromatic Kashmiri dried chili sauce, ground ginger, whole spices, and natural alkanet root oil.',
      imageUrl: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=300&auto=format&fit=crop&q=80',
      isVeg: false,
      isSpicy: true,
      prepTime: '22 mins',
      rating: 4.8,
      reviews: [
        {
          id: 'rev-14',
          userName: 'Farhan Zaidi',
          rating: 5,
          comment: 'Proper traditional Kashmiri preparation. Meat slides off the bone effortlessly.',
          date: '2026-11-21'
        }
      ]
    },
    {
      id: 'dish-12',
      name: 'Wild Mushroom & Truffle Risotto',
      category: 'mains',
      price: 490,
      description: 'Italian Carnaroli rice cooked in a fortified vegetable-porcini broth, aged Grana Padano, wild chanterelles, and white truffle essence.',
      imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '20 mins',
      rating: 4.7,
      reviews: [
        {
          id: 'rev-15',
          userName: 'Elena Rostova',
          rating: 5,
          comment: 'Perfect al dente texture and earthy mushroom depth. Super satisfying!',
          date: '2026-11-19'
        }
      ]
    },
    {
      id: 'dish-13',
      name: 'Artisanal Bread Basket (Truffle Naan & Kulcha)',
      category: 'mains',
      price: 240,
      description: 'Assorted hot tandoori breads: chur-chur paratha, roasted garlic butter naan, and Amritsari spiced onion kulcha with house dips.',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '10 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-16',
          userName: 'Tanvi Shah',
          rating: 5,
          comment: 'Piping hot and so flaky! The truffle garlic naan is out of this world.',
          date: '2026-11-23'
        }
      ]
    },

    // ==================== DESSERTS & CONFECTIONERY ====================
    {
      id: 'dish-14',
      name: 'Belgian Dark Chocolate Lava Fondant',
      category: 'desserts',
      price: 340,
      description: '70% Valrhona dark chocolate cake with a warm molten truffle core, served with Madagascar vanilla bean gelato and cocoa crumble.',
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isChefSpecial: true,
      prepTime: '14 mins',
      rating: 5.0,
      reviews: [
        {
          id: 'rev-17',
          userName: 'Pooja Hegde',
          rating: 5,
          comment: 'The chocolate eruption is glorious! Matches the White & Chocolate restaurant aesthetic so nicely.',
          date: '2026-11-24'
        },
        {
          id: 'rev-18',
          userName: 'Rohan Joshi',
          rating: 5,
          comment: 'Not overly sweet, pure rich cocoa bliss. 10/10.',
          date: '2026-11-19'
        }
      ]
    },
    {
      id: 'dish-15',
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
          id: 'rev-19',
          userName: 'Deepak Varma',
          rating: 5,
          comment: 'Royal dessert! The cardamom fragrance is mesmerizing.',
          date: '2026-11-17'
        }
      ]
    },
    {
      id: 'dish-16',
      name: 'Baked Gulab Jamun Cheesecake',
      category: 'desserts',
      price: 350,
      description: 'New York style baked cream cheese layered over miniature artisanal rosewater gulab jamuns, finished with pistachio praline.',
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isChefSpecial: true,
      prepTime: '10 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-20',
          userName: 'Simran Walia',
          rating: 5,
          comment: 'Fusion done to perfection! Creamy cheesecake meets soft warm gulab jamun.',
          date: '2026-11-22'
        }
      ]
    },
    {
      id: 'dish-17',
      name: 'Artisanal Kesar Pista Matka Kulfi',
      category: 'desserts',
      price: 260,
      description: 'Traditional slow-reduced whole milk kulfi infused with saffron strands and roasted Iranian pistachios, frozen in terracotta pots.',
      imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '6 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-21',
          userName: 'Harish Rao',
          rating: 5,
          comment: 'Authentic rich taste, served ice cold in a clay pot. Refreshing ending to the meal.',
          date: '2026-11-23'
        }
      ]
    },

    // ==================== CRAFT BEVERAGES & MOCKTAILS ====================
    {
      id: 'dish-18',
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
          id: 'rev-22',
          userName: 'Ananya Roy',
          rating: 5,
          comment: 'Arrived under a glass cloche with aromatic smoke. So refreshing and photogenic!',
          date: '2026-11-23'
        }
      ]
    },
    {
      id: 'dish-19',
      name: 'Alphonso Mango & Thai Basil Fizz',
      category: 'beverages',
      price: 230,
      description: 'Ratnagiri Alphonso mango nectar shaken with crushed sweet Thai basil, kaffir lime leaf, and effervescent tonic.',
      imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      isChefSpecial: true,
      prepTime: '7 mins',
      rating: 4.8,
      reviews: [
        {
          id: 'rev-23',
          userName: 'Siddharth Bose',
          rating: 5,
          comment: 'Real mango flavor, not artificial syrup. Super cooling on the palate.',
          date: '2026-11-21'
        }
      ]
    },
    {
      id: 'dish-20',
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
          id: 'rev-24',
          userName: 'David Miller',
          rating: 5,
          comment: 'Delicate floral notes. Perfect afternoon beverage.',
          date: '2026-11-16'
        }
      ]
    },
    {
      id: 'dish-21',
      name: 'Cold Brew Coffee with Salted Hazelnut Foam',
      category: 'beverages',
      price: 250,
      description: '16-hour steeped Arabica cold brew poured over clear ice, crowned with velvety sea-salt roasted hazelnut foam.',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80',
      isVeg: true,
      prepTime: '5 mins',
      rating: 4.9,
      reviews: [
        {
          id: 'rev-25',
          userName: 'Preeti Deshmukh',
          rating: 5,
          comment: 'Bold smooth coffee with delicious hazelnut foam. Beats most cafes easily.',
          date: '2026-11-20'
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
