import { MongoClient, ObjectId } from 'mongodb';
import { DrinkCategory } from '../types/drink';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'bartender';

const drinksData = [
  // Beers
  {
    _id: new ObjectId(),
    name: 'Heineken',
    category: DrinkCategory.BEER,
    price: 6.99,
    description: 'Premium lager beer with a balanced, crisp taste',
    isAvailable: true,
    alcoholPercentage: 5.0,
    brewery: 'Heineken',
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  {
    _id: new ObjectId(),
    name: 'Guinness',
    category: DrinkCategory.BEER,
    price: 7.99,
    description: 'Rich, dark stout with a creamy head',
    isAvailable: true,
    alcoholPercentage: 4.2,
    brewery: 'Guinness',
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  // Wines
  {
    _id: new ObjectId(),
    name: 'Château Margaux',
    category: DrinkCategory.WINE,
    price: 89.99,
    description: 'Premium French red wine with rich, complex flavors',
    isAvailable: true,
    alcoholPercentage: 13.5,
    wineType: 'RED',
    region: 'Bordeaux',
    year: 2018,
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  {
    _id: new ObjectId(),
    name: 'Cloudy Bay Sauvignon Blanc',
    category: DrinkCategory.WINE,
    price: 45.99,
    description: 'Crisp, refreshing white wine with citrus notes',
    isAvailable: true,
    alcoholPercentage: 13.0,
    wineType: 'WHITE',
    region: 'Marlborough',
    year: 2022,
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  // Spirits
  {
    _id: new ObjectId(),
    name: 'Macallan 18',
    category: DrinkCategory.SPIRIT,
    price: 299.99,
    description: 'Single malt scotch whisky with rich, complex flavors',
    isAvailable: true,
    alcoholPercentage: 43.0,
    distillery: 'The Macallan',
    ageStatement: '18 years',
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  {
    _id: new ObjectId(),
    name: 'Grey Goose',
    category: DrinkCategory.SPIRIT,
    price: 49.99,
    description: 'Premium French vodka with a smooth, clean taste',
    isAvailable: true,
    alcoholPercentage: 40.0,
    distillery: 'Grey Goose',
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  // Non-alcoholic
  {
    _id: new ObjectId(),
    name: 'Virgin Mojito',
    category: DrinkCategory.NON_ALCOHOLIC,
    price: 5.99,
    description: 'Refreshing mint and lime mocktail',
    isAvailable: true,
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
];

const cocktailsData = [
  {
    _id: new ObjectId(),
    name: 'Classic Mojito',
    category: DrinkCategory.COCKTAIL,
    price: 12.99,
    description: 'Refreshing Cuban cocktail with rum, mint, and lime',
    isAvailable: true,
    ingredients: [
      { name: 'White Rum', amount: '60', unit: 'ml' },
      { name: 'Fresh Lime Juice', amount: '30', unit: 'ml' },
      { name: 'Sugar', amount: '2', unit: 'tsp' },
      { name: 'Fresh Mint', amount: '6', unit: 'leaves' },
      { name: 'Soda Water', amount: '60', unit: 'ml' },
    ],
    instructions: [
      'Muddle mint leaves with sugar and lime juice',
      'Add rum and fill glass with crushed ice',
      'Top with soda water',
      'Garnish with mint sprig and lime wheel',
    ],
    isInMenu: true,
    glassType: 'Highball',
    garnish: 'Mint sprig and lime wheel',
    preparationTime: 5,
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  {
    _id: new ObjectId(),
    name: 'Old Fashioned',
    category: DrinkCategory.COCKTAIL,
    price: 14.99,
    description: 'Classic whiskey cocktail with bitters and sugar',
    isAvailable: true,
    ingredients: [
      { name: 'Bourbon', amount: '60', unit: 'ml' },
      { name: 'Angostura Bitters', amount: '2', unit: 'dashes' },
      { name: 'Sugar Cube', amount: '1', unit: 'piece' },
      { name: 'Water', amount: '1', unit: 'splash' },
    ],
    instructions: [
      'Muddle sugar cube with bitters and water',
      'Add bourbon and ice',
      'Stir until well chilled',
      'Garnish with orange peel',
    ],
    isInMenu: true,
    glassType: 'Rocks',
    garnish: 'Orange peel',
    preparationTime: 4,
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
  {
    _id: new ObjectId(),
    name: 'Espresso Martini',
    category: DrinkCategory.COCKTAIL,
    price: 13.99,
    description: 'Coffee-flavored cocktail with vodka and coffee liqueur',
    isAvailable: true,
    ingredients: [
      { name: 'Vodka', amount: '50', unit: 'ml' },
      { name: 'Coffee Liqueur', amount: '30', unit: 'ml' },
      { name: 'Fresh Espresso', amount: '30', unit: 'ml' },
      { name: 'Simple Syrup', amount: '15', unit: 'ml' },
    ],
    instructions: [
      'Add all ingredients to a shaker with ice',
      'Shake vigorously for 10-15 seconds',
      'Double strain into a chilled martini glass',
      'Garnish with coffee beans',
    ],
    isInMenu: true,
    glassType: 'Martini',
    garnish: 'Coffee beans',
    preparationTime: 5,
    imageData: {
      _id: '',
      url: '',
      name: '',
    },
  },
];

async function seedDrinks() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const drinksCollection = db.collection('drinks');
    const cocktailsCollection = db.collection('cocktails');

    // Clear existing data
    await drinksCollection.deleteMany({});
    await cocktailsCollection.deleteMany({});
    console.log('Cleared existing drinks and cocktails data');

    // Process drinks - set imageData to use the same ID as the document
    const processedDrinks = drinksData.map((drink) => {
      const drinkId = drink._id.toString();
      const filename = `${drink.name
        .toLowerCase()
        .replace(/\s+/g, '_')}-${drinkId}.jpg`;

      return {
        ...drink,
        imageData: {
          _id: drinkId,
          url: `/uploads/${filename}`,
          name: filename,
        },
      };
    });

    // Process cocktails - set imageData to use the same ID as the document
    const processedCocktails = cocktailsData.map((cocktail) => {
      const cocktailId = cocktail._id.toString();
      const filename = `${cocktail.name
        .toLowerCase()
        .replace(/\s+/g, '_')}-${cocktailId}.jpg`;

      return {
        ...cocktail,
        imageData: {
          _id: cocktailId,
          url: `/uploads/${filename}`,
          name: filename,
        },
      };
    });

    // Insert new data
    const drinksResult = await drinksCollection.insertMany(processedDrinks);
    const cocktailsResult = await cocktailsCollection.insertMany(
      processedCocktails
    );

    console.log(`Successfully seeded ${drinksResult.insertedCount} drinks`);
    console.log(
      `Successfully seeded ${cocktailsResult.insertedCount} cocktails`
    );

    console.log('\nImage filenames that should be used:');
    processedDrinks.forEach((drink) => {
      console.log(`${drink.name}: ${drink.imageData.name}`);
    });
    processedCocktails.forEach((cocktail) => {
      console.log(`${cocktail.name}: ${cocktail.imageData.name}`);
    });
  } catch (error) {
    console.error('Error seeding drinks data:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedDrinks();
