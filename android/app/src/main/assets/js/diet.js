/**
 * ============================================================================
 * FitBuddy - Diet & Nutrition Planner Logic (diet.js)
 * Clean, lightweight, student- and home-friendly meal planner.
 * Features:
 * 1. Reads user preference and goal from profile if available.
 * 2. 5 Meal Categories: Breakfast, Mid-Morning, Lunch, Evening Snack, Dinner.
 * 3. 3 Diet Preferences: Vegetarian, Eggetarian, Non-Vegetarian.
 * 4. 5 Fitness Goals: General Fitness, Weight Management, Muscle Gain, Strength, Endurance.
 * 5. Simple, affordable foods (no complex tracking or medical claims).
 * 6. Interactive meal-replacement swap button for every meal card.
 * 7. Clear short explanations for every suggestion.
 * ============================================================================
 */

// State
let activeDietPreference = 'Vegetarian';
let activeFitnessGoal = 'General Fitness';
// Tracks which option index is active per meal slot (0 = Primary, 1 = Swap 1, 2 = Swap 2)
let mealSwapIndices = [0, 0, 0, 0, 0];

const MEAL_CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', timing: '7:30 AM – 9:00 AM', badge: '1. BREAKFAST' },
  { id: 'mid-morning', name: 'Mid-Morning', timing: '11:00 AM – 11:30 AM', badge: '2. MID-MORNING' },
  { id: 'lunch', name: 'Lunch', timing: '1:00 PM – 2:00 PM', badge: '3. LUNCH' },
  { id: 'evening-snack', name: 'Evening Snack', timing: '5:00 PM – 6:00 PM', badge: '4. EVENING SNACK' },
  { id: 'dinner', name: 'Dinner', timing: '8:00 PM – 9:00 PM', badge: '5. DINNER' }
];

/**
 * Clean SVG Food Icons
 */
const MEAL_ICONS = {
  breakfast: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 24C8 28.4 11.6 32 16 32H24C28.4 32 32 28.4 32 24V22H8V24Z" fill="#B9F36A" />
      <path d="M6 22H34C35.1 22 36 21.1 36 20C36 18.9 35.1 18 34 18H6C4.9 18 4 18.9 4 20C4 21.1 4.9 22 6 22Z" fill="#17251F" />
      <path d="M12 14C12 14 13 10 16 10C19 10 19 14 22 14C25 14 25 10 28 10" stroke="#17251F" stroke-width="2.5" stroke-linecap="round" />
    </svg>
  `,
  'mid-morning': `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="22" r="12" fill="#B9F36A" />
      <path d="M20 22C17 22 14 19 14 16C14 12 18 9 20 9C22 9 26 12 26 16C26 19 23 22 20 22Z" stroke="#17251F" stroke-width="2.5" />
      <path d="M20 9V5C20 5 23 5 25 7" stroke="#17251F" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="27" cy="26" r="4" fill="#17251F" />
    </svg>
  `,
  lunch: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="15" fill="#B9F36A" stroke="#17251F" stroke-width="2.5" />
      <circle cx="20" cy="20" r="9" stroke="#17251F" stroke-width="2" stroke-dasharray="3 3" />
      <path d="M15 17H25M17 23H23" stroke="#17251F" stroke-width="2" stroke-linecap="round" />
    </svg>
  `,
  'evening-snack': `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="16" width="16" height="14" rx="3" fill="#B9F36A" stroke="#17251F" stroke-width="2.5" />
      <path d="M26 19H29C30.6 19 32 20.4 32 22C32 23.6 30.6 25 29 25H26" stroke="#17251F" stroke-width="2.5" />
      <path d="M14 11C14 11 15 9 15 7M19 11C19 11 20 9 20 7M23 11C23 11 24 9 24 7" stroke="#17251F" stroke-width="2" stroke-linecap="round" />
    </svg>
  `,
  dinner: `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="22" r="13" fill="#B9F36A" stroke="#17251F" stroke-width="2.5" />
      <path d="M14 14C16 11 20 10 24 11" stroke="#17251F" stroke-width="2" stroke-linecap="round" />
      <path d="M26 7C28 9 29 12 28 15C25 15 22 13 22 10C22 8.8 22.4 7.8 23 7" fill="#17251F" />
      <path d="M12 22H28" stroke="#17251F" stroke-width="2" stroke-linecap="round" />
    </svg>
  `
};

/**
 * Comprehensive Dataset of Affordable Meal Suggestions & Swaps
 */
