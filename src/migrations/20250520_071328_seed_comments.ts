import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { faker } from '@faker-js/faker'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('💬 เริ่มต้นการสร้างข้อมูลคอมเมนต์ด้วย Faker')

  try {
    // ดึงข้อมูล users และ reviews ที่มีอยู่ในระบบ
    const { docs: users } = await payload.find({
      collection: 'users',
      limit: 100,
    })

    const { docs: reviews } = await payload.find({
      collection: 'reviews',
      limit: 100,
    })

    if (users.length === 0 || reviews.length === 0) {
      payload.logger.warn('⚠️ ไม่พบข้อมูลผู้ใช้หรือรีวิว กรุณาสร้างข้อมูลเหล่านี้ก่อนสร้างคอมเมนต์')
      return
    }

    payload.logger.info(`พบผู้ใช้ ${users.length} คน และรีวิว ${reviews.length} รายการ`)

    // สุ่มจำนวนคอมเมนต์ต่อรีวิว
    let totalComments = 0
    
    for (const review of reviews) {
      // สุ่มว่ารีวิวนี้จะมีคอมเมนต์หรือไม่และมีกี่คอมเมนต์
      const commentCount = faker.number.int({ min: 0, max: 5 }) // สุ่มว่าจะมี 0-5 คอมเมนต์
      
      if (commentCount > 0) {
        payload.logger.info(`กำลังสร้าง ${commentCount} คอมเมนต์สำหรับรีวิว ID: ${review.id}`)
        
        for (let i = 0; i < commentCount; i++) {
          // เลือก user แบบสุ่ม (อาจเป็นคนเดียวกับผู้รีวิวหรือไม่ก็ได้)
          const randomUser = faker.helpers.arrayElement(users)
          
          // สร้างเนื้อหาคอมเมนต์
          const content = faker.helpers.arrayElement([
            faker.lorem.sentence(),
            `${faker.word.adjective()} review!`,
            faker.lorem.paragraph(faker.number.int({ min: 1, max: 3 })),
            `I ${faker.helpers.arrayElement(['agree', 'disagree', 'partially agree'])} with this review.`,
            `This movie was ${faker.word.adjective()} indeed!`,
            `Have you seen the ${faker.word.adjective()} sequel?`,
            faker.lorem.sentences(faker.number.int({ min: 1, max: 4 }))
          ])

          try {
            await payload.create({
              collection: 'comments',
              data: {
                user: randomUser.id,
                review: review.id,
                content,
                createdAt: faker.date.recent({ days: 30 })
              }
            })
            
            totalComments++
            payload.logger.info(`✅ สร้างคอมเมนต์ที่ ${i + 1} สำหรับรีวิว ID: ${review.id} เรียบร้อย`)
          } catch (error) {
            payload.logger.error(`❌ เกิดข้อผิดพลาดในการสร้างคอมเมนต์:`, error)
          }
        }
      }
    }

    payload.logger.info(`✅ สร้างคอมเมนต์ทั้งหมดเสร็จสิ้น (รวม ${totalComments} คอมเมนต์)`)
  } catch (error) {
    payload.logger.error('❌ เกิดข้อผิดพลาดในการสร้างข้อมูลคอมเมนต์:', error)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('🗑️ กำลังลบข้อมูลคอมเมนต์ทั้งหมด')

  try {
    // ดึงและลบคอมเมนต์ทั้งหมด
    const { docs: comments } = await payload.find({
      collection: 'comments',
      limit: 100, // ปรับตามความเหมาะสม
    })

    for (const comment of comments) {
      await payload.delete({
        collection: 'comments',
        id: comment.id
      })
      payload.logger.info(`🗑️ ลบคอมเมนต์ ID: ${comment.id} เรียบร้อยแล้ว`)
    }

    payload.logger.info('✅ ลบข้อมูลคอมเมนต์เสร็จสิ้น')
  } catch (error) {
    payload.logger.error('❌ เกิดข้อผิดพลาดในการลบข้อมูลคอมเมนต์:', error)
  }
}