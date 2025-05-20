import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { faker } from '@faker-js/faker'

// ประเภทหนังสำหรับสุ่ม
const movieGenres = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
  'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy',
  'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
  'Thriller', 'War', 'Western'
]

// สร้างข้อมูลหนัง 20 เรื่อง
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('🎬 เริ่มต้นการสร้างข้อมูลหนังด้วย Faker')

  try {
    // สร้างหนังจำลองจำนวน 20 เรื่อง
    for (let i = 0; i < 20; i++) {
      const movieData = {
        title: faker.lorem.words({ min: 2, max: 5 }).split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: faker.lorem.paragraphs({ min: 1, max: 3 }),
        releaseDate: faker.date.between({ 
          from: new Date('2000-01-01'), 
          to: new Date() 
        }).toISOString(),
        genre: faker.helpers.arrayElement(movieGenres)
        // poster จะต้องจัดการแยกต่างหาก เพราะต้องมีการ upload จริงๆ
      }

      const movie = await payload.create({
        collection: 'movies',
        data: movieData
      })
      
      payload.logger.info(`✅ สร้างหนังเรื่อง "${movieData.title}" เรียบร้อยแล้ว (ID: ${movie.id})`)
    }

    payload.logger.info('✅ สร้างข้อมูลหนังเสร็จสิ้น')
  } catch (error) {
    payload.logger.error('❌ เกิดข้อผิดพลาดในการสร้างข้อมูลหนัง:', error)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('🗑️ กำลังลบข้อมูลหนังทั้งหมดที่สร้างจาก faker')

  try {
    // ในการทำ down migration เราจะหาหนังทั้งหมดและลบออก
    // แต่เนื่องจากอาจมีหนังเยอะมาก ใช้ limit: 0 เพื่อดึงเฉพาะข้อมูล count
    const { docs: movies } = await payload.find({
      collection: 'movies',
      limit: 100, // ลบทีละ 100 เรื่อง หรือปรับตามความเหมาะสม
    })

    for (const movie of movies) {
      await payload.delete({
        collection: 'movies',
        id: movie.id
      })
      payload.logger.info(`🗑️ ลบหนังเรื่อง "${movie.title}" เรียบร้อยแล้ว`)
    }

    payload.logger.info('✅ ลบข้อมูลหนังเสร็จสิ้น')
  } catch (error) {
    payload.logger.error('❌ เกิดข้อผิดพลาดในการลบข้อมูลหนัง:', error)
  }
}