const DIET_DATABASE = {
  // --------------------------------------------------------------------------
  // 1. BREAKFAST
  // --------------------------------------------------------------------------
  breakfast: {
    Vegetarian: {
      'General Fitness': {
        title: 'Peanut Butter Banana Oatmeal & Warm Milk',
        items: ['Rolled oats (40–50g)', '1 Medium banana, sliced', '1 tbsp Creamy peanut butter', '1 Glass warm cow milk or soy milk'],
        explanation: 'Provides sustained morning energy with complex oats and healthy fats to support active daily focus without hunger spikes.',
        alternatives: [
          {
            title: 'Spiced Besan Cheela (Savory Chickpea Pancakes)',
            items: ['2 Medium besan pancakes with onion & tomato', '2 tbsp Mint-coriander chutney', '1 Cup curd (plain yogurt)'],
            explanation: 'High-fiber plant protein option that cooks in 8 minutes and keeps digestive energy light.'
          },
          {
            title: 'Vegetable Poha with Roasted Peanuts',
            items: ['1 Bowl flattened rice with peas & carrots', 'Handful roasted peanuts', 'Fresh lemon juice squeeze'],
            explanation: 'Traditional, easily digestible carbohydrate breakfast providing quick morning alertness and healthy micronutrients.'
          }
        ]
      },
      'Weight Management': {
        title: 'High-Fiber Sprouted Moong Salad with Lemon',
        items: ['1 Big bowl sprouted green moong', 'Diced cucumber, tomatoes & onions', '1 tsp Roasted cumin & chaat masala', 'Squeeze of fresh lemon'],
        explanation: 'Very filling, high in dietary fiber and water volume to keep you satisfied through late morning with minimal preparation.',
        alternatives: [
          {
            title: 'Warm Vegetable Oats with Toasted Seeds',
            items: ['Savory oats cooked with spinach & carrots', '1 tsp Flaxseeds or chia seeds', '1 Cup warm green tea'],
            explanation: 'Gentle on the stomach and packed with soluble beta-glucan fiber to regulate fullness.'
          },
          {
            title: 'Paneer Stuffed Whole Wheat Roll (Dry Toast)',
            items: ['1 Whole wheat roti wrap', '60g Crumbled fresh paneer with mint', 'Side of raw cucumber slices'],
            explanation: 'Balanced protein-to-carb ratio that curbs mid-day snack cravings without heavy oils.'
          }
        ]
      },
      'Muscle Gain': {
        title: 'Double Peanut Butter Oatmeal & Paneer Bhurji',
        items: ['60g Rolled oats with whole milk & honey', '2 tbsp Peanut butter + 1 sliced banana', '75g Fresh paneer scramble on the side'],
        explanation: 'Calorically dense, high-protein breakfast that kickstarts muscle protein synthesis and supplies all-morning training fuel.',
        alternatives: [
          {
            title: 'Paneer Parathas with Thick Curd',
            items: ['2 Paneer-stuffed whole wheat flatbreads', '1 Bowl thick plain curd', 'Handful of soaked almonds'],
            explanation: 'Traditional whole-food mass builder loaded with calcium, healthy dairy fats, and quality calories.'
          },
          {
            title: 'Soya Chunks Upma with Roasted Cashews',
            items: ['Semolina upma with boiled soya nuggets', 'Chopped carrots & green beans', '1 Glass whole milk'],
            explanation: 'Affordable protein punch from soy and semolina providing sustained fuel for intense workouts.'
          }
        ]
      },
      'Strength': {
        title: 'Warm Oatmeal with Soaked Almonds & Honey Milk',
        items: ['50g Rolled oats cooked in whole milk', '8–10 Soaked almonds & 1 tbsp raisins', '2 Slices whole wheat toast with peanut butter'],
        explanation: 'Calorie-rich complex carbohydrates paired with healthy fats to sustain heavy compound lifts.',
        alternatives: [
          {
            title: 'Besan & Soya Flour Cheela with Curd',
            items: ['2 High-protein savory chickpea pancakes', '1 Bowl thick curd', '1 Sliced banana'],
            explanation: 'Durable plant protein pairing with mineral-rich seeds for joint and tendon resilience.'
          },
          {
            title: 'Sprouted Chana & Paneer Chaat',
            items: ['Boiled black chana with paneer cubes', 'Onions, tomatoes, lime & rock salt', '1 Cup masala chai'],
            explanation: 'Slow-release energy with natural electrolytes and iron for sustained gym strength.'
          }
        ]
      },
      'Endurance': {
        title: 'Banana Honey Oatmeal with Walnuts & Milk',
        items: ['60g Oats with 1 cup milk & honey', '2 Ripe bananas, sliced', '4 Crushed walnut halves', '1 Glass water with lemon'],
        explanation: 'Restores glycogen reserves quickly while nuts supply sustained energy for long runs and cardiovascular conditioning.',
        alternatives: [
          {
            title: 'Peanut Butter & Jam Toast with Fresh Fruit Bowl',
            items: ['2 Slices whole grain bread with peanut butter', '1 Bowl diced papaya or watermelon', '1 Cup light tea'],
            explanation: 'Rapidly absorbed carbohydrates combined with hydration for cardiovascular stamina.'
          },
          {
            title: 'Sweet Vegetable Dalia (Broken Wheat Porridge)',
            items: ['1 Bowl dalia cooked with milk & jaggery', 'Handful of golden raisins & seeds'],
            explanation: 'Wholesome ancient grain porridge offering complex carbs and high B-vitamin energy support.'
          }
        ]
      }
    },
    Eggetarian: {
      'General Fitness': {
        title: '3 Boiled Eggs & Whole Wheat Toast with Fruit',
        items: ['2 Whole boiled eggs + 1 egg white', '2 Slices toasted whole wheat bread', '1 Seasonal apple or orange', '1 Glass water'],
        explanation: 'Clean, complete amino acid profile from whole eggs paired with whole grains for steady morning vitality.',
        alternatives: [
          {
            title: '2-Egg Vegetable Omelette with Toast',
            items: ['2 Egg omelette with onions, tomatoes & spinach', '1 Slice toasted brown bread', 'Warm green tea or chai'],
            explanation: 'Quick 5-minute hostel cooking staple rich in choline and lutein.'
          },
          {
            title: 'Egg Bhurji (Scramble) with 2 Rotis',
            items: ['2 Scrambled eggs cooked with mild spices', '2 Warm whole wheat chapatis', 'Fresh cucumber slices'],
            explanation: 'Traditional comfort breakfast that supports lean tissue maintenance and keeps you alert.'
          }
        ]
      },
      'Weight Management': {
        title: '3 Boiled Egg Whites & Tomato Salad with Green Tea',
        items: ['3 Boiled egg whites (with black pepper)', '1 Whole boiled egg', 'Sliced cucumber and juicy tomatoes', '1 Cup hot green tea'],
        explanation: 'Very high protein-to-calorie density that eliminates morning snacking without feeling deprived.',
        alternatives: [
          {
            title: 'Spinach & Egg White Scramble',
            items: ['3 Egg whites scrambled with baby spinach', '1 Slice dry toasted whole wheat bread', 'Lemon water'],
            explanation: 'Nutrient-rich, micronutrient-dense breakfast with virtually zero saturated fats.'
          },
          {
            title: 'Egg White Moong Sprout Bowl',
            items: ['2 Chopped hard-boiled egg whites', '1 Bowl steamed sprouted moong', 'Lime juice & pink salt'],
            explanation: 'Dual-source plant and egg protein pairing for exceptional satiety.'
          }
        ]
      },
      'Muscle Gain': {
        title: '4 Eggs (Scrambled) with Peanut Butter Toast & Banana',
        items: ['3 Whole eggs + 1 egg white scrambled', '2 Slices whole wheat bread with peanut butter', '1 Large banana', '1 Glass milk'],
        explanation: 'Over 28g of high-biological-value protein and clean calories to fuel hyper-trophy and muscle repair.',
        alternatives: [
          {
            title: 'Double Egg Parathas with Curd',
            items: ['2 Whole wheat egg rolls / parathas', '1 Bowl thick plain curd', 'Handful of almonds'],
            explanation: 'Affordable, easy-to-prep calorie builder with full amino acid coverage.'
          },
          {
            title: 'Boiled Egg Oatmeal Mash',
            items: ['3 Boiled eggs on the side', '1 Big bowl oatmeal cooked with peanut butter & milk'],
            explanation: 'Combines slow-burning carbs with fast-acting egg protein for optimal morning muscle priming.'
          }
        ]
      },
      'Strength': {
        title: '3 Boiled Eggs, Oatmeal with Milk & Raisins',
        items: ['3 Hard-boiled eggs (sprinkled with black salt)', '1 Warm bowl oatmeal cooked in milk', 'Handful of raisins & walnuts'],
        explanation: 'Provides high-quality animal protein alongside mineral-rich oats for maximal force production.',
        alternatives: [
          {
            title: '3-Egg Omelette with 2 Buttered Rotis',
            items: ['3 Egg omelette with capsicum & onions', '2 Whole wheat rotis with light butter', '1 Glass fresh buttermilk'],
            explanation: 'Wholesome strength staple packed with healthy fats, iron, and B-vitamins.'
          },
          {
            title: 'Egg & Peanut Butter Banana Sandwich',
            items: ['2 Toasted sandwiches (peanut butter + sliced boiled eggs)', '1 Cup warm milk'],
            explanation: 'Convenient hostel prep combining fast energy with steady strength reserves.'
          }
        ]
      },
      'Endurance': {
        title: '2 Boiled Eggs with Banana Honey Toast & Juice',
        items: ['2 Whole boiled eggs', '2 Slices whole grain toast with honey', '1 Sliced banana', '1 Glass lemon electrolytes'],
        explanation: 'Easily digestible carbohydrates for quick glucose plus egg protein to protect muscle tissue during prolonged cardio.',
        alternatives: [
          {
            title: 'Vegetable Egg Bhurji with Brown Rice',
            items: ['2 Egg scramble with peas & carrots', '1 Small bowl steamed rice', '1 Orange'],
            explanation: 'Fast-assimilating glycogen reload ideal for morning runners and cyclists.'
          },
          {
            title: 'Oatmeal Porridge with 2 Egg Whites',
            items: ['Warm sweet oatmeal with dates & milk', '2 Boiled egg whites on the side'],
            explanation: 'Smooth digestion with balanced electrolytes for lasting stamina.'
          }
        ]
      }
    },
    'Non-Vegetarian': {
      'General Fitness': {
        title: 'Boiled Eggs & Whole Grain Toast with Seasonal Fruit',
        items: ['2 Whole boiled eggs', '2 Slices whole grain toast', '1 Small bowl papaya or apple slices', '1 Glass water'],
        explanation: 'Balanced, quick-prep protein and fiber breakfast to power you through your morning without morning fatigue.',
        alternatives: [
          {
            title: 'Shredded Chicken Breast Sandwich',
            items: ['70g Boiled shredded chicken in whole wheat bread', 'Lettuce, cucumber & tomato slices', '1 Cup green tea'],
            explanation: 'Lean poultry protein delivering satiety and clean energy.'
          },
          {
            title: '2-Egg Omelette with Sauteed Mushrooms',
            items: ['2 Eggs whisked with onions & mushrooms', '1 Slice whole wheat toast', '1 Glass fresh lemon water'],
            explanation: 'Delicious morning antioxidant boost with high protein density.'
          }
        ]
      },
      'Weight Management': {
        title: '3 Boiled Egg Whites & Warm Lemon Water',
        items: ['3 Boiled egg whites with black pepper', '1 Whole boiled egg', 'Large bowl sliced cucumbers & cherry tomatoes', '1 Glass warm lemon water'],
        explanation: 'Maximum protein concentration with minimal calories, keeping insulin stable and morning cravings quiet.',
        alternatives: [
          {
            title: 'Grilled Chicken Breast Slices & Green Salad',
            items: ['80g Cold boiled or grilled chicken breast', 'Cucumber, mint, lemon & rock salt', '1 Cup herbal green tea'],
            explanation: 'Ultra-lean breakfast providing complete fullness for zero excess calories.'
          },
          {
            title: 'Egg White & Spinach Scramble with Toast',
            items: ['3 Egg whites scrambled with tomatoes', '1 Dry whole wheat toast', 'Black coffee or tea'],
            explanation: 'Metabolism-friendly, simple hostel cooking that satisfies.'
          }
        ]
      },
      'Muscle Gain': {
        title: '4 Eggs (Omelette or Scrambled) & Peanut Butter Toast',
        items: ['3 Whole eggs + 1 white scrambled', '2 Slices whole wheat toast with peanut butter', '1 Banana', '1 Glass cow milk'],
        explanation: 'Robust 30g+ protein profile packed with clean fats and carbs to stimulate muscle growth.',
        alternatives: [
          {
            title: 'Boiled Chicken Breast & 2 Parathas',
            items: ['100g Shredded spiced chicken breast', '2 Whole wheat rotis / light parathas', '1 Bowl fresh curd'],
            explanation: 'Substantial poultry and complex carb meal for demanding training blocks.'
          },
          {
            title: 'Chicken Keema on Toasted Whole Wheat',
            items: ['100g Lean minced chicken cooked with peas', '2 Slices toasted bread', '1 Glass warm milk'],
            explanation: 'High bioavailability protein meal that digests smoothly before gym sessions.'
          }
        ]
      },
      'Strength': {
        title: '3 Whole Eggs, Peanut Toast & Banana Milkshake',
        items: ['3 Boiled or sunny-side-up eggs', '2 Toasted whole wheat bread slices with peanut butter', '1 Glass blended banana milk with soaked almonds'],
        explanation: 'Dense, natural strength fuel providing essential amino acids, choline, and potassium.',
        alternatives: [
          {
            title: 'Shredded Chicken & Potato Hash with 2 Eggs',
            items: ['80g Boiled chicken + 1 boiled potato', '2 Fried eggs (minimal oil)', '1 Glass water'],
            explanation: 'Old-school lifter fuel supplying sodium, potassium, and amino acids for peak power.'
          },
          {
            title: 'Egg & Chicken Club Sandwich',
            items: ['2 Whole wheat sandwiches with egg & chicken slices', '1 Glass buttermilk with roasted cumin'],
            explanation: 'Portable, hearty meal that keeps strength high all morning.'
          }
        ]
      },
      'Endurance': {
        title: '2 Eggs, Honey Banana Toast & Coconut Water',
        items: ['2 Whole boiled eggs', '2 Slices toast with natural honey', '1 Ripe banana', '1 Glass fresh coconut water'],
        explanation: 'Hydration-rich electrolytes combined with rapid glycogen replenishment and muscular support.',
        alternatives: [
          {
            title: 'Chicken Congee (Rice Porridge with Shredded Chicken)',
            items: ['1 Bowl warm rice porridge with shredded chicken', 'Ginger, green onions & light salt', '1 Boiled egg'],
            explanation: 'Gentle on digestion, extremely hydrating, and ideal after long cardio sessions.'
          },
          {
            title: 'Sweet Oatmeal with 2 Hard-Boiled Eggs',
            items: ['1 Bowl oats with milk & raisins', '2 Boiled eggs on the side'],
            explanation: 'Sustained energy release with steady muscle protection.'
          }
        ]
      }
    }
  },

  // --------------------------------------------------------------------------
  // 2. MID-MORNING SNACK
  // --------------------------------------------------------------------------
  'mid-morning': {
    Vegetarian: {
      'General Fitness': {
        title: 'Roasted Chana (Chickpeas) & Seasonal Fresh Fruit',
        items: ['Handful roasted black chana (30–40g)', '1 Fresh orange, apple, or guava', '1 Glass water'],
        explanation: 'Budget-friendly superfood pairing that offers crunchy fiber, plant protein, and natural vitamin C without cooking.',
        alternatives: [
          {
            title: 'Spiced Buttermilk (Chaas) with Roasted Cumin',
            items: ['1 Big glass fresh buttermilk', 'Pinch of rock salt, mint & cumin', '5 Soaked almonds'],
            explanation: 'Probiotic-rich refresher that cools the body and curbs appetite before lunch.'
          },
          {
            title: 'Roasted Makhana (Foxnuts) with Peanuts',
            items: ['1 Small bowl dry-roasted makhana', '10–12 Roasted peanuts', 'Pinch of chaat masala'],
            explanation: 'Low-calorie crunch providing magnesium, potassium, and heart-healthy fats.'
          }
        ]
      },
      'Weight Management': {
        title: 'Cucumber Slices with Roasted Chana & Green Tea',
        items: ['1 Whole cucumber sliced with lemon & salt', '25g Dry roasted black chana', '1 Warm cup green tea'],
        explanation: 'Extremely low calorie count with high fiber and hydration to suppress mid-morning sugar cravings.',
        alternatives: [
          {
            title: 'Fresh Coconut Water & 5 Almonds',
            items: ['1 Glass tender coconut water', '5 Soaked raw almonds'],
            explanation: 'Natural electrolyte balance without processed sugars or heavy fats.'
          },
          {
            title: 'Sprouted Moong Chaat with Lemon',
            items: ['Small cup raw sprouted moong', 'Tomato, lime & green chili'],
            explanation: 'Enzyme-rich, live plant enzymes that aid gut health.'
          }
        ]
      },
      'Muscle Gain': {
        title: 'Sprouted Moong & Paneer Salad with Peanuts',
        items: ['1 Cup sprouted moong beans', '50g Fresh paneer cubes', 'Handful roasted peanuts', 'Chaat masala & lemon'],
        explanation: 'Mini protein-dense bridge meal preventing catabolism between breakfast and lunch.',
        alternatives: [
          {
            title: 'Whole Milk with 2 Bananas & Dates',
            items: ['1 Glass fresh milk', '2 Small bananas', '2 Medjool dates'],
            explanation: 'Simple caloric surplus fuel loaded with potassium and natural sugars.'
          },
          {
            title: 'Sattu Drink (Roasted Gram Flour with Buttermilk)',
            items: ['2 tbsp Sattu powder mixed in chaas', 'Roasted cumin & coriander leaves'],
            explanation: 'Instant 10g plant protein drink popular for its cooling and sustaining qualities.'
          }
        ]
      },
      'Strength': {
        title: 'Peanut Chana Mix & 1 Ripe Banana',
        items: ['Handful roasted peanuts and roasted chana', '1 Banana', '1 Glass water'],
        explanation: 'Dense source of arginine, healthy fats, and potassium supporting muscular contractions.',
        alternatives: [
          {
            title: 'Paneer Cubes with Black Pepper & Almonds',
            items: ['60g Fresh paneer cubes with pepper', '6 Soaked almonds'],
            explanation: 'Slow-release casein protein keeping amino acid levels steady.'
          },
          {
            title: 'Dry Fruit Energy Nibble',
            items: ['Handful of raisins, cashews & pumpkin seeds'],
            explanation: 'Zinc, magnesium, and concentrated energy for demanding lifters.'
          }
        ]
      },
      'Endurance': {
        title: 'Fresh Seasonal Fruit Bowl with Raisins & Seeds',
        items: ['1 Bowl chopped seasonal fruits (papaya, apple, orange)', '1 tbsp Golden raisins', '1 tsp Sunflower seeds'],
        explanation: 'Replenishes electrolytes and cellular glycogen to prevent mental fatigue during long working hours.',
        alternatives: [
          {
            title: 'Sweet Sattu Lemonade',
            items: ['2 tbsp Roasted gram flour in cold water', '1 tsp Jaggery powder & squeeze of lemon'],
            explanation: 'Natural endurance beverage packed with insoluble fiber and iron.'
          },
          {
            title: 'Banana with Peanut Butter Dip',
            items: ['1 Banana sliced', '1 tbsp Peanut butter'],
            explanation: 'Quick potassium and slow-burning fatty acids.'
          }
        ]
      }
    },
    Eggetarian: {
      'General Fitness': {
        title: '2 Hard-Boiled Eggs with Black Pepper & 1 Fruit',
        items: ['2 Hard-boiled eggs (with a dash of pepper)', '1 Seasonal fruit (orange or apple)', '1 Glass water'],
        explanation: 'Affordable, zero-fuss protein snack easily prepared in any hostel electric kettle or stove.',
        alternatives: [
          {
            title: 'Roasted Chana with Spiced Buttermilk',
            items: ['Handful roasted black chickpeas', '1 Glass chilled spiced buttermilk'],
            explanation: 'Light, hydrating snack when you want a break from eggs.'
          },
          {
            title: 'Boiled Egg White Chaat',
            items: ['2 Boiled egg whites diced with onions & tomatoes', 'Squeeze of lemon & chaat masala'],
            explanation: 'Savory, spicy snack that tastes like street food with zero junk calories.'
          }
        ]
      },
      'Weight Management': {
        title: '2 Boiled Egg Whites & Crunchy Cucumber',
        items: ['2 Hard-boiled egg whites with rock salt', '1 Sliced cucumber', '1 Cup warm green tea'],
        explanation: 'Virtually pure protein and water volume with almost zero carbohydrate or fat impact.',
        alternatives: [
          {
            title: 'Spiced Buttermilk with 1 Boiled Egg White',
            items: ['1 Glass low-fat buttermilk', '1 Hard-boiled egg white with pepper'],
            explanation: 'Great hydration that prevents impulse bakery purchases.'
          },
          {
            title: 'Roasted Makhana with Lemon Water',
            items: ['1 Cup dry roasted foxnuts', '1 Glass chilled lemon water'],
            explanation: 'Crunchy snack satisfying nervous desk fidgeting.'
          }
        ]
      },
      'Muscle Gain': {
        title: '2 Whole Boiled Eggs with Banana & Peanuts',
        items: ['2 Hard-boiled whole eggs', '1 Ripe banana', 'Handful roasted peanuts'],
        explanation: 'Provides roughly 15g protein along with energy-dense fats and fast potassium.',
        alternatives: [
          {
            title: 'Boiled Egg & Sprouted Moong Salad',
            items: ['2 Diced boiled eggs', '1 Cup sprouted moong beans', 'Onion, tomato & lemon'],
            explanation: 'Complete plant and animal amino acid synergy.'
          },
          {
            title: 'Egg & Peanut Butter Toast',
            items: ['1 Slice whole wheat bread with peanut butter', '1 Hard-boiled egg'],
            explanation: 'Pocket-friendly powerhouse snack for hardgainers.'
          }
        ]
      },
      'Strength': {
        title: '2 Boiled Eggs & Handful of Soaked Almonds',
        items: ['2 Hard-boiled eggs', '8 Soaked almonds & 1 tbsp raisins', '1 Glass water'],
        explanation: 'Quality saturated and monounsaturated fats supporting hormonal health and muscle strength.',
        alternatives: [
          {
            title: 'Egg Bhurji Roll on Half Roti',
            items: ['1 Scrambled egg in 1 dry chapati', 'Chopped coriander & onions'],
            explanation: 'Fast midday fuel that holds hunger until lunchtime.'
          },
          {
            title: 'Roasted Chana & Boiled Egg Combo',
            items: ['30g Black chana', '1 Boiled egg with pepper'],
            explanation: 'Dual-texture protein combo high in zinc and iron.'
          }
        ]
      },
      'Endurance': {
        title: '1 Boiled Egg with 1 Large Orange & Coconut Water',
        items: ['1 Whole boiled egg', '1 Big sweet orange', '1 Glass tender coconut water'],
        explanation: 'Electrolyte rehydration combined with amino acids to maintain continuous stamina.',
        alternatives: [
          {
            title: 'Boiled Egg & Banana Power Pair',
            items: ['1 Boiled egg with salt', '1 Banana'],
            explanation: 'Simple, portable hostel snack requiring no preparation time.'
          },
          {
            title: 'Sprouted Chana Chaat with 1 Egg White',
            items: ['Boiled chickpeas with lime', '1 Boiled egg white chopped in'],
            explanation: 'Sustained endurance release without sugar crashes.'
          }
        ]
      }
    },
    'Non-Vegetarian': {
      'General Fitness': {
        title: '2 Boiled Eggs & 1 Seasonal Fruit',
        items: ['2 Hard-boiled eggs', '1 Apple or guava', '1 Glass water'],
        explanation: 'Simple, clean protein and fiber duo keeping blood sugar steady until lunch.',
        alternatives: [
          {
            title: 'Boiled Chicken Breast Bites with Lemon',
            items: ['60g Boiled chicken breast cubes with chaat masala', 'Cucumber sticks'],
            explanation: 'Pure lean poultry protein snack ready from meal-prep.'
          },
          {
            title: 'Roasted Chana & Buttermilk',
            items: ['Handful roasted chickpeas', '1 Glass fresh buttermilk'],
            explanation: 'Quick vegetarian staple alternative for variety.'
          }
        ]
      },
      'Weight Management': {
        title: '2 Boiled Egg Whites & Warm Green Tea',
        items: ['2 Boiled egg whites with black pepper', 'Sliced cucumber with lime', '1 Cup green tea'],
        explanation: 'Satiating, low-calorie protein holding your appetite comfortably until lunch.',
        alternatives: [
          {
            title: 'Shredded Chicken Clear Broth',
            items: ['1 Warm cup chicken clear soup with black pepper', 'Chopped coriander'],
            explanation: 'Thermic and warming for the gut without heavy fats.'
          },
          {
            title: 'Roasted Makhana & Lemon Water',
            items: ['1 Small bowl dry-roasted foxnuts', '1 Glass water with lemon'],
            explanation: 'Crunchy snack for stress-free desk munching.'
          }
        ]
      },
      'Muscle Gain': {
        title: '2 Boiled Eggs & Banana Peanut Butter Cup',
        items: ['2 Whole boiled eggs', '1 Sliced banana with 1 tbsp peanut butter'],
        explanation: 'Packs 16g protein and balanced micronutrients to keep muscles primed.',
        alternatives: [
          {
            title: 'Boiled Chicken & Sprout Bowl',
            items: ['70g Shredded boiled chicken', 'Handful sprouted green moong', 'Lime & black salt'],
            explanation: 'Double-protein booster for serious training volume.'
          },
          {
            title: 'Egg & Chicken Toast',
            items: ['1 Slice whole wheat bread with shredded chicken & 1 sliced egg'],
            explanation: 'Hearty mini-meal for fast metabolisms.'
          }
        ]
      },
      'Strength': {
        title: '2 Boiled Eggs with Almonds & Dates',
        items: ['2 Whole eggs with black salt', '6 Soaked almonds', '2 Dates'],
        explanation: 'Mineral-rich snack delivering zinc, magnesium, and essential lipids for power output.',
        alternatives: [
          {
            title: 'Shredded Chicken Breast with Roasted Peanuts',
            items: ['70g Boiled chicken breast', '15g Roasted peanuts with chaat masala'],
            explanation: 'High protein and healthy fats for muscle stability.'
          },
          {
            title: 'Boiled Egg & Roasted Chana Mix',
            items: ['2 Boiled eggs', 'Handful roasted black chickpeas'],
            explanation: 'Convenient hostel lifter fuel requiring no refrigeration.'
          }
        ]
      },
      'Endurance': {
        title: '1 Boiled Egg, 1 Banana & Coconut Water',
        items: ['1 Whole boiled egg', '1 Ripe banana', '1 Glass tender coconut water'],
        explanation: 'Potassium, sodium, and easily usable energy for steady aerobic output.',
        alternatives: [
          {
            title: 'Sweet Orange with Handful of Raisins & 1 Egg',
            items: ['1 Large orange', 'Handful raisins', '1 Boiled egg'],
            explanation: 'Restores glycogen reserves quickly while protecting muscle tissue.'
          },
          {
            title: 'Chicken Clear Broth with Bread Croutons',
            items: ['1 Warm cup clear chicken soup', 'Handful toasted bread cubes'],
            explanation: 'Hydrating and mineral-replenishing.'
          }
        ]
      }
    }
  },

  // --------------------------------------------------------------------------
  // 3. LUNCH
  // --------------------------------------------------------------------------
  lunch: {
    Vegetarian: {
      'General Fitness': {
        title: '2 Whole Wheat Rotis, Thick Dal & Mixed Sabzi',
        items: ['2 Whole wheat rotis (chapatis)', '1 Big bowl thick yellow/mixed dal', '1 Bowl seasonal vegetable sabzi', 'Fresh cucumber-tomato salad'],
        explanation: 'Classic balanced Indian thali providing complex carbs, plant protein, dietary fiber, and essential micronutrients.',
        alternatives: [
          {
            title: 'Rajma (Kidney Beans) with Steamed Rice',
            items: ['1 Bowl rajma curry with mild spices', '1 Cup steamed rice (brown or white)', '1 Cup plain curd & onion salad'],
            explanation: 'Complete protein combination where lentils and grains complement each other’s amino acids.'
          },
          {
            title: 'Chole (Chickpea Curry) with 2 Rotis & Salad',
            items: ['1 Bowl spiced chickpea curry', '2 Whole wheat rotis', 'Generous bowl of green salad'],
            explanation: 'Rich in dietary fiber and resistant starch for healthy gut digestion and sustained energy.'
          }
        ]
      },
      'Weight Management': {
        title: '1–2 Rotis, Double Portion Dal & Green Salad',
        items: ['1–2 Whole wheat rotis (no butter)', 'Double bowl yellow or green moong dal', '1 Big plate cucumber, carrot & cabbage salad', '1 Cup fresh curd'],
        explanation: 'High volume, high fiber, and moderate carbohydrates to keep you full without an afternoon energy dip.',
        alternatives: [
          {
            title: 'Moong Dal Khichdi with Vegetable Raita',
            items: ['1 Bowl light moong dal and rice khichdi', '1 Bowl cucumber raita', 'Roasted papad'],
            explanation: 'Gentle, comforting meal that digests smoothly and eliminates bloating.'
          },
          {
            title: 'Paneer & Sautéed Vegetable Bowl with 1 Roti',
            items: ['80g Low-fat paneer cubes with bell peppers', '1 Whole wheat chapati', '1 Cup buttermilk'],
            explanation: 'Concentrated protein with colorful antioxidants and low total calories.'
          }
        ]
      },
      'Muscle Gain': {
        title: '3 Rotis, Paneer Bhurji & Thick Dal Tadka',
        items: ['3 Whole wheat rotis', '100g Fresh paneer bhurji (cottage cheese)', '1 Big bowl dal tadka', '1 Cup curd & salad'],
        explanation: 'Provides roughly 30g+ of quality vegetarian protein along with the carbs needed to support heavy muscle building.',
        alternatives: [
          {
            title: 'Soya Chunks Pulao with Spiced Curd',
            items: ['1 Big bowl rice cooked with 50g soya chunks & veggies', '1 Big bowl curd', 'Sliced onions & cucumber'],
            explanation: 'Budget protein king: soya chunks pack 52% protein by weight for rapid muscle recovery.'
          },
          {
            title: 'Chole with 3 Rotis & Paneer Slices',
            items: ['1 Bowl spiced chickpeas', '3 Rotis with light ghee', '50g Raw paneer slices', 'Salad'],
            explanation: 'Hearty mass builder with high mineral and caloric density.'
          }
        ]
      },
      'Strength': {
        title: '3 Rotis, Thick Dal, Paneer Curry & Curd',
        items: ['3 Whole wheat rotis with ghee', '1 Big bowl thick toor/chana dal', '75g Paneer curry', '1 Cup curd with rock salt'],
        explanation: 'High calorie and dense protein meal supporting heavy lifting, tendon recovery, and joint lubrication.',
        alternatives: [
          {
            title: 'Rajma Masala with Steamed Rice & Paneer Salad',
            items: ['1 Large bowl kidney beans', '1.5 Cups steamed rice', '60g Diced paneer in cucumber salad'],
            explanation: 'Timeless strength staple supplying magnesium, potassium, and amino acids.'
          },
          {
            title: 'Soya Chunk & Potato Curry with 3 Rotis',
            items: ['50g Soya chunks cooked with potatoes in curry', '3 Rotis', '1 Glass chaas'],
            explanation: 'High potassium and complete protein for dense power production.'
          }
        ]
      },
      'Endurance': {
        title: 'Steamed Rice, Yellow Dal, 1 Roti & Curd',
        items: ['1.5 Cups steamed rice', '1 Big bowl yellow moong dal', '1 Whole wheat roti', '1 Cup curd', 'Salad'],
        explanation: 'Easily digestible carbohydrates to restock depleted glycogen stores for endurance athletes.',
        alternatives: [
          {
            title: 'Vegetable Lentil Khichdi with Buttermilk',
            items: ['1 Large bowl khichdi cooked with ghee, peas & carrots', '1 Big glass buttermilk', 'Salad'],
            explanation: 'Comfort food offering rapid energy absorption with zero stomach distress.'
          },
          {
            title: 'Chole Rice Bowl with Cucumber Raita',
            items: ['1 Bowl chickpeas over 1.5 cups steamed rice', '1 Bowl cool cucumber raita'],
            explanation: 'Sustained energy release with steady hydration.'
          }
        ]
      }
    },
    Eggetarian: {
      'General Fitness': {
        title: 'Egg Curry (2 Eggs) with 2 Rotis & Rice',
        items: ['2 Boiled eggs in mild onion-tomato gravy', '2 Whole wheat rotis', 'Small cup steamed rice', 'Fresh green salad'],
        explanation: 'Super affordable, high-quality complete protein with carbohydrates for sustained afternoon productivity.',
        alternatives: [
          {
            title: 'Egg Bhurji (3 Eggs) with 2 Rotis & Salad',
            items: ['3 Scrambled eggs with onions & tomatoes', '2 Warm rotis', 'Cucumber-tomato salad'],
            explanation: 'Fast 10-minute cooking option requiring only one pan in a student kitchen.'
          },
          {
            title: 'Dal Rice with 2 Boiled Eggs on the Side',
            items: ['1 Bowl dal tadka over steamed rice', '2 Hard-boiled eggs with pepper', '1 Cup curd'],
            explanation: 'Comforting home staple boosted with high-biological-value egg protein.'
          }
        ]
      },
      'Weight Management': {
        title: '2 Boiled Eggs, Vegetable Dal & 1 Roti with Salad',
        items: ['2 Hard-boiled eggs (with lemon & salt)', '1 Big bowl vegetable dal', '1 Dry whole wheat roti', 'Large bowl sliced cucumbers & greens'],
        explanation: 'High volume meal with excellent satiety index, preventing mid-afternoon energy slumps or binge snacking.',
        alternatives: [
          {
            title: 'Egg White Scramble with Spinach & 1 Roti',
            items: ['3 Egg whites + 1 whole egg scrambled with spinach', '1 Whole wheat chapati', '1 Cup buttermilk'],
            explanation: 'Lean, micronutrient-dense meal with very low caloric footprint.'
          },
          {
            title: 'Boiled Egg & Sprout Salad Bowl',
            items: ['2 Boiled eggs sliced over sprouted moong & chana', 'Onions, tomatoes, lime & cumin', '1 Glass chaas'],
            explanation: 'No heavy carbs, high natural fiber and immediate fullness.'
          }
        ]
      },
      'Muscle Gain': {
        title: '3-Egg Curry with 3 Rotis, Dal & Curd',
        items: ['3 Boiled eggs in homestyle curry', '3 Whole wheat rotis', '1 Bowl thick dal', '1 Bowl fresh curd'],
        explanation: 'Packs roughly 28–32g protein with quality carbohydrates to sustain positive nitrogen balance.',
        alternatives: [
          {
            title: 'Double Egg Fried Rice with Paneer & Dal',
            items: ['Egg fried rice (3 eggs) with peas & carrots', '1 Bowl yellow dal', 'Fresh green salad'],
            explanation: 'Calorically dense, delicious, and easy to scale up for hardgainers.'
          },
          {
            title: 'Egg Bhurji Roll (3 Eggs) with Curd Bowl',
            items: ['3 Eggs scrambled rolled in 2 rotis', '1 Big bowl curd', 'Sliced onions & tomatoes'],
            explanation: 'Convenient to eat between study sessions or work shifts.'
          }
        ]
      },
      'Strength': {
        title: '3 Eggs in Curry, 3 Rotis, Dal & Buttermilk',
        items: ['3 Boiled eggs in rich curry gravy', '3 Rotis with ghee', '1 Bowl thick chana dal', '1 Glass spiced buttermilk'],
        explanation: 'High bio-availability protein paired with complex carbs and electrolytes for explosive training power.',
        alternatives: [
          {
            title: 'Egg & Rajma Rice Bowl',
            items: ['2 Boiled eggs sliced over rajma (kidney bean curry) & rice', '1 Cup curd', 'Salad'],
            explanation: 'Powerful combination of animal and legume proteins for dense muscle recovery.'
          },
          {
            title: '3-Egg Omelette with Dal & 2 Rotis',
            items: ['3 Egg vegetable omelette', '1 Bowl thick dal', '2 Rotis'],
            explanation: 'Classic lifter fuel with complete essential amino acid profile.'
          }
        ]
      },
      'Endurance': {
        title: '2 Boiled Eggs with Steamed Rice, Dal & Vegetables',
        items: ['2 Whole boiled eggs', '1.5 Cups steamed rice', '1 Bowl light yellow dal', 'Seasonal mixed vegetable sabzi', 'Salad'],
        explanation: 'High in easy-to-burn carbohydrates for glycogen synthesis, backed by whole-egg recovery nutrients.',
        alternatives: [
          {
            title: 'Egg & Vegetable Pulao with Curd',
            items: ['Basmati rice cooked with 2 boiled eggs & veggies', '1 Bowl cool cucumber raita'],
            explanation: 'Gentle on digestion, hydrating, and ideal after long aerobic workouts.'
          },
          {
            title: '2 Rotis, Egg Curry & Steamed Rice',
            items: ['2 Rotis', '1 Bowl egg curry (2 eggs)', '1/2 Cup rice', 'Salad'],
            explanation: 'Dual-carb source for prolonged metabolic endurance.'
          }
        ]
      }
    },
    'Non-Vegetarian': {
      'General Fitness': {
        title: 'Homestyle Chicken Curry (120g) with 2 Rotis & Rice',
        items: ['120g Skinless chicken breast/thigh curry', '2 Whole wheat rotis', 'Small portion steamed rice', 'Cucumber-onion salad'],
        explanation: 'Satisfying, complete animal protein source providing zinc, iron, and B12 for active metabolic health.',
        alternatives: [
          {
            title: 'Pan-Seared Fish Curry with Steamed Rice',
            items: ['120g Fish fillet in light tomato-curry gravy', '1.5 Cups steamed rice', 'Mixed vegetable sabzi'],
            explanation: 'Rich in omega-3 fatty acids for joint health and brain function.'
          },
          {
            title: 'Chicken Tikka / Stir-fry with 2 Rotis & Dal',
            items: ['100g Chicken stir-fried with capsicum & onion', '2 Rotis', '1 Bowl yellow dal'],
            explanation: 'Lean, high-protein alternative with high satisfaction.'
          }
        ]
      },
      'Weight Management': {
        title: 'Grilled or Boiled Chicken Breast (140g) & Green Salad',
        items: ['140g Spiced boiled or grilled chicken breast', '1 Dry whole wheat roti', 'Large bowl cabbage, cucumber & tomato salad', 'Clear vegetable broth'],
        explanation: 'High thermic effect of lean poultry burns calories during digestion while keeping you full for 4–5 hours.',
        alternatives: [
          {
            title: 'Steamed Fish Fillet with Lemon & Mixed Greens',
            items: ['140g Steamed fish with black pepper & lemon', 'Small portion brown/white rice', 'Cucumber salad'],
            explanation: 'Ultra-clean protein with minimal sodium and zero heavy cooking oils.'
          },
          {
            title: 'Chicken Soup with Boiled Eggs & 1 Roti',
            items: ['100g Shredded chicken in broth with carrots', '1 Boiled egg white', '1 Whole wheat roti'],
            explanation: 'Warm, filling and hydrating with low caloric density.'
          }
        ]
      },
      'Muscle Gain': {
        title: 'Chicken Curry (160g) with 3 Rotis, Rice & Dal',
        items: ['160g Chicken breast curry', '3 Whole wheat rotis', '1/2 Cup steamed rice', '1 Bowl dal', 'Green salad'],
        explanation: 'Heavy hitting 40g+ protein portion accompanied by ample clean carbs for rapid muscle repair and growth.',
        alternatives: [
          {
            title: 'Chicken & Egg Fried Rice (Homestyle)',
            items: ['150g Diced chicken + 2 eggs cooked with rice & peas', '1 Bowl plain curd', 'Salad'],
            explanation: 'All-in-one powerhouse lunch favored by athletes and bodybuilders.'
          },
          {
            title: 'Fish Curry with 3 Rotis & Spiced Curd',
            items: ['160g Fish in homestyle curry', '3 Rotis', '1 Bowl curd with cumin', 'Salad'],
            explanation: 'High bioavailability protein with anti-inflammatory omega-3 fatty acids.'
          }
        ]
      },
      'Strength': {
        title: 'Chicken or Mutton Curry (150g) with 3 Rotis & Dal',
        items: ['150g Lean meat curry with mild spices', '3 Whole wheat rotis with ghee', '1 Bowl thick dal', 'Sliced onions & lemon'],
        explanation: 'Rich in dietary creatine, iron, zinc, and leucine for maximal nervous system recovery and lifting power.',
        alternatives: [
          {
            title: 'Chicken Biryani (Homestyle) with Raita & Boiled Egg',
            items: ['1 Generous plate homestyle chicken biryani (150g chicken)', '1 Boiled egg', '1 Bowl onion raita'],
            explanation: 'Caloric density and complete proteins for heavy lifting phases.'
          },
          {
            title: 'Pan-Grilled Chicken Breast with Potatoes & 2 Rotis',
            items: ['150g Chicken breast', '1 Boiled potato with salt', '2 Rotis', 'Salad'],
            explanation: 'High potassium and clean proteins for muscle glycogen replenishment.'
          }
        ]
      },
      'Endurance': {
        title: 'Chicken Curry (120g) with 1.5 Cups Rice & Light Dal',
        items: ['120g Chicken in light tomato gravy', '1.5 Cups steamed rice', '1 Bowl yellow moong dal', 'Cucumber salad'],
        explanation: 'High carbohydrate proportion with easily digestible poultry protein for aerobic stamina and muscle rebuilding.',
        alternatives: [
          {
            title: 'Steamed Fish with Rice, Dal & Spinach',
            items: ['120g Fish fillet', '1.5 Cups rice', '1 Bowl dal with sauteed palak (spinach)'],
            explanation: 'Light on the digestive tract and quick to assimilate.'
          },
          {
            title: 'Chicken Noodle or Rice Soup with Vegetables',
            items: ['1 Large bowl clear chicken soup with noodles/rice & veggies', '1 Boiled egg on the side'],
            explanation: 'Provides essential sodium, fluids, and glycogen replenishment.'
          }
        ]
      }
    }
  },

  // --------------------------------------------------------------------------
  // 4. EVENING SNACK
  // --------------------------------------------------------------------------
  'evening-snack': {
    Vegetarian: {
      'General Fitness': {
        title: 'Roasted Chana & Makhana Mix with Tea or Coffee',
        items: ['Handful roasted black chana (30g)', '1 Cup roasted makhana (foxnuts)', '1 Cup hot chai or black coffee'],
        explanation: 'Zero-guilt hostel snack that satisfies evening crunch cravings without deep-fried samosas or biscuits.',
        alternatives: [
          {
            title: 'Peanut Butter Toast (1 Slice) & Green Tea',
            items: ['1 Slice whole wheat bread with 1 tbsp peanut butter', '1 Cup warm green tea'],
            explanation: 'Healthy fats and complex carbs that fuel your evening workout.'
          },
          {
            title: 'Sprouted Moong Chaat with Chopped Tomatoes',
            items: ['1 Bowl sprouted moong', 'Onion, tomato, green chili & lemon juice'],
            explanation: 'Fresh, crunchy plant protein with active digestive enzymes.'
          }
        ]
      },
      'Weight Management': {
        title: 'Roasted Makhana & Hot Green Tea',
        items: ['1 Bowl dry roasted makhana with pinch of salt', '1 Cup hot green tea or black coffee', '2 Glasses water'],
        explanation: 'Provides satisfying crunch with very low caloric density, preventing evening pantry raids.',
        alternatives: [
          {
            title: 'Cucumber & Carrot Sticks with Spiced Curd Dip',
            items: ['Fresh cucumber and carrot batons', '2 tbsp Plain curd mixed with chaat masala'],
            explanation: 'High water volume and fiber with gut-friendly probiotics.'
          },
          {
            title: 'Roasted Chana with Lemon Juice',
            items: ['25g Black chana with fresh lemon juice & pinch of rock salt'],
            explanation: 'Slow digesting resistant starch that keeps evening appetite under control.'
          }
        ]
      },
      'Muscle Gain': {
        title: 'Peanut Butter Banana Toast & 1 Glass Milk',
        items: ['2 Slices whole wheat bread with 2 tbsp peanut butter', '1 Sliced banana on top', '1 Glass warm milk'],
        explanation: 'Calorically dense pre-workout or post-workout fuel providing fast carbohydrates and sustained amino acids.',
        alternatives: [
          {
            title: 'Paneer Cubes (75g) with Chaat Masala & Almonds',
            items: ['75g Fresh paneer lightly tossed in pan', 'Handful roasted almonds', '1 Cup warm tea'],
            explanation: 'Rich in muscle-building dairy fats, casein protein, and zinc.'
          },
          {
            title: 'Soya Chunk Chaat with Onion & Lemon',
            items: ['40g Boiled soya chunks tossed with onions, tomato & spices', '1 Cup green tea'],
            explanation: 'Over 20g of rapid plant protein for minimal rupee investment.'
          }
        ]
      },
      'Strength': {
        title: 'Peanut Butter Toast with Walnuts & Milk',
        items: ['2 Slices whole wheat bread with peanut butter', '4 Walnut halves & 1 tbsp raisins', '1 Glass cow milk'],
        explanation: 'Dense, natural strength fuel providing essential amino acids, choline, and potassium.',
        alternatives: [
          {
            title: 'Sattu Drink (Roasted Gram Flour with Milk/Water)',
            items: ['3 tbsp Sattu flour in water with jaggery or salt', 'Handful of roasted peanuts'],
            explanation: 'Traditional powerhouse drink delivering lasting muscular stamina.'
          },
          {
            title: 'Paneer Sandwich with Mint Chutney',
            items: ['60g Grated paneer in 2 whole wheat bread slices', 'Mint-coriander chutney'],
            explanation: 'Delicious protein-packed strength snack ready in 4 minutes.'
          }
        ]
      },
      'Endurance': {
        title: '1 Banana, Handful of Raisins & Coconut Water',
        items: ['1 Ripe banana', '2 tbsp Golden raisins', 'Handful roasted peanuts', '1 Glass coconut water'],
        explanation: 'Restores electrolyte balance, potassium, and quickly mobilizes glycogen for endurance training.',
        alternatives: [
          {
            title: 'Whole Grain Toast with Honey & Sliced Apple',
            items: ['2 Slices toast with natural honey', '1 Sliced apple', '1 Cup green tea'],
            explanation: 'Dual carbohydrate sources for prolonged aerobic energy.'
          },
          {
            title: 'Sweet Dalia Bowl with Milk',
            items: ['Small bowl broken wheat cooked with milk & raisins'],
            explanation: 'Smooth digestion with clean energy.'
          }
        ]
      }
    },
    Eggetarian: {
      'General Fitness': {
        title: '2 Boiled Egg Whites & 1 Cup Chai/Coffee',
        items: ['2 Hard-boiled egg whites with black pepper', '1 Cup tea or coffee (light sugar)', 'Handful roasted chana'],
        explanation: 'Pure protein snack with gentle caffeine lift to recharge after long study hours or work calls.',
        alternatives: [
          {
            title: 'Egg Toast (1 Whole Egg on Whole Wheat Bread)',
            items: ['1 Whole egg sunny-side-up or boiled on 1 toast', 'Sliced tomatoes & pepper'],
            explanation: 'Quick 3-minute fuel with balanced choline and complex carbs.'
          },
          {
            title: 'Roasted Chana with Spiced Buttermilk',
            items: ['30g Roasted chickpeas', '1 Glass cold buttermilk with cumin'],
            explanation: 'Non-egg backup snack that cools digestion.'
          }
        ]
      },
      'Weight Management': {
        title: '2 Boiled Egg Whites with Lemon & Green Tea',
        items: ['2 Hard-boiled egg whites sprinkled with rock salt & lemon', '1 Cup hot green tea or black coffee'],
        explanation: 'Zero carbohydrate impact, high satiety snack that bridges the afternoon gap cleanly.',
        alternatives: [
          {
            title: 'Boiled Egg White Chaat with Cucumber',
            items: ['2 Egg whites diced with cucumber, onions & chaat masala'],
            explanation: 'Flavorful street-style crunch without junk oils.'
          },
          {
            title: 'Roasted Makhana with Black Coffee',
            items: ['1 Cup dry roasted foxnuts', 'Black coffee without sugar'],
            explanation: 'High alertness with minimal caloric load.'
          }
        ]
      },
      'Muscle Gain': {
        title: '2 Whole Boiled Eggs with 1 Peanut Butter Toast',
        items: ['2 Whole hard-boiled eggs', '1 Slice whole wheat bread with peanut butter', '1 Banana'],
        explanation: 'Provides roughly 18g protein and 350 clean calories to drive post-workout muscular adaptation.',
        alternatives: [
          {
            title: 'Double Egg Omelette Wrapped in Dry Chapati',
            items: ['2 Egg omelette with onions', '1 Warm whole wheat roti'],
            explanation: 'Portable hostel wrap packed with natural amino acids.'
          },
          {
            title: 'Boiled Eggs & Glass of Whole Milk',
            items: ['2 Boiled eggs', '1 Glass whole milk with 1 tsp honey'],
            explanation: 'Rapid recovery pairing offering both whey and casein proteins.'
          }
        ]
      },
      'Strength': {
        title: '2 Boiled Eggs, Roasted Peanuts & Banana',
        items: ['2 Hard-boiled eggs with black salt', 'Handful roasted peanuts (20g)', '1 Ripe banana'],
        explanation: 'High in leucine, potassium, and dense energy to prep your nervous system for heavy sets.',
        alternatives: [
          {
            title: 'Egg Bhurji Toast with 2 Eggs',
            items: ['2 Scrambled eggs on 2 slices of whole wheat bread', '1 Cup hot tea'],
            explanation: 'Delicious comfort snack providing complete amino acid coverage.'
          },
          {
            title: 'Boiled Eggs & Sattu Drink',
            items: ['2 Boiled egg whites', '1 Glass sattu drink with roasted cumin'],
            explanation: 'Maximum protein punch for zero preparation hassle.'
          }
        ]
      },
      'Endurance': {
        title: '1 Boiled Egg, 1 Banana & Glass of Water with Lemon',
        items: ['1 Whole boiled egg', '1 Large banana', '1 Glass water with lemon & pinch of salt'],
        explanation: 'Combines fast sugars with potassium and electrolytes to combat fatigue and cramps.',
        alternatives: [
          {
            title: 'Peanut Butter Toast with 1 Boiled Egg',
            items: ['1 Slice whole wheat toast with peanut butter', '1 Boiled egg', '1 Cup light tea'],
            explanation: 'Slow burning fats with complete protein.'
          },
          {
            title: 'Fresh Fruit Bowl with 2 Boiled Egg Whites',
            items: ['1 Bowl chopped seasonal fruit', '2 Boiled egg whites with salt'],
            explanation: 'Hydration and glycogen reloading.'
          }
        ]
      }
    },
    'Non-Vegetarian': {
      'General Fitness': {
        title: '2 Boiled Eggs & Roasted Chana with Tea',
        items: ['2 Hard-boiled eggs with pepper', 'Small handful roasted black chana', '1 Cup tea or coffee'],
        explanation: 'Accessible, non-perishable snack for hostel or office desks that keeps energy high.',
        alternatives: [
          {
            title: 'Shredded Chicken Breast Salad (70g)',
            items: ['70g Cold shredded chicken breast', 'Cucumber, mint, lime & black pepper'],
            explanation: 'Lean, light poultry snack that feels refreshing.'
          },
          {
            title: 'Peanut Butter Toast with Green Tea',
            items: ['1 Slice whole wheat bread with peanut butter', '1 Cup green tea'],
            explanation: 'Fast plant-based alternative when eggs are unavailable.'
          }
        ]
      },
      'Weight Management': {
        title: '2 Boiled Egg Whites & Hot Green Tea',
        items: ['2 Boiled egg whites with rock salt & black pepper', '1 Cup green tea or black coffee'],
        explanation: 'Clean, near-pure protein snack that preserves metabolic rate and suppresses evening hunger.',
        alternatives: [
          {
            title: 'Chicken Clear Broth with Lemon',
            items: ['1 Warm cup clear chicken broth with black pepper & lime'],
            explanation: 'Extremely satisfying, comforting, and virtually zero calories.'
          },
          {
            title: 'Roasted Makhana & Cucumber Slices',
            items: ['1 Bowl dry roasted foxnuts', 'Sliced cucumber with lemon'],
            explanation: 'Crunchy snack satisfying nervous desk fidgeting.'
          }
        ]
      },
      'Muscle Gain': {
        title: 'Chicken Breast Sandwich (100g) on Whole Wheat',
        items: ['100g Boiled shredded chicken breast', '2 Slices whole wheat bread with mint chutney', 'Cucumber & onion slices'],
        explanation: 'Mini-meal providing 25g+ of pure protein to keep muscle repair running continuously.',
        alternatives: [
          {
            title: '2 Boiled Eggs with Peanut Butter Banana Toast',
            items: ['2 Boiled eggs', '1 Slice toast with peanut butter & banana', '1 Glass milk'],
            explanation: 'High-calorie, nutrient-dense muscle-building snack.'
          },
          {
            title: 'Boiled Chicken Breast Bites with Roasted Peanuts',
            items: ['90g Boiled chicken cubes with chaat masala', 'Handful roasted peanuts'],
            explanation: 'Carb-controlled high protein and healthy fats.'
          }
        ]
      },
      'Strength': {
        title: '2 Boiled Eggs & Chicken Salad Wrap',
        items: ['2 Hard-boiled eggs', '70g Shredded chicken in 1 whole wheat roti wrap', '1 Glass water'],
        explanation: 'Rich in leucine, iron, and zinc for maximum muscular endurance and recovery.',
        alternatives: [
          {
            title: 'Chicken Keema on 1 Whole Wheat Toast',
            items: ['80g Minced chicken cooked dry with peas', '1 Slice toast', '1 Cup tea'],
            explanation: 'Warm, savory snack with complete amino acid profile.'
          },
          {
            title: 'Boiled Eggs with Almonds & Milk',
            items: ['2 Boiled eggs', '8 Soaked almonds', '1 Glass warm milk'],
            explanation: 'Classic lifter fuel with dual protein sources.'
          }
        ]
      },
      'Endurance': {
        title: '1 Boiled Egg, 1 Banana & Coconut Water',
        items: ['1 Whole boiled egg', '1 Ripe banana', '1 Glass fresh coconut water'],
        explanation: 'Fast-acting potassium and electrolytes for evening workouts or run sessions.',
        alternatives: [
          {
            title: 'Shredded Chicken with Boiled Potato',
            items: ['60g Boiled chicken', '1 Small boiled potato with salt & pepper'],
            explanation: 'Rapid glycogen restoration paired with muscle recovery protein.'
          },
          {
            title: 'Peanut Butter Toast with 1 Boiled Egg',
            items: ['1 Slice whole wheat bread with peanut butter', '1 Boiled egg'],
            explanation: 'Smooth energy release without digestive heaviness.'
          }
        ]
      }
    }
  },

  // --------------------------------------------------------------------------
  // 5. DINNER
  // --------------------------------------------------------------------------
  dinner: {
    Vegetarian: {
      'General Fitness': {
        title: '2 Whole Wheat Rotis, Paneer Curry & Yellow Dal',
        items: ['2 Whole wheat rotis (chapatis)', '75g Fresh paneer or tofu curry (mild spices)', '1 Bowl light yellow moong dal', 'Cucumber-tomato salad'],
        explanation: 'Wholesome dinner supplying slow-digesting casein protein and complex carbs to support overnight muscle recovery without feeling heavy.',
        alternatives: [
          {
            title: 'Moong Dal Khichdi with Curd & Roasted Papad',
            items: ['1 Big bowl warm moong dal khichdi cooked with cumin & ghee', '1 Cup fresh curd', 'Raw salad'],
            explanation: 'The ultimate comfort dinner: easy on the stomach, soothing for digestion, and sleep-friendly.'
          },
          {
            title: 'Soya Chunk Curry with 2 Rotis & Salad',
            items: ['40g Soya chunks cooked in homestyle gravy', '2 Whole wheat rotis', 'Fresh cucumber salad'],
            explanation: 'Very affordable plant protein dinner that leaves you satisfied until morning.'
          }
        ]
      },
      'Weight Management': {
        title: 'Warm Vegetable Lentil Soup with Sautéed Paneer',
        items: ['1 Big bowl thick vegetable lentil soup (moong/masoor)', '60g Pan-tossed paneer cubes with pepper', 'Large green salad with lemon'],
        explanation: 'Light, comforting evening meal that minimizes heavy carbohydrates before bed while supplying plenty of protein.',
        alternatives: [
          {
            title: '1 Roti with Double Sabzi & Thin Dal',
            items: ['1 Whole wheat roti (no ghee)', 'Double bowl seasonal vegetable sabzi (beans, cauliflower, or spinach)', '1 Bowl thin dal'],
            explanation: 'High fiber volume with low glycemic impact for steady sleep.'
          },
          {
            title: 'Grilled Paneer Salad with Roasted Cumin',
            items: ['80g Low-fat paneer slices tossed with capsicum & onions', '1 Bowl cucumber raita', 'Warm lemon water'],
            explanation: 'Low carb, rich in calcium and relaxing magnesium.'
          }
        ]
      },
      'Muscle Gain': {
        title: '3 Rotis, Paneer Bhurji (120g) & Thick Dal',
        items: ['3 Whole wheat rotis with light ghee', '120g Fresh paneer bhurji with onions & tomatoes', '1 Bowl thick dal', '1 Cup warm milk before bed'],
        explanation: 'Substantial protein and slow-digesting casein to sustain nocturnal muscle protein synthesis and prevent catabolism.',
        alternatives: [
          {
            title: 'Soya Chunks Curry with 3 Rotis & Curd',
            items: ['50g Soya chunks cooked in onion-tomato gravy', '3 Rotis', '1 Bowl curd', 'Salad'],
            explanation: 'Heavy plant protein load delivering over 32g of total protein.'
          },
          {
            title: 'Rajma or Chana with 2 Rotis & Paneer Salad',
            items: ['1 Big bowl spiced kidney beans or chickpeas', '2 Rotis', '50g Raw paneer slices', 'Salad'],
            explanation: 'Fiber-rich complete protein pairing supporting hormone production.'
          }
        ]
      },
      'Strength': {
        title: '3 Rotis, Dal, Paneer Curry & Warm Milk',
        items: ['3 Whole wheat rotis', '1 Bowl thick yellow or chana dal', '80g Paneer curry', '1 Glass warm milk with turmeric (haldi milk)'],
        explanation: 'Dense, anti-inflammatory dinner that heals connective tissue and supports restful restorative sleep.',
        alternatives: [
          {
            title: 'Soya Chunk & Vegetable Pulao with Raita',
            items: ['1 Bowl rice cooked with 50g soya chunks & carrots', '1 Big bowl cucumber raita', 'Salad'],
            explanation: 'Carb and protein combo that restores depleted muscular glycogen.'
          },
          {
            title: '2 Paneer Parathas with Curd & Salad',
            items: ['2 Whole wheat parathas stuffed with fresh paneer', '1 Bowl thick curd', 'Sliced tomatoes'],
            explanation: 'Traditional strength dinner packed with healthy fats and calcium.'
          }
        ]
      },
      'Endurance': {
        title: '2 Rotis, Steamed Rice, Yellow Dal & Mixed Sabzi',
        items: ['2 Whole wheat rotis', '1/2 Cup steamed rice', '1 Big bowl light yellow dal', 'Seasonal mixed vegetable sabzi', 'Salad'],
        explanation: 'Replenishes hepatic and muscular glycogen stores overnight so you wake up fully energized for morning training.',
        alternatives: [
          {
            title: 'Vegetable Dalia Khichdi with Curd',
            items: ['1 Big bowl broken wheat khichdi with vegetables', '1 Cup curd', 'Salad'],
            explanation: 'High B-vitamin and mineral profile for cellular repair.'
          },
          {
            title: 'Chole with 2 Rotis & Cucumber Salad',
            items: ['1 Bowl spiced chickpeas', '2 Rotis', '1 Bowl salad'],
            explanation: 'Steady complex carbohydrate energy release throughout the night.'
          }
        ]
      }
    },
    Eggetarian: {
      'General Fitness': {
        title: '2 Rotis with 2-Egg Bhurji & Light Dal',
        items: ['2 Whole wheat rotis', 'Egg bhurji (2 eggs scrambled with tomatoes & onions)', '1 Small bowl yellow dal', 'Cucumber salad'],
        explanation: 'Light, fast, highly bioavailable protein dinner easily cooked in under 10 minutes.',
        alternatives: [
          {
            title: 'Egg Curry (2 Eggs) with 2 Rotis & Rice',
            items: ['2 Boiled eggs in mild curry gravy', '2 Rotis or 1 cup steamed rice', 'Fresh green salad'],
            explanation: 'Comforting, balanced home dinner that supports deep recovery.'
          },
          {
            title: 'Moong Dal Khichdi with 2 Boiled Eggs',
            items: ['1 Bowl warm moong dal khichdi', '2 Hard-boiled eggs on the side with black salt'],
            explanation: 'Ultra-gentle on the stomach with complete amino acid coverage.'
          }
        ]
      },
      'Weight Management': {
        title: '3-Egg White Omelette with Spinach & Salad',
        items: ['3 Egg whites + 1 whole egg scrambled with spinach & mushrooms', '1 Dry whole wheat roti', 'Large bowl sliced cucumbers & tomatoes'],
        explanation: 'High protein volume that eliminates late-night cravings while keeping calories very low.',
        alternatives: [
          {
            title: '2 Boiled Eggs with Vegetable Dal Soup',
            items: ['2 Boiled eggs sliced with pepper', '1 Big bowl clear vegetable dal soup', 'Salad'],
            explanation: 'Warm, filling and satisfying without heavy carbohydrates.'
          },
          {
            title: 'Egg Bhurji (2 Eggs) with Steamed Cabbage & Onions',
            items: ['2 Eggs scrambled with generous shredded cabbage & peas', '1 Cup buttermilk'],
            explanation: 'High volume vegetable stir-fry that fills your plate cleanly.'
          }
        ]
      },
      'Muscle Gain': {
        title: '3-4 Eggs (Curry or Scrambled) with 3 Rotis & Dal',
        items: ['3 Whole eggs + 1 white cooked in homestyle gravy', '3 Whole wheat rotis', '1 Bowl thick dal', '1 Cup warm milk before bed'],
        explanation: 'Supplies 30g+ of complete protein and micronutrients like zinc and selenium for nocturnal growth hormone release.',
        alternatives: [
          {
            title: 'Egg & Paneer Bhurji Mix with 3 Rotis',
            items: ['2 Eggs + 60g Paneer scrambled together with onions', '3 Rotis', 'Salad'],
            explanation: 'Dual-source protein power providing both fast egg protein and slow-release casein.'
          },
          {
            title: 'Egg Fried Rice with Dal & Curd',
            items: ['3 Eggs scrambled into rice with peas & carrots', '1 Bowl dal', 'Salad'],
            explanation: 'Hearty calorie surplus fuel for intensive gym routines.'
          }
        ]
      },
      'Strength': {
        title: '3 Eggs in Curry, 3 Rotis, Dal & Turmeric Milk',
        items: ['3 Boiled eggs in spiced curry', '3 Rotis with ghee', '1 Bowl thick dal', '1 Glass warm milk with turmeric'],
        explanation: 'Healthy fats, high quality animal protein, and anti-inflammatory turmeric milk for joint recovery.',
        alternatives: [
          {
            title: '3-Egg Omelette with 2 Rotis & Thick Dal',
            items: ['3 Egg vegetable omelette', '2 Whole wheat rotis', '1 Bowl thick dal', 'Salad'],
            explanation: 'Quick and reliable lifter staple.'
          },
          {
            title: 'Egg Curry with Rajma & 2 Rotis',
            items: ['2 Boiled eggs', '1 Bowl rajma curry', '2 Rotis', 'Salad'],
            explanation: 'High mineral density supporting bone and muscle health.'
          }
        ]
      },
      'Endurance': {
        title: '2 Boiled Eggs with Steamed Rice, Dal & Vegetables',
        items: ['2 Whole boiled eggs', '1.5 Cups steamed rice', '1 Bowl yellow moong dal', 'Mixed vegetable sabzi', 'Salad'],
        explanation: 'Optimizes overnight glycogen restoration without overloading the digestive tract.',
        alternatives: [
          {
            title: 'Egg Khichdi with Curd',
            items: ['1 Big bowl moong dal khichdi with 2 boiled eggs chopped in', '1 Cup plain curd'],
            explanation: 'Easily assimilated nutrients that promote restorative sleep.'
          },
          {
            title: '2 Rotis with Egg Bhurji & Rice',
            items: ['2 Rotis', '2 Egg scramble', '1/2 Cup rice', 'Salad'],
            explanation: 'Balanced multi-source carbohydrate reloading.'
          }
        ]
      }
    },
    'Non-Vegetarian': {
      'General Fitness': {
        title: 'Homestyle Chicken Curry (130g) with 2 Rotis & Salad',
        items: ['130g Chicken breast or lean cuts in mild gravy', '2 Whole wheat rotis', '1 Bowl cucumber-onion salad', '1 Cup light dal or clear soup'],
        explanation: 'Wholesome dinner supplying complete proteins, iron, and zinc for daily muscular and immune recovery.',
        alternatives: [
          {
            title: 'Baked or Pan-Seared Fish with 2 Rotis & Salad',
            items: ['130g Fish fillet with lemon & black pepper', '2 Whole wheat rotis', 'Steamed green beans or salad'],
            explanation: 'Light, fast digesting protein with anti-inflammatory omega-3 fatty acids.'
          },
          {
            title: 'Chicken Keema with Peas & 2 Rotis',
            items: ['120g Minced chicken cooked with peas & tomatoes', '2 Rotis', 'Salad'],
            explanation: 'Delicious, lean poultry dinner that takes 15 minutes to prepare.'
          }
        ]
      },
      'Weight Management': {
        title: 'Grilled Chicken Breast (150g) with Steamed Vegetables',
        items: ['150g Chicken breast with mild herbs & black pepper', '1 Bowl steamed green beans, carrots & broccoli', 'Clear chicken soup with lemon'],
        explanation: 'Very high protein density that accelerates overnight repair without excess carbohydrates.',
        alternatives: [
          {
            title: 'Pan-Seared White Fish with Lemon & Green Salad',
            items: ['150g White fish fillet with lemon pepper', 'Large plate cucumber, mint & tomato salad', 'Warm lemon water'],
            explanation: 'Extremely clean, zero-bloat dinner supporting healthy fat metabolism.'
          },
          {
            title: 'Chicken Soup with Boiled Vegetables & 1 Roti',
            items: ['120g Shredded chicken in rich clear broth', '1 Dry whole wheat chapati', 'Salad'],
            explanation: 'Warm, satisfying, and very low in caloric density.'
          }
        ]
      },
      'Muscle Gain': {
        title: 'Chicken Breast Curry (160g) with 3 Rotis & Dal',
        items: ['160g Chicken breast in curry gravy', '3 Whole wheat rotis', '1 Bowl thick dal', '1 Glass warm milk before bed'],
        explanation: 'Provides roughly 42g of complete protein to fuel peak muscle protein synthesis overnight.',
        alternatives: [
          {
            title: 'Chicken & Egg Fried Rice (Homestyle)',
            items: ['150g Diced chicken + 1 egg cooked with 1.5 cups rice', '1 Bowl curd', 'Salad'],
            explanation: 'Calorie-rich recovery feast for intense training blocks.'
          },
          {
            title: 'Fish Curry with 3 Rotis & Spiced Curd',
            items: ['160g Fish in homestyle curry', '3 Rotis', '1 Bowl curd with cumin', 'Salad'],
            explanation: 'Rich in healthy fats, vitamin D, and essential amino acids.'
          }
        ]
      },
      'Strength': {
        title: 'Chicken or Mutton Curry (160g) with 3 Rotis & Haldi Milk',
        items: ['160g Meat curry with onions & tomatoes', '3 Whole wheat rotis with ghee', '1 Bowl dal', '1 Glass warm turmeric milk'],
        explanation: 'Supplies natural creatine, carnosine, heme iron, and leucine for heavy strength lifters.',
        alternatives: [
          {
            title: 'Pan-Grilled Chicken with Mashed Potatoes & 2 Rotis',
            items: ['160g Chicken breast', '1 Mashed potato with black pepper', '2 Rotis', 'Salad'],
            explanation: 'Old-school strength lifter dinner delivering potassium and clean glycogen.'
          },
          {
            title: 'Chicken Biryani (Homestyle) with 2 Boiled Eggs',
            items: ['1 Plate homestyle chicken biryani', '2 Boiled eggs', '1 Bowl cucumber raita'],
            explanation: 'High calorie mass builder supporting strenuous lifting cycles.'
          }
        ]
      },
      'Endurance': {
        title: 'Chicken Curry (120g) with 1.5 Cups Rice & Light Dal',
        items: ['120g Chicken in light tomato gravy', '1.5 Cups steamed rice', '1 Bowl yellow moong dal', 'Cucumber salad'],
        explanation: 'Restocks muscular and liver glycogen with high-carb intake while chicken protein rebuilds damaged muscle fibers.',
        alternatives: [
          {
            title: 'Steamed Fish with Rice, Dal & Spinach',
            items: ['120g Fish fillet', '1.5 Cups rice', '1 Bowl dal with sauteed palak (spinach)'],
            explanation: 'Smooth digestion with minimal digestive fatigue before sleep.'
          },
          {
            title: 'Chicken Noodle Soup with Vegetables & Bread',
            items: ['1 Big bowl chicken soup with noodles & veggies', '2 Slices whole wheat bread'],
            explanation: 'Hydrating, electrolyte replenishing, and soothing.'
          }
        ]
      }
    }
  }
};

/**
 * Initializes the Diet Planner on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initDietPlanner();
});

/**
 * Reads user demographic preferences and binds selector events
 */
function initDietPlanner() {
  // Read saved profile data if available
  let profileFound = false;
  try {
    const rawData = sessionStorage.getItem('fitbuddy_demo_profile_data');
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (parsed.dietPreference && ['Vegetarian', 'Eggetarian', 'Non-Vegetarian'].includes(parsed.dietPreference)) {
        activeDietPreference = parsed.dietPreference;
        profileFound = true;
      }
      if (parsed.fitnessGoal && ['General Fitness', 'Weight Management', 'Muscle Gain', 'Strength', 'Endurance'].includes(parsed.fitnessGoal)) {
        activeFitnessGoal = parsed.fitnessGoal;
        profileFound = true;
      }
    }
  } catch (err) {
    console.warn('Could not read user profile from sessionStorage:', err);
  }

  // Update profile notice if found
  const syncNotice = document.getElementById('dietProfileSyncNotice');
  if (syncNotice) {
    if (profileFound) {
      syncNotice.innerHTML = `✓ Loaded from your FitBuddy Profile: <strong>${activeDietPreference}</strong> • <strong>${activeFitnessGoal}</strong>`;
    } else {
      syncNotice.innerHTML = `Personalized for: <strong>${activeDietPreference}</strong> • <strong>${activeFitnessGoal}</strong> (Default settings)`;
    }
  }

  // Bind Selector Buttons
  bindDietSelectors();

  // Initial render of meal cards
  renderMealCards();
}

