// src/utils/seedEvents.js
// Temporary script to seed event data into Firestore
// Melbourne-focused cooking events and workshops

import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

// Melbourne cooking events and workshops sample data
const events = [
  {
    id: 'event_001',
    title: 'Japanese Sushi Making Workshop',
    description:
      'Learn to make authentic sushi rolls with a professional chef. Perfect for beginners! All ingredients and tools provided.',
    date: '2025-11-15',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Melbourne CBD Community Center',
    address: '123 Swanston Street, Melbourne VIC 3000',
    type: 'Workshop',
    cuisine: 'Japanese',
    organizer: 'Chef Takeshi Yamada',
    organizerEmail: 'takeshi@sushiworkshop.com.au',
    participants: 12,
    maxParticipants: 20,
    price: 85,
    status: 'Open',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
    tags: ['sushi', 'japanese', 'hands-on', 'beginner-friendly'],
    requirements: ['Apron will be provided', 'Please arrive 10 minutes early'],
    createdAt: new Date('2025-10-01T10:00:00'),
    updatedAt: new Date('2025-10-15T14:30:00'),
  },
  {
    id: 'event_002',
    title: 'Italian Pasta Masterclass',
    description:
      'Master the art of fresh pasta making from scratch. Learn to make fettuccine, ravioli, and traditional Italian sauces.',
    date: '2025-11-20',
    startTime: '18:00',
    endTime: '21:00',
    location: 'Carlton Cooking School',
    address: '45 Lygon Street, Carlton VIC 3053',
    type: 'Cooking Class',
    cuisine: 'Italian',
    organizer: 'Chef Giovanni Rossi',
    organizerEmail: 'giovanni@pastamasterclass.com.au',
    participants: 18,
    maxParticipants: 20,
    price: 95,
    status: 'Almost Full',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    tags: ['pasta', 'italian', 'hands-on', 'intermediate'],
    requirements: ['Basic cooking knowledge recommended', 'Wear comfortable closed-toe shoes'],
    createdAt: new Date('2025-09-28T09:00:00'),
    updatedAt: new Date('2025-10-18T16:45:00'),
  },
  {
    id: 'event_003',
    title: 'Asian Street Food Festival',
    description:
      'Experience authentic street food from across Asia! Featuring vendors from Thailand, Vietnam, Korea, Malaysia, and more.',
    date: '2025-11-25',
    startTime: '11:00',
    endTime: '19:00',
    location: 'Federation Square',
    address: 'Federation Square, Melbourne VIC 3000',
    type: 'Food Festival',
    cuisine: 'Asian',
    organizer: 'Melbourne Food Events',
    organizerEmail: 'info@melbournefoodevents.com.au',
    participants: 450,
    maxParticipants: 1000,
    price: 0,
    status: 'Open',
    difficulty: 'All Levels',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    tags: ['festival', 'street food', 'asian', 'family-friendly', 'free'],
    requirements: ['Free entry', 'Food and drinks available for purchase'],
    createdAt: new Date('2025-09-15T11:00:00'),
    updatedAt: new Date('2025-10-10T13:20:00'),
  },
  {
    id: 'event_004',
    title: 'Thai Green Curry Cooking Class',
    description:
      'Learn to cook authentic Thai green curry with fresh ingredients. Includes recipe booklet and tasting session.',
    date: '2025-11-28',
    startTime: '17:30',
    endTime: '20:00',
    location: 'Richmond Thai Kitchen',
    address: '78 Bridge Road, Richmond VIC 3121',
    type: 'Cooking Class',
    cuisine: 'Thai',
    organizer: 'Chef Pranee Suwannakul',
    organizerEmail: 'pranee@thaicooking.com.au',
    participants: 8,
    maxParticipants: 15,
    price: 75,
    status: 'Open',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    tags: ['thai', 'curry', 'hands-on', 'beginner-friendly'],
    requirements: ['All dietary requirements can be accommodated', 'Please advise of allergies'],
    createdAt: new Date('2025-10-05T14:00:00'),
    updatedAt: new Date('2025-10-16T10:15:00'),
  },
  {
    id: 'event_005',
    title: 'Dumpling Making Workshop',
    description:
      'Learn traditional Chinese dumpling making techniques. Make and steam your own dumplings to take home!',
    date: '2025-12-02',
    startTime: '15:00',
    endTime: '17:30',
    location: 'Box Hill Community Center',
    address: '470 Station Street, Box Hill VIC 3128',
    type: 'Workshop',
    cuisine: 'Chinese',
    organizer: 'Chef Wei Chen',
    organizerEmail: 'wei@dumplingworkshop.com.au',
    participants: 15,
    maxParticipants: 25,
    price: 60,
    status: 'Open',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80',
    tags: ['dumplings', 'chinese', 'hands-on', 'family-friendly'],
    requirements: ['Containers provided to take dumplings home', 'Suitable for ages 12+'],
    createdAt: new Date('2025-10-08T09:30:00'),
    updatedAt: new Date('2025-10-17T15:00:00'),
  },
  {
    id: 'event_006',
    title: 'Indian Curry Night: Butter Chicken Special',
    description:
      'Master the secrets of authentic Indian butter chicken and naan bread. Includes spice kit to take home.',
    date: '2025-12-05',
    startTime: '18:30',
    endTime: '21:00',
    location: 'Footscray Spice Kitchen',
    address: '25 Leeds Street, Footscray VIC 3011',
    type: 'Cooking Class',
    cuisine: 'Indian',
    organizer: 'Chef Priya Sharma',
    organizerEmail: 'priya@spicekitchen.com.au',
    participants: 10,
    maxParticipants: 16,
    price: 80,
    status: 'Open',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    tags: ['indian', 'curry', 'hands-on', 'spices'],
    requirements: ['Vegetarian option available', 'Spice tolerance: mild to medium'],
    createdAt: new Date('2025-10-10T11:00:00'),
    updatedAt: new Date('2025-10-19T14:20:00'),
  },
  {
    id: 'event_007',
    title: 'Vietnamese Pho Workshop',
    description:
      'Learn the art of making authentic Vietnamese pho from scratch, including the perfect broth and fresh herbs.',
    date: '2025-12-08',
    startTime: '13:00',
    endTime: '16:00',
    location: 'Springvale Vietnamese Cultural Center',
    address: '5 Balmoral Avenue, Springvale VIC 3171',
    type: 'Workshop',
    cuisine: 'Vietnamese',
    organizer: 'Chef Linh Nguyen',
    organizerEmail: 'linh@phoworkshop.com.au',
    participants: 6,
    maxParticipants: 18,
    price: 70,
    status: 'Open',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-d9dddac2e6cb?w=800&q=80',
    tags: ['vietnamese', 'pho', 'soup', 'hands-on'],
    requirements: ['Recipe booklet included', 'Comfortable with strong aromatic spices'],
    createdAt: new Date('2025-10-12T10:00:00'),
    updatedAt: new Date('2025-10-18T09:30:00'),
  },
  {
    id: 'event_008',
    title: 'Korean BBQ & Kimchi Making',
    description:
      'Experience Korean BBQ culture and learn to make your own kimchi. Includes Korean BBQ dinner and kimchi to take home.',
    date: '2025-12-12',
    startTime: '17:00',
    endTime: '20:30',
    location: 'Glen Waverley Korean Cultural Hub',
    address: '12 Kingsway, Glen Waverley VIC 3150',
    type: 'Cooking Class',
    cuisine: 'Korean',
    organizer: 'Chef Min-jun Kim',
    organizerEmail: 'minjun@koreancooking.com.au',
    participants: 14,
    maxParticipants: 20,
    price: 90,
    status: 'Open',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80',
    tags: ['korean', 'bbq', 'kimchi', 'fermentation'],
    requirements: ['Jars provided for kimchi', 'Includes full Korean BBQ dinner'],
    createdAt: new Date('2025-10-14T13:00:00'),
    updatedAt: new Date('2025-10-19T11:45:00'),
  },
  {
    id: 'event_009',
    title: 'International Student Potluck Dinner',
    description:
      'Bring a dish from your home country and share stories! A great opportunity to meet international students and exchange cultures.',
    date: '2025-12-15',
    startTime: '18:00',
    endTime: '21:00',
    location: 'Monash University Clayton Campus',
    address: 'Student Lounge, Building 11, Wellington Road, Clayton VIC 3800',
    type: 'Meetup',
    cuisine: 'International',
    organizer: 'Monash International Students Association',
    organizerEmail: 'international@monash.edu',
    participants: 35,
    maxParticipants: 60,
    price: 0,
    status: 'Open',
    difficulty: 'All Levels',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
    tags: ['potluck', 'international', 'networking', 'free', 'students'],
    requirements: [
      'Bring a dish to share (serves 6-8)',
      'BYO drinks',
      'Plates and cutlery provided',
    ],
    createdAt: new Date('2025-10-16T15:00:00'),
    updatedAt: new Date('2025-10-19T16:30:00'),
  },
  {
    id: 'event_010',
    title: 'Christmas Baking Workshop: International Treats',
    description:
      'Learn to make Christmas treats from around the world! German stollen, Italian panettone, and Japanese Christmas cake.',
    date: '2025-12-18',
    startTime: '10:00',
    endTime: '14:00',
    location: 'South Melbourne Market Cooking School',
    address: 'South Melbourne Market, Cecil Street, South Melbourne VIC 3205',
    type: 'Workshop',
    cuisine: 'International',
    organizer: 'Melbourne Baking Academy',
    organizerEmail: 'info@melbournebaking.com.au',
    participants: 9,
    maxParticipants: 15,
    price: 110,
    status: 'Open',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    tags: ['baking', 'christmas', 'desserts', 'international'],
    requirements: ['All baking equipment provided', 'Take home boxes included'],
    createdAt: new Date('2025-10-18T12:00:00'),
    updatedAt: new Date('2025-10-19T17:00:00'),
  },
]

/**
 * Seed events to Firestore
 * This is a temporary function for development/testing
 */
export const seedEvents = async () => {
  try {
    console.log('🌱 Starting to seed events to Firestore...')
    console.log(`📦 Total events to add: ${events.length}`)

    let successCount = 0
    let errorCount = 0

    // Add each event to Firestore
    for (const event of events) {
      try {
        await setDoc(doc(db, 'events', event.id), event)
        console.log(`✅ Added event: ${event.title} (ID: ${event.id})`)
        successCount++
      } catch (error) {
        console.error(`❌ Error adding event ${event.title}:`, error)
        errorCount++
      }
    }

    console.log('\n📊 Seeding Summary:')
    console.log(`   ✅ Success: ${successCount} events`)
    console.log(`   ❌ Errors: ${errorCount} events`)
    console.log('\n🎉 Event seeding completed!')

    return { success: successCount, errors: errorCount }
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error)
    throw error
  }
}

// Export individual events for testing
export { events }
