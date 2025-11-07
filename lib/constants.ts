export const GENRES = [
  'Romance',
  'Fantasy',
  'Drama',
  'Adventure',
  'Poetry',
  'Historical',
  'Mystery',
  'Thriller',
  'Science Fiction',
  'Folklore',
  'Biography',
  'Religious',
  'Other'
] as const

export const LANGUAGES = [
  { code: 'amharic', name: 'አማርኛ (Amharic)', nativeName: 'አማርኛ' },
  { code: 'oromo', name: 'Afaan Oromoo (Oromo)', nativeName: 'Afaan Oromoo' },
  { code: 'tigrinya', name: 'ትግርኛ (Tigrinya)', nativeName: 'ትግርኛ' },
  { code: 'somali', name: 'Soomaali (Somali)', nativeName: 'Soomaali' },
  { code: 'english', name: 'English', nativeName: 'English' }
] as const

export const STORY_STATUS = [
  'ongoing',
  'completed',
  'on_hold'
] as const

export type Genre = typeof GENRES[number]
export type Language = typeof LANGUAGES[number]['code']
export type StoryStatus = typeof STORY_STATUS[number]