/**
 * Binds click events to Diet Preference and Fitness Goal buttons
 */
function bindDietSelectors() {
  const dietChips = document.querySelectorAll('.diet-pref-chip');
  dietChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const selected = chip.getAttribute('data-pref');
      if (selected && selected !== activeDietPreference) {
        activeDietPreference = selected;
        // Reset meal swap indices to show primary meals
        mealSwapIndices = [0, 0, 0, 0, 0];
        updateSelectorActiveStates();
        renderMealCards();
        updateProfileNotice();
        if (typeof showToast === 'function') {
          showToast(`Diet preference updated: ${selected}`, 'info');
        }
      }
    });
  });

  const goalChips = document.querySelectorAll('.fitness-goal-chip');
  goalChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const selected = chip.getAttribute('data-goal');
      if (selected && selected !== activeFitnessGoal) {
        activeFitnessGoal = selected;
        // Reset meal swap indices to show primary meals
        mealSwapIndices = [0, 0, 0, 0, 0];
        updateSelectorActiveStates();
        renderMealCards();
        updateProfileNotice();
        if (typeof showToast === 'function') {
          showToast(`Fitness goal updated: ${selected}`, 'info');
        }
      }
    });
  });

  updateSelectorActiveStates();
}

/**
 * Updates CSS active classes on selector chips
 */
