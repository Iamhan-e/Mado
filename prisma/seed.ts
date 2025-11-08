import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create a demo author
  const author = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demoauthor',
      name: 'Demo Author',
      password: await hash('Demo1234', 12),
      bio: 'A passionate storyteller sharing tales in Amharic',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  })

  console.log('Created demo author:', author.username)

  // Create sample stories
  const stories = [
    {
      title: 'የፍቅር ተረት (Love Story)',
      description: 'A beautiful love story set in the heart of Addis Ababa. Two souls destined to meet.',
      genre: 'Romance',
      language: 'amharic',
      mature: false,
      published: true,
      status: 'ongoing',
      coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
    },
    {
      title: 'የጀግኖች ጉዞ (Journey of Heroes)',
      description: 'An epic adventure through ancient Ethiopian kingdoms.',
      genre: 'Adventure',
      language: 'amharic',
      mature: false,
      published: true,
      status: 'ongoing',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    },
    {
      title: 'Secret of the Past',
      description: 'A thrilling mystery that uncovers hidden family secrets.',
      genre: 'Mystery',
      language: 'english',
      mature: false,
      published: true,
      status: 'completed',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    },
    {
      title: 'የህልም አለም (Dream World)',
      description: 'A fantasy tale where dreams become reality.',
      genre: 'Fantasy',
      language: 'amharic',
      mature: false,
      published: true,
      status: 'ongoing',
      coverImage: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=400',
    },
    {
      title: 'City Lights',
      description: 'Drama unfolds in the bustling streets of modern Addis.',
      genre: 'Drama',
      language: 'english',
      mature: true,
      published: true,
      status: 'ongoing',
      coverImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400',
    },
  ]

  for (const storyData of stories) {
    const story = await prisma.story.create({
      data: {
        ...storyData,
        authorId: author.id,
        views: Math.floor(Math.random() * 5000) + 100,
      },
    })

    // Create 3-5 chapters for each story
    const chapterCount = Math.floor(Math.random() * 3) + 3
    for (let i = 1; i <= chapterCount; i++) {
      await prisma.chapter.create({
        data: {
          title: `Chapter ${i}`,
          content: `This is the content of chapter ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
          number: i,
          storyId: story.id,
          published: true,
        },
      })
    }

    console.log(`Created story: ${story.title} with ${chapterCount} chapters`)
  }

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })