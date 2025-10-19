// src/utils/seedRestaurants.js
// Temporary script to seed restaurant data into Firestore
// Melbourne-focused restaurants and grocery stores

import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

// Melbourne international restaurants and grocery stores sample data
const restaurants = [
  {
    id: 'rest_001',
    name: 'Chin Chin',
    type: 'Restaurant',
    cuisine: 'Thai',
    description:
      'Modern Thai restaurant in the heart of Melbourne. Famous for spicy salads and stir-fries.',
    address: '125 Flinders Lane, Melbourne VIC 3000',
    location: {
      latitude: -37.8179,
      longitude: 144.969,
    },
    phone: '+61 3 8663 2000',
    email: 'info@chinchinrestaurant.com.au',
    website: 'https://www.chinchinrestaurant.com.au',
    priceRange: '$$',
    openingHours: {
      monday: '11:00 AM - 11:00 PM',
      tuesday: '11:00 AM - 11:00 PM',
      wednesday: '11:00 AM - 11:00 PM',
      thursday: '11:00 AM - 11:00 PM',
      friday: '11:00 AM - 12:00 AM',
      saturday: '11:00 AM - 12:00 AM',
      sunday: '11:00 AM - 11:00 PM',
    },
    features: ['Dine-in', 'Takeaway', 'Bar', 'No Reservations'],
    averageRating: 4.3,
    ratingCount: 1523,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    tags: ['thai', 'spicy', 'trendy', 'popular'],
    createdAt: new Date('2025-09-10T10:00:00'),
    updatedAt: new Date('2025-10-15T14:20:00'),
  },
  {
    id: 'rest_002',
    name: 'Flower Drum',
    type: 'Restaurant',
    cuisine: 'Chinese',
    description:
      'Legendary Cantonese restaurant serving exquisite dim sum and Peking duck since 1975.',
    address: '17 Market Lane, Melbourne VIC 3000',
    location: {
      latitude: -37.8136,
      longitude: 144.9631,
    },
    phone: '+61 3 9662 3655',
    email: 'reservations@flowerdrum.melbourne',
    website: 'https://www.flowerdrum.melbourne',
    priceRange: '$$$',
    openingHours: {
      monday: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
      tuesday: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
      wednesday: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
      thursday: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
      friday: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
      saturday: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
      sunday: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
    },
    features: ['Dine-in', 'Fine Dining', 'Reservations Required', 'Dress Code'],
    averageRating: 4.6,
    ratingCount: 892,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80',
    tags: ['cantonese', 'dim sum', 'fine dining', 'iconic'],
    createdAt: new Date('2025-09-10T11:00:00'),
    updatedAt: new Date('2025-10-16T09:30:00'),
  },
  {
    id: 'rest_003',
    name: 'Hanabishi Japanese Restaurant',
    type: 'Restaurant',
    cuisine: 'Japanese',
    description:
      'Authentic Japanese restaurant specializing in fresh sushi, sashimi, and traditional dishes.',
    address: '187 Lonsdale Street, Melbourne VIC 3000',
    location: {
      latitude: -37.8118,
      longitude: 144.966,
    },
    phone: '+61 3 9663 5521',
    email: 'info@hanabishi.com.au',
    website: 'https://www.hanabishi.com.au',
    priceRange: '$$',
    openingHours: {
      monday: 'Closed',
      tuesday: '12:00 PM - 2:30 PM, 5:30 PM - 9:30 PM',
      wednesday: '12:00 PM - 2:30 PM, 5:30 PM - 9:30 PM',
      thursday: '12:00 PM - 2:30 PM, 5:30 PM - 9:30 PM',
      friday: '12:00 PM - 2:30 PM, 5:30 PM - 10:00 PM',
      saturday: '12:00 PM - 2:30 PM, 5:30 PM - 10:00 PM',
      sunday: '5:30 PM - 9:30 PM',
    },
    features: ['Dine-in', 'Takeaway', 'Fresh Sushi', 'Sake Bar'],
    averageRating: 4.4,
    ratingCount: 678,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
    tags: ['japanese', 'sushi', 'sashimi', 'authentic'],
    createdAt: new Date('2025-09-11T10:00:00'),
    updatedAt: new Date('2025-10-17T11:15:00'),
  },
  {
    id: 'store_001',
    name: 'Tokyo Mart',
    type: 'Grocery Store',
    cuisine: 'Japanese',
    description:
      "Melbourne's premier Japanese grocery store with fresh produce, authentic ingredients, and household items.",
    address: 'Shop 27, 206 Bourke Street, Melbourne VIC 3000',
    location: {
      latitude: -37.8136,
      longitude: 144.967,
    },
    phone: '+61 3 9663 8822',
    email: 'info@tokyomart.com.au',
    website: 'https://www.tokyomart.com.au',
    priceRange: '$$',
    openingHours: {
      monday: '10:00 AM - 8:00 PM',
      tuesday: '10:00 AM - 8:00 PM',
      wednesday: '10:00 AM - 8:00 PM',
      thursday: '10:00 AM - 8:00 PM',
      friday: '10:00 AM - 8:00 PM',
      saturday: '10:00 AM - 8:00 PM',
      sunday: '10:00 AM - 7:00 PM',
    },
    features: ['Fresh Produce', 'Frozen Foods', 'Snacks', 'Kitchenware', 'Home Delivery'],
    averageRating: 4.5,
    ratingCount: 1234,
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
    tags: ['japanese', 'grocery', 'fresh produce', 'authentic'],
    createdAt: new Date('2025-09-12T09:00:00'),
    updatedAt: new Date('2025-10-18T10:45:00'),
  },
  {
    id: 'store_002',
    name: 'KT Mart Korean Grocery',
    type: 'Grocery Store',
    cuisine: 'Korean',
    description:
      'Comprehensive Korean grocery store offering fresh kimchi, gochugaru, Korean BBQ meats, and K-beauty products.',
    address: '250 Elizabeth Street, Melbourne VIC 3000',
    location: {
      latitude: -37.8107,
      longitude: 144.9629,
    },
    phone: '+61 3 9663 6838',
    email: 'contact@ktmart.com.au',
    website: 'https://www.ktmart.com.au',
    priceRange: '$$',
    openingHours: {
      monday: '9:00 AM - 9:00 PM',
      tuesday: '9:00 AM - 9:00 PM',
      wednesday: '9:00 AM - 9:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '9:00 AM - 9:00 PM',
      sunday: '9:00 AM - 9:00 PM',
    },
    features: ['Fresh Kimchi', 'Korean BBQ Meats', 'Frozen Dumplings', 'K-Beauty', 'Snacks'],
    averageRating: 4.6,
    ratingCount: 987,
    imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80',
    tags: ['korean', 'grocery', 'kimchi', 'bbq meats'],
    createdAt: new Date('2025-09-13T10:30:00'),
    updatedAt: new Date('2025-10-19T09:20:00'),
  },
  {
    id: 'store_003',
    name: 'Dragon Boat Asian Supermarket',
    type: 'Grocery Store',
    cuisine: 'Asian',
    description:
      'Large Asian supermarket with products from China, Thailand, Vietnam, Malaysia, and more. One-stop shop for all Asian ingredients.',
    address: '3/250 Victoria Street, Richmond VIC 3121',
    location: {
      latitude: -37.8129,
      longitude: 144.9968,
    },
    phone: '+61 3 9428 2338',
    email: 'info@dragonboat.com.au',
    website: 'https://www.dragonboat.com.au',
    priceRange: '$',
    openingHours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 9:00 PM',
      saturday: '8:00 AM - 9:00 PM',
      sunday: '8:00 AM - 9:00 PM',
    },
    features: ['Fresh Produce', 'Wide Selection', 'Affordable Prices', 'Free Parking'],
    averageRating: 4.3,
    ratingCount: 2156,
    imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&q=80',
    tags: ['asian', 'grocery', 'variety', 'affordable'],
    createdAt: new Date('2025-09-14T11:00:00'),
    updatedAt: new Date('2025-10-18T15:30:00'),
  },
  {
    id: 'store_004',
    name: 'Little India Spice Market',
    type: 'Grocery Store',
    cuisine: 'Indian',
    description:
      'Authentic Indian grocery store specializing in fresh spices, lentils, rice, and traditional sweets.',
    address: '158 Lonsdale Street, Dandenong VIC 3175',
    location: {
      latitude: -37.9871,
      longitude: 145.2148,
    },
    phone: '+61 3 9791 2255',
    email: 'info@littleindiaspices.com.au',
    website: 'https://www.littleindiaspices.com.au',
    priceRange: '$',
    openingHours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '9:00 AM - 8:00 PM',
      sunday: '9:00 AM - 7:00 PM',
    },
    features: ['Fresh Spices', 'Bulk Buying', 'Traditional Sweets', 'Halal Products'],
    averageRating: 4.7,
    ratingCount: 543,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a0b4e27d1a81?w=800&q=80',
    tags: ['indian', 'spices', 'grocery', 'halal'],
    createdAt: new Date('2025-09-15T09:30:00'),
    updatedAt: new Date('2025-10-17T14:00:00'),
  },
  {
    id: 'store_005',
    name: 'Thai Kee IGA Springvale',
    type: 'Grocery Store',
    cuisine: 'Thai/Vietnamese',
    description:
      'Popular Thai and Vietnamese grocery store with fresh herbs, exotic fruits, and authentic ingredients.',
    address: '6-8 Windsor Avenue, Springvale VIC 3171',
    location: {
      latitude: -37.9501,
      longitude: 145.1504,
    },
    phone: '+61 3 9546 3301',
    email: 'info@thaikee.com.au',
    website: 'https://www.thaikee.com.au',
    priceRange: '$',
    openingHours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 9:00 PM',
      saturday: '8:00 AM - 9:00 PM',
      sunday: '8:00 AM - 9:00 PM',
    },
    features: ['Fresh Herbs', 'Exotic Fruits', 'Frozen Seafood', 'Thai Products'],
    averageRating: 4.4,
    ratingCount: 876,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    tags: ['thai', 'vietnamese', 'fresh herbs', 'grocery'],
    createdAt: new Date('2025-09-16T10:00:00'),
    updatedAt: new Date('2025-10-19T11:30:00'),
  },
  {
    id: 'store_006',
    name: 'Casa Iberica',
    type: 'Grocery Store',
    cuisine: 'Spanish/Portuguese',
    description:
      'Specialist Spanish and Portuguese delicatessen with imported cheeses, cured meats, and wine.',
    address: '25-31 Johnston Street, Fitzroy VIC 3065',
    location: {
      latitude: -37.7995,
      longitude: 144.9783,
    },
    phone: '+61 3 9419 4420',
    email: 'info@casaiberica.com.au',
    website: 'https://www.casaiberica.com.au',
    priceRange: '$$',
    openingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '10:00 AM - 5:00 PM',
    },
    features: ['Imported Goods', 'Deli Counter', 'Wine Selection', 'Gift Hampers'],
    averageRating: 4.8,
    ratingCount: 432,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    tags: ['spanish', 'portuguese', 'deli', 'imported'],
    createdAt: new Date('2025-09-17T11:30:00'),
    updatedAt: new Date('2025-10-16T13:45:00'),
  },
  {
    id: 'store_007',
    name: 'Paesanella Italian Foods',
    type: 'Grocery Store',
    cuisine: 'Italian',
    description:
      'Traditional Italian delicatessen offering fresh pasta, cheese, olive oil, and authentic Italian products.',
    address: '17 Arthurton Road, Northcote VIC 3070',
    location: {
      latitude: -37.7703,
      longitude: 144.9977,
    },
    phone: '+61 3 9482 2984',
    email: 'info@paesanella.com.au',
    website: 'https://www.paesanella.com.au',
    priceRange: '$$',
    openingHours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '8:00 AM - 5:00 PM',
      sunday: '8:00 AM - 3:00 PM',
    },
    features: ['Fresh Pasta', 'Artisan Cheese', 'Olive Oil', 'Imported Products'],
    averageRating: 4.7,
    ratingCount: 621,
    imageUrl: 'https://images.unsplash.com/photo-1498579397066-22750a3cb424?w=800&q=80',
    tags: ['italian', 'deli', 'fresh pasta', 'artisan'],
    createdAt: new Date('2025-09-18T09:00:00'),
    updatedAt: new Date('2025-10-18T12:00:00'),
  },
  {
    id: 'store_008',
    name: 'South Melbourne Market',
    type: 'Market',
    cuisine: 'International',
    description:
      'Historic market with diverse international food stalls, fresh produce, and specialty grocers from around the world.',
    address: 'Corner Coventry and Cecil Streets, South Melbourne VIC 3205',
    location: {
      latitude: -37.8318,
      longitude: 144.9534,
    },
    phone: '+61 3 9209 6295',
    email: 'info@southmelbournemarket.com.au',
    website: 'https://www.southmelbournemarket.com.au',
    priceRange: '$$',
    openingHours: {
      monday: 'Closed',
      tuesday: 'Closed',
      wednesday: '8:00 AM - 4:00 PM',
      thursday: 'Closed',
      friday: '8:00 AM - 5:00 PM',
      saturday: '8:00 AM - 4:00 PM',
      sunday: '9:00 AM - 4:00 PM',
    },
    features: ['Fresh Produce', 'International Foods', 'Food Court', 'Historic Market'],
    averageRating: 4.5,
    ratingCount: 3421,
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
    tags: ['market', 'international', 'fresh produce', 'iconic'],
    createdAt: new Date('2025-09-19T10:00:00'),
    updatedAt: new Date('2025-10-19T14:00:00'),
  },
]

/**
 * Seed restaurants/stores to Firestore
 */
export const seedRestaurants = async () => {
  try {
    console.log('🌱 Starting to seed restaurants/stores to Firestore...')
    console.log(`📦 Total restaurants/stores to add: ${restaurants.length}`)

    let successCount = 0
    let errorCount = 0

    for (const restaurant of restaurants) {
      try {
        await setDoc(doc(db, 'restaurants', restaurant.id), restaurant)
        console.log(`✅ Added ${restaurant.type}: ${restaurant.name} (ID: ${restaurant.id})`)
        successCount++
      } catch (error) {
        console.error(`❌ Error adding ${restaurant.name}:`, error)
        errorCount++
      }
    }

    console.log('\n📊 Seeding Summary:')
    console.log(`   ✅ Success: ${successCount} restaurants/stores`)
    console.log(`   ❌ Errors: ${errorCount} restaurants/stores`)
    console.log('\n🎉 Restaurant/store seeding completed!')

    return { success: successCount, errors: errorCount }
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error)
    throw error
  }
}

// Export both data and function
export { restaurants }
export default seedRestaurants