function updateSelectorActiveStates() {
  document.querySelectorAll('.diet-pref-chip').forEach(chip => {
    const val = chip.getAttribute('data-pref');
    chip.classList.toggle('active', val === activeDietPreference);
    chip.setAttribute('aria-pressed', val === activeDietPreference ? 'true' : 'false');
  });

  document.querySelectorAll('.fitness-goal-chip').forEach(chip => {
    const val = chip.getAttribute('data-goal');
    chip.classList.toggle('active', val === activeFitnessGoal);
    chip.setAttribute('aria-pressed', val === activeFitnessGoal ? 'true' : 'false');
  });
}

/**
 * Updates the summary bar indicating the active combination
 */
function updateProfileNotice() {
  const syncNotice = document.getElementById('dietProfileSyncNotice');
  if (syncNotice) {
    syncNotice.innerHTML = `Active Plan: <strong>${activeDietPreference}</strong> • <strong>${activeFitnessGoal}</strong> (5 Meals Custom-Tailored)`;
  }
}

/**
 * Swaps to the next available alternative meal option for a given meal category index
 * @param {number} mealIndex (0 to 4)
 */
function swapMealOption(mealIndex) {
  if (mealIndex < 0 || mealIndex >= MEAL_CATEGORIES.length) return;

  const currentOption = mealSwapIndices[mealIndex] || 0;
  // Cycle between 0 (Primary), 1 (Alt 1), 2 (Alt 2)
  const nextOption = (currentOption + 1) % 3;
  mealSwapIndices[mealIndex] = nextOption;

  // Re-render meal cards
  renderMealCards();

  const categoryName = MEAL_CATEGORIES[mealIndex].name;
  const label = nextOption === 0 ? 'Primary Suggestion' : `Alternative Option ${nextOption}`;

  if (typeof showToast === 'function') {
    showToast(`Swapped ${categoryName} to: ${label}`, 'success');
  }
}

