import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { faker } from '@faker-js/faker'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('📝 เริ่มต้นการสร้างข้อมูลรีวิวด้วย Faker')

  try {
    // ดึงข้อมูล users และ movies ที่มีอยู่ในระบบ
    const { docs: users } = await payload.find({
      collection: 'users',
      limit: 100,
    })

    const { docs: movies } = await payload.find({
      collection: 'movies',
      limit: 100,
    })

    if (users.length === 0) {
      payload.logger.warn('⚠️ ไม่พบข้อมูลผู้ใช้ กรุณาสร้างผู้ใช้งานก่อนสร้างรีวิว')
      return
    }

    if (movies.length === 0) {
      payload.logger.warn('⚠️ ไม่พบข้อมูลหนัง กรุณาสร้างข้อมูลหนังก่อนสร้างรีวิว')
      return
    }

    payload.logger.info(`พบผู้ใช้ ${users.length} คน และหนัง ${movies.length} เรื่อง`)

    // สร้างรีวิวประมาณ 50 รีวิว
    const reviewsToCreate = 50
    let createdCount = 0

    for (let i = 0; i < reviewsToCreate; i++) {
      // เลือก user และ movie แบบสุ่ม
      const randomUser = faker.helpers.arrayElement(users)
      const randomMovie = faker.helpers.arrayElement(movies)
      
      // สร้างคะแนนสุ่มระหว่าง 1-10
      const rating = faker.number.int({ min: 1, max: 10 })
      
      // สร้างเนื้อหารีวิวที่สมเหตุสมผลตามคะแนน
      let content
      if (rating >= 8) {
        content = faker.helpers.maybe(() => 
          `${faker.word.adjective({ length: { min: 7, max: 15 } })}! ${faker.lorem.paragraphs({ min: 2, max: 3 })}`, 
          { probability: 0.8 }) || faker.lorem.paragraphs(1)
      } else if (rating >= 5) {
        content = faker.lorem.paragraphs({ min: 1, max: 2 })
      } else {
        content = faker.helpers.maybe(() => 
          `${faker.word.adjective({ length: { min: 3, max: 8 } })}... ${faker.lorem.paragraph()}`, 
          { probability: 0.7 }) || faker.lorem.paragraph()
      }

      try {
        const review = await payload.create({
          collection: 'reviews',
          data: {
            user: randomUser.id,
            movie: randomMovie.id,
            rating,
            content,
            createdAt: faker.date.between({ 
              from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 วันย้อนหลัง
              to: new Date() 
            })
          }
        })
        
        createdCount++
        payload.logger.info(`✅ สร้างรีวิวเรียบร้อย (${createdCount}/${reviewsToCreate}) - User: ${randomUser.email}, Movie: ${randomMovie.title}, Rating: ${rating}/10`)
      } catch (error) {
        payload.logger.error(`❌ เกิดข้อผิดพลาดในการสร้างรีวิว:`, error)
      }
    }

    payload.logger.info(`✅ สร้างรีวิวทั้งหมดเสร็จสิ้น (${createdCount} รีวิว)`)
  } catch (error) {
    payload.logger.error('❌ เกิดข้อผิดพลาดในการสร้างข้อมูลรีวิว:', error)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('🗑️ กำลังลบข้อมูลรีวิวทั้งหมด')

  try {
    // ดึงและลบรีวิวทั้งหมด (อาจจะต้องแบ่งเป็น batch หากมีจำนวนมาก)
    const { docs: reviews } = await payload.find({
      collection: 'reviews',
      limit: 100, // ปรับตามความเหมาะสม
    })

    for (const review of reviews) {
      await payload.delete({
        collection: 'reviews',
        id: review.id
      })
      payload.logger.info(`🗑️ ลบรีวิว ID: ${review.id} เรียบร้อยแล้ว`)
    }

    payload.logger.info('✅ ลบข้อมูลรีวิวเสร็จสิ้น')
  } catch (error) {
    payload.logger.error('❌ เกิดข้อผิดพลาดในการลบข้อมูลรีวิว:', error)
  }
}