import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // สร้าง admin user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'adminpassword',
      },
    })
    payload.logger.info('✓ Admin user created successfully')
  } catch (error) {
    payload.logger.error('Error creating admin user (might already exist):', error)
  }

  // สร้าง test users (test1-test5)
  for (let i = 1; i <= 5; i++) {
    try {
      await payload.create({
        collection: 'users',
        data: {
          email: `test${i}@example.com`,
          password: '1234',
        },
      })
      payload.logger.info(`✓ Test user ${i} created successfully (test${i}@example.com)`)
    } catch (error) {
      payload.logger.error(`Error creating test user ${i} (might already exist):`, error)
    }
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // ลบ users ที่สร้างขึ้น (ถ้าต้องการ)
  const emailsToDelete = [
    'admin@example.com',
    'test1@example.com', 
    'test2@example.com', 
    'test3@example.com',
    'test4@example.com',
    'test5@example.com'
  ]
  
  for (const email of emailsToDelete) {
    try {
      const { docs: users } = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
      })
      
      if (users.length > 0) {
        await payload.delete({
          collection: 'users',
          id: users[0].id,
        })
        payload.logger.info(`User ${email} deleted`)
      }
    } catch (error) {
      payload.logger.error(`Error deleting user ${email}:`, error)
    }
  }
}