const { sequelize, User } = require('./src/models');
const bcrypt = require('bcrypt');

async function seed() {
    await sequelize.sync();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    try {
        const [user, created] = await User.findOrCreate({
            where: { email: 'admin@medical.com' },
            defaults: {
                username: 'admin',
                password: hashedPassword,
                fullName: 'Administrateur Principal',
                role: 'admin'
            }
        });

        if (created) {
            console.log('✅ Default admin created: admin@medical.com / admin123');
        } else {
            console.log('ℹ️ Admin already exists');
        }
    } catch (err) {
        console.error('❌ Seed failed:', err);
    }
}

seed();