/**
 * Retrieves the meal data based on category, preference, goal, and active swap index
 * @param {string} categoryId 
 * @param {string} preference 
 * @param {string} goal 
 * @param {number} optionIndex 
 * @returns {object}
 */
function getActiveMealData(categoryId, preference, goal, optionIndex = 0) {
  const categoryData = DIET_DATABASE[categoryId] || DIET_DATABASE.breakfast;
  const prefData = categoryData[preference] || categoryData.Vegetarian;
  const goalData = prefData[goal] || prefData['General Fitness'];

  if (optionIndex === 0) {
    return {
      title: goalData.title,
      items: goalData.items,
      explanation: goalData.explanation,
      optionLabel: 'Primary Suggestion (Option 1 of 3)',
      isSwapped: false
    };
  }

  // Get Alternative
  const alts = goalData.alternatives || [];
  const altIndex = optionIndex - 1;
  const chosenAlt = alts[altIndex] || alts[0] || {
    title: goalData.title,
    items: goalData.items,
    explanation: goalData.explanation
  };

  return {
    title: chosenAlt.title,
    items: chosenAlt.items,
    explanation: chosenAlt.explanation,
    optionLabel: `Alternative Swap (Option ${optionIndex + 1} of 3)`,
    isSwapped: true
  };
}

