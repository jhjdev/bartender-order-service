import { client, connectDB } from '../config/db';
import { Drink, DrinkCategory, CocktailRecipe } from '../types/drink';

/**
 * Seed script to populate MongoDB with drink data.
 * This script is idempotent and can be run multiple times without creating duplicates.
 */

// Collection references
const db = client.db();
const drinksCollection = db.collection('drinks');
const cocktailsCollection = db.collection('cocktails');

/**
 * Sample drink data
 */
const draftBeers: Omit<Drink, '_id'>[] = [
  {
    name: 'Pilsner Urquell',
    category: DrinkCategory.BEER,
    price: 8.5,
    description:
      "The world's first golden pilsner beer with a crisp, refreshing taste.",
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757',
      source: 'unsplash',
      unsplashId: 'photo-1600788886242-5c96aabe3757',
    },
  },
  {
    name: 'Guinness Draught',
    category: DrinkCategory.BEER,
    price: 9.0,
    description: 'A rich, creamy stout with a smooth, balanced flavor.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1577274831680-117ca707090b',
      source: 'unsplash',
      unsplashId: 'photo-1577274831680-117ca707090b',
    },
  },
  {
    name: 'Sierra Nevada Pale Ale',
    category: DrinkCategory.BEER,
    price: 8.5,
    description:
      'A classic American pale ale with cascade hops and a pine-citrus flavor profile.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1587582345426-bf07d378b91e',
      source: 'unsplash',
      unsplashId: 'photo-1587582345426-bf07d378b91e',
    },
  },
];

const bottledBeers: Omit<Drink, '_id'>[] = [
  {
    name: 'Corona Extra',
    category: DrinkCategory.BEER,
    price: 7.0,
    description:
      'A light, crisp lager with a refreshing taste, traditionally served with a lime wedge.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1570452130098-9b3fb0d5cbe6',
      source: 'unsplash',
      unsplashId: 'photo-1570452130098-9b3fb0d5cbe6',
    },
  },
  {
    name: 'Heineken',
    category: DrinkCategory.BEER,
    price: 7.5,
    description:
      'A pale lager beer with a mildly bitter taste and a balanced hop aroma.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1600213903598-25be92afb531',
      source: 'unsplash',
      unsplashId: 'photo-1600213903598-25be92afb531',
    },
  },
  {
    name: 'Duvel',
    category: DrinkCategory.BEER,
    price: 9.5,
    description:
      'A strong golden ale with a pronounced hop character and fruity, dry flavor.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1567696911980-2c492aca28ec',
      source: 'unsplash',
      unsplashId: 'photo-1567696911980-2c492aca28ec',
    },
  },
];

const wines: Omit<Drink, '_id'>[] = [
  {
    name: 'Cabernet Sauvignon',
    category: DrinkCategory.WINE,
    price: 12.0,
    description:
      'A full-bodied red wine with rich flavors of blackcurrant, cedar, and spice.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      source: 'unsplash',
      unsplashId: 'photo-1510812431401-41d2bd2722f3',
    },
  },
  {
    name: 'Chardonnay',
    category: DrinkCategory.WINE,
    price: 11.0,
    description:
      'A crisp, medium to full-bodied white wine with notes of apple, pear, and vanilla.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1590065645517-e0f3ba7f2173',
      source: 'unsplash',
      unsplashId: 'photo-1590065645517-e0f3ba7f2173',
    },
  },
  {
    name: 'Provence Rosé',
    category: DrinkCategory.WINE,
    price: 10.5,
    description:
      'A light and refreshing rosé with delicate notes of strawberry, melon, and citrus.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1558901591-9cb536f33ff7',
      source: 'unsplash',
      unsplashId: 'photo-1558901591-9cb536f33ff7',
    },
  },
];

const spirits: Omit<Drink, '_id'>[] = [
  {
    name: 'Macallan 12',
    category: DrinkCategory.SPIRIT,
    price: 15.0,
    description:
      'A single malt Scotch whisky with rich notes of dried fruit, wood spice, and vanilla.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1565895405127-481853366cf8',
      source: 'unsplash',
      unsplashId: 'photo-1565895405127-481853366cf8',
    },
  },
  {
    name: 'Grey Goose Vodka',
    category: DrinkCategory.SPIRIT,
    price: 13.0,
    description:
      'Premium French vodka made from high-quality winter wheat, offering a smooth, clean taste.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb',
      source: 'unsplash',
      unsplashId: 'photo-1614313511387-1436a4480ebb',
    },
  },
  {
    name: "Hendrick's Gin",
    category: DrinkCategory.SPIRIT,
    price: 14.0,
    description:
      'A Scottish gin infused with cucumber and rose petals for a uniquely floral flavor.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1609935935969-faf7deb2a1b4',
      source: 'unsplash',
      unsplashId: 'photo-1609935935969-faf7deb2a1b4',
    },
  },
];

