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
const imagesCollection = db.collection('images');

/**
 * Helper to build a map of image name (without extension) to image document
 */
async function getImageMap() {
  const images = await imagesCollection.find({}).toArray();
  const map = new Map();
  for (const img of images) {
    // Map both the base name and the full name (without extension)
    const baseName = img.name.split('-')[0];
    const fullName = img.name.replace(/\.[^/.]+$/, '');
    map.set(baseName, img);
    map.set(fullName, img);
  }
  return map;
}

async function seedDrinks(): Promise<void> {
  try {
    console.log('Starting database seeding process...');
    await connectDB();
    console.log('Connected to MongoDB');

    // Build image map
    const imageMap = await getImageMap();

    // Clear existing data
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

    // Helper to get imageData for a given key, or a related image if not found
    const getImageData = (key: string, fallbackKey?: string) => {
      let img = imageMap.get(key);
      if (!img && fallbackKey) {
        img = imageMap.get(fallbackKey);
        if (img) {
          console.warn(
            `Image not found for key: ${key}, using related image: ${fallbackKey}`
          );
        }
      }
      if (!img) {
        console.warn(
          `Image not found for key: ${key} and no related image found.`
        );
        return undefined;
      }
      return {
        _id: img._id.toString(),
        url: `/api/images/${img._id}`,
        name: img.name,
      };
    };

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
        imageData: getImageData('pilsner_urquell', 'heineken'),
      },
      {
        name: 'Guinness Draught',
        category: DrinkCategory.BEER,
        price: 9.0,
        description: 'A rich, creamy stout with a smooth, balanced flavor.',
        isAvailable: true,
        imageData: getImageData('guinness_draught', 'duvel'),
      },
      {
        name: 'Sierra Nevada Pale Ale',
        category: DrinkCategory.BEER,
        price: 8.5,
        description:
          'A classic American pale ale with cascade hops and a pine-citrus flavor profile.',
        isAvailable: true,
        imageData: getImageData('sierra_nevada_pale_ale', 'duvel'),
      },
      {
        name: 'Stella Artois',
        category: DrinkCategory.BEER,
        price: 8.0,
        description: 'A premium Belgian lager with a crisp, refreshing taste.',
        isAvailable: true,
        imageData: getImageData('heineken', 'pilsner_urquell'),
      },
      {
        name: 'Blue Moon',
        category: DrinkCategory.BEER,
        price: 8.5,
        description:
          'A Belgian-style wheat ale brewed with orange peel for a subtle sweetness.',
        isAvailable: true,
        imageData: getImageData('duvel', 'heineken'),
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
        imageData: getImageData('corona_extra', 'heineken'),
      },
      {
        name: 'Heineken',
        category: DrinkCategory.BEER,
        price: 7.5,
        description:
          'A pale lager beer with a mildly bitter taste and a balanced hop aroma.',
        isAvailable: true,
        imageData: getImageData('heineken', 'pilsner_urquell'),
      },
      {
        name: 'Duvel',
        category: DrinkCategory.BEER,
        price: 9.5,
        description:
          'A strong golden ale with a pronounced hop character and fruity, dry flavor.',
        isAvailable: true,
        imageData: getImageData('duvel', 'heineken'),
      },
      {
        name: 'Chimay Blue',
        category: DrinkCategory.BEER,
        price: 10.0,
        description:
          'A dark, strong Belgian ale with rich flavors of dark fruit and spice.',
        isAvailable: true,
        imageData: getImageData('guinness_draught', 'duvel'),
      },
      {
        name: 'Leffe Blonde',
        category: DrinkCategory.BEER,
        price: 8.5,
        description:
          'A smooth, fruity Belgian abbey beer with a hint of vanilla.',
        isAvailable: true,
        imageData: getImageData('pilsner_urquell', 'heineken'),
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
        imageData: getImageData('cabernet_sauvignon', 'chardonnay'),
      },
      {
        name: 'Chardonnay',
        category: DrinkCategory.WINE,
        price: 11.0,
        description:
          'A crisp, medium to full-bodied white wine with notes of apple, pear, and vanilla.',
        isAvailable: true,
        imageData: getImageData('chardonnay', 'cabernet_sauvignon'),
      },
      {
        name: 'Provence Rosé',
        category: DrinkCategory.WINE,
        price: 10.5,
        description:
          'A light and refreshing rosé with delicate notes of strawberry, melon, and citrus.',
        isAvailable: true,
        imageData: getImageData('provence_ros_', 'chardonnay'),
      },
      {
        name: 'Pinot Noir',
        category: DrinkCategory.WINE,
        price: 13.0,
        description:
          'A light-bodied red wine with flavors of cherry, raspberry, and earthy notes.',
        isAvailable: true,
        imageData: getImageData('cabernet_sauvignon', 'chardonnay'),
      },
      {
        name: 'Sauvignon Blanc',
        category: DrinkCategory.WINE,
        price: 11.5,
        description:
          'A crisp, aromatic white wine with notes of citrus, green apple, and herbs.',
        isAvailable: true,
        imageData: getImageData('chardonnay', 'cabernet_sauvignon'),
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
        imageData: getImageData('macallan_12', 'grey_goose_vodka'),
      },
      {
        name: 'Grey Goose Vodka',
        category: DrinkCategory.SPIRIT,
        price: 13.0,
        description:
          'Premium French vodka made from high-quality winter wheat, offering a smooth, clean taste.',
        isAvailable: true,
        imageData: getImageData('grey_goose_vodka', 'macallan_12'),
      },
      {
        name: "Hendrick's Gin",
        category: DrinkCategory.SPIRIT,
        price: 14.0,
        description:
          'A Scottish gin infused with cucumber and rose petals for a uniquely floral flavor.',
        isAvailable: true,
        imageData: getImageData('hendrick_s_gin', 'macallan_12'),
      },
      {
        name: 'Bulleit Bourbon',
        category: DrinkCategory.SPIRIT,
        price: 12.0,
        description:
          'A high-rye bourbon with a bold, spicy character and notes of vanilla and oak.',
        isAvailable: true,
        imageData: getImageData('macallan_12', 'grey_goose_vodka'),
      },
      {
        name: 'Don Julio Tequila',
        category: DrinkCategory.SPIRIT,
        price: 14.0,
        description:
          'A premium tequila with smooth, sweet agave notes and a hint of vanilla.',
        isAvailable: true,
        imageData: getImageData('grey_goose_vodka', 'macallan_12'),
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
        imageData: getImageData('virgin_mojito', 'sparkling_water'),
      },
      {
        name: 'Sparkling Water',
        category: DrinkCategory.NON_ALCOHOLIC,
        price: 3.5,
        description:
          'Refreshing, effervescent water with natural minerals. Served with a slice of lemon.',
        isAvailable: true,
        imageData: getImageData('sparkling_water', 'fresh_orange_juice'),
      },
      {
        name: 'Fresh Orange Juice',
        category: DrinkCategory.NON_ALCOHOLIC,
        price: 5.0,
        description:
          'Freshly squeezed orange juice, full of vitamin C and natural sweetness.',
        isAvailable: true,
        imageData: getImageData('fresh_orange_juice', 'sparkling_water'),
      },
      {
        name: 'Lemonade',
        category: DrinkCategory.NON_ALCOHOLIC,
        price: 4.5,
        description:
          'A sweet and tangy drink made with fresh lemons, sugar, and water.',
        isAvailable: true,
        imageData: getImageData('sparkling_water', 'fresh_orange_juice'),
      },
      {
        name: 'Iced Tea',
        category: DrinkCategory.NON_ALCOHOLIC,
        price: 4.0,
        description:
          'A refreshing blend of black tea, lemon, and a hint of sweetness.',
        isAvailable: true,
        imageData: getImageData('sparkling_water', 'fresh_orange_juice'),
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
        imageData: getImageData('classic_martini', 'mojito'),
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
        imageData: getImageData('old_fashioned', 'mojito'),
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
        imageData: getImageData('mojito', 'cosmopolitan'),
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
        imageData: getImageData('cosmopolitan', 'mojito'),
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
        imageData: getImageData('margarita', 'cosmopolitan'),
      },
      {
        name: 'Negroni',
        category: DrinkCategory.COCKTAIL,
        price: 13.5,
        description:
          'A bold, bitter cocktail made with gin, Campari, and sweet vermouth.',
        isAvailable: true,
        ingredients: [
          { name: 'Gin', amount: '30', unit: 'ml' },
          { name: 'Campari', amount: '30', unit: 'ml' },
          { name: 'Sweet Vermouth', amount: '30', unit: 'ml' },
          { name: 'Orange Peel', amount: '1', unit: 'piece' },
        ],
        instructions: [
          'Add gin, Campari, and sweet vermouth to a mixing glass with ice',
          'Stir well until chilled',
          'Strain into a rocks glass over ice',
          'Garnish with an orange peel',
        ],
        glassType: 'Rocks glass',
        garnish: 'Orange peel',
        preparationTime: 3,
        isInMenu: true,
        imageData: getImageData('classic_martini', 'mojito'),
      },
      {
        name: 'Espresso Martini',
        category: DrinkCategory.COCKTAIL,
        price: 14.0,
        description:
          'A rich, coffee-flavored cocktail made with vodka, coffee liqueur, and fresh espresso.',
        isAvailable: true,
        ingredients: [
          { name: 'Vodka', amount: '50', unit: 'ml' },
          { name: 'Coffee Liqueur', amount: '30', unit: 'ml' },
          { name: 'Fresh Espresso', amount: '30', unit: 'ml' },
          { name: 'Sugar', amount: '1', unit: 'tsp' },
        ],
        instructions: [
          'Add vodka, coffee liqueur, fresh espresso, and sugar to a shaker with ice',
          'Shake vigorously until frothy',
          'Strain into a chilled martini glass',
          'Garnish with coffee beans',
        ],
        glassType: 'Martini glass',
        garnish: 'Coffee beans',
        preparationTime: 4,
        isInMenu: true,
        imageData: getImageData('classic_martini', 'mojito'),
      },
    ];

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