/**
 * Renders all 5 Meal Cards into the DOM
 */
function renderMealCards() {
  const container = document.getElementById('dietMealCardsContainer');
  if (!container) return;

  container.innerHTML = '';

  MEAL_CATEGORIES.forEach((cat, index) => {
    const optionIdx = mealSwapIndices[index] || 0;
    const meal = getActiveMealData(cat.id, activeDietPreference, activeFitnessGoal, optionIdx);
    const iconSvg = MEAL_ICONS[cat.id] || MEAL_ICONS.breakfast;

    const card = document.createElement('article');
    card.className = 'meal-card';
    card.setAttribute('aria-labelledby', `meal-title-${index}`);

    card.innerHTML = `
      <div class="meal-card-header">
        <div style="flex: 1; min-width: 0;">
          <div class="meal-card-meta">
            <span class="badge badge-primary">${cat.badge}</span>
            <span class="meal-timing">🕒 ${cat.timing}</span>
          </div>
          <h2 class="meal-card-title" id="meal-title-${index}">${meal.title}</h2>
        </div>
        <div class="meal-icon-box" title="${cat.name} Icon">
          ${iconSvg}
        </div>
      </div>

      <!-- Food Items List -->
      <div class="meal-items-list" aria-label="Suggested food items">
        ${meal.items.map(item => `<span class="meal-item-tag">${item}</span>`).join('')}
      </div>

      <!-- Nutrition Benefit Explanation -->
      <div class="meal-explanation-box">
        <strong>💡 Why this works for ${activeFitnessGoal}:</strong>
        <p style="margin: 4px 0 0 0;">${meal.explanation}</p>
      </div>

      <!-- Card Footer with Meal Swap Button -->
      <div class="meal-card-footer">
        <div class="meal-option-badge">
          ${meal.optionLabel}
        </div>
        <button type="button" class="btn btn-outline btn-sm meal-swap-btn" onclick="swapMealOption(${index})" title="Cycle through budget-friendly alternative meals">
          🔄 Swap Meal Option
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Global exposure
window.swapMealOption = swapMealOption;
window.initDietPlanner = initDietPlanner;