const nonAlcoholic: Omit<Drink, '_id'>[] = [
  {
    name: 'Virgin Mojito',
    category: DrinkCategory.NON_ALCOHOLIC,
    price: 6.0,
    description:
      'A refreshing mix of lime, mint, sugar, and soda water. All the flavor without the alcohol.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1588590560438-5e27fe3f6b71',
      source: 'unsplash',
      unsplashId: 'photo-1588590560438-5e27fe3f6b71',
    },
  },
  {
    name: 'Sparkling Water',
    category: DrinkCategory.NON_ALCOHOLIC,
    price: 3.5,
    description:
      'Refreshing, effervescent water with natural minerals. Served with a slice of lemon.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1629203432180-71e9b18d33f3',
      source: 'unsplash',
      unsplashId: 'photo-1629203432180-71e9b18d33f3',
    },
  },
  {
    name: 'Fresh Orange Juice',
    category: DrinkCategory.NON_ALCOHOLIC,
    price: 5.0,
    description:
      'Freshly squeezed orange juice, full of vitamin C and natural sweetness.',
    isAvailable: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1526424382096-74a93e105682',
      source: 'unsplash',
      unsplashId: 'photo-1526424382096-74a93e105682',
    },
  },
];

/**
 * Sample cocktail recipes
 */
const cocktails: Omit<CocktailRecipe, '_id'>[] = [
  {
    name: 'Classic Martini',
    category: DrinkCategory.COCKTAIL,
    price: 13.0,
    description:
      'A timeless cocktail of gin and dry vermouth, garnished with an olive or lemon twist.',
    isAvailable: true,
    ingredients: [
      { name: 'Gin', amount: '60', unit: 'ml' },
      { name: 'Dry Vermouth', amount: '15', unit: 'ml' },
      { name: 'Lemon Twist or Olive', amount: '1', unit: 'piece' },
    ],
    instructions: [
      'Fill a mixing glass with ice',
      'Add gin and vermouth',
      'Stir well until chilled',
      'Strain into a chilled martini glass',
      'Garnish with a lemon twist or olive',
    ],
    glassType: 'Martini glass',
    garnish: 'Lemon twist or olive',
    preparationTime: 3,
    isInMenu: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1582056509381-33c1ce621b05',
      source: 'unsplash',
      unsplashId: 'photo-1582056509381-33c1ce621b05',
    },
  },
  {
    name: 'Old Fashioned',
    category: DrinkCategory.COCKTAIL,
    price: 14.0,
    description:
      'A sophisticated blend of bourbon, sugar, and bitters, served over ice with an orange twist.',
    isAvailable: true,
    ingredients: [
      { name: 'Bourbon', amount: '60', unit: 'ml' },
      { name: 'Sugar Cube', amount: '1', unit: 'piece' },
      { name: 'Angostura Bitters', amount: '2-3', unit: 'dashes' },
      { name: 'Water', amount: '1', unit: 'splash' },
    ],
    instructions: [
      'Place sugar cube in an old-fashioned glass',
      'Add bitters and a splash of water',
      'Muddle until sugar is dissolved',
      'Add ice cubes and bourbon',
      'Stir gently',
      'Garnish with orange peel',
    ],
    glassType: 'Old-fashioned glass',
    garnish: 'Orange peel',
    preparationTime: 4,
    isInMenu: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef',
      source: 'unsplash',
      unsplashId: 'photo-1598373182133-52452f7691ef',
    },
  },
  {
    name: 'Mojito',
    category: DrinkCategory.COCKTAIL,
    price: 12.0,
    description:
      'A refreshing Cuban classic with white rum, lime, mint, sugar, and soda water.',
    isAvailable: true,
    ingredients: [
      { name: 'White Rum', amount: '60', unit: 'ml' },
      { name: 'Fresh Lime Juice', amount: '30', unit: 'ml' },
      { name: 'Sugar', amount: '2', unit: 'tsp' },
      { name: 'Fresh Mint Leaves', amount: '8-10', unit: 'leaves' },
      { name: 'Soda Water', amount: '60', unit: 'ml' },
      { name: 'Crushed Ice', amount: '1', unit: 'cup' },
    ],
    instructions: [
      'Muddle mint leaves with sugar and lime juice in a highball glass',
      'Add crushed ice and rum',
      'Stir well until the glass becomes frosty',
      'Top with soda water',
      'Garnish with a sprig of mint and a lime wedge',
    ],
    glassType: 'Highball glass',
    garnish: 'Mint sprig and lime wedge',
    preparationTime: 5,
    isInMenu: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a',
      source: 'unsplash',
      unsplashId: 'photo-1551538827-9c037cb4f32a',
    },
  },
  {
    name: 'Cosmopolitan',
    category: DrinkCategory.COCKTAIL,
    price: 12.5,
    description:
      'A sophisticated, pink-hued cocktail made with vodka, triple sec, cranberry, and lime juice.',
    isAvailable: true,
    ingredients: [
      { name: 'Vodka', amount: '45', unit: 'ml' },
      { name: 'Triple Sec', amount: '15', unit: 'ml' },
      { name: 'Cranberry Juice', amount: '30', unit: 'ml' },
      { name: 'Fresh Lime Juice', amount: '15', unit: 'ml' },
    ],
    instructions: [
      'Add all ingredients into a cocktail shaker with ice',
      'Shake well until chilled',
      'Strain into a chilled martini glass',
      'Garnish with an orange peel or lime wheel',
    ],
    glassType: 'Martini glass',
    garnish: 'Orange peel or lime wheel',
    preparationTime: 3,
    isInMenu: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1605270012917-bf357a1fde8b',
      source: 'unsplash',
      unsplashId: 'photo-1605270012917-bf357a1fde8b',
    },
  },
  {
    name: 'Margarita',
    category: DrinkCategory.COCKTAIL,
    price: 11.5,
    description:
      'A classic tequila cocktail with triple sec and fresh lime juice, served with a salt rim.',
    isAvailable: true,
    ingredients: [
      { name: 'Tequila', amount: '50', unit: 'ml' },
      { name: 'Triple Sec', amount: '20', unit: 'ml' },
      { name: 'Fresh Lime Juice', amount: '25', unit: 'ml' },
      { name: 'Salt', amount: '1', unit: 'pinch' },
      { name: 'Ice', amount: '1', unit: 'cup' },
    ],
    instructions: [
      'Rub the rim of a glass with lime and dip in salt',
      'Add tequila, triple sec, and lime juice into a shaker with ice',
      'Shake vigorously until chilled',
      'Strain into the prepared glass over fresh ice',
      'Garnish with a lime wheel',
    ],
    glassType: 'Margarita glass',
    garnish: 'Salt rim and lime wheel',
    preparationTime: 4,
    isInMenu: true,
    imageData: {
      url: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85',
      source: 'unsplash',
      unsplashId: 'photo-1556855810-ac404aa91e85',
    },
  },
];

/**
 * The main seeding function
 * This function connects to the database, clears existing data, and inserts new data
 */
async function seedDrinks(): Promise<void> {
  try {
    console.log('Starting database seeding process...');

    // Connect to the database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data (only if collections already exist)
    const collections = await client.db().listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (collectionNames.includes('drinks')) {
      console.log('Clearing existing drinks collection...');
      await drinksCollection.deleteMany({});
    }

    if (collectionNames.includes('cocktails')) {
      console.log('Clearing existing cocktails collection...');
      await cocktailsCollection.deleteMany({});
    }

    // Insert drinks by category
    console.log('Inserting drinks data...');

    // Combine all drinks into one array for bulk insert
    const allDrinks = [
      ...draftBeers,
      ...bottledBeers,
      ...wines,
      ...spirits,
      ...nonAlcoholic,
    ];

    // Insert all drinks
    if (allDrinks.length > 0) {
      const drinkResult = await drinksCollection.insertMany(allDrinks);
      console.log(`Successfully inserted ${drinkResult.insertedCount} drinks`);
    }

    // Insert cocktail recipes
    if (cocktails.length > 0) {
      const cocktailResult = await cocktailsCollection.insertMany(cocktails);
      console.log(
        `Successfully inserted ${cocktailResult.insertedCount} cocktail recipes`
      );
    }

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close the database connection
    try {
      await client.close();
      console.log('Database connection closed');
    } catch (closeError) {
      console.error('Error closing database connection:', closeError);
    }
  }
}

// Run the seeding function
seedDrinks()
  .then(() => {
    console.log('Seeding script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding script failed:', error);
    process.exit(1);
  });
