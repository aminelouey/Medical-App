const { sequelize, User } = require('./src/models');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Force recreation of tables

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await User.create({
            firstName: 'Administrateur',
            lastName: 'Principal',
            username: 'admin',
            email: 'admin@medical.com',
            password: hashedPassword,
            role: 'admin',
            fullName: 'Administrateur Principal'
        });

        console.log('✅ Base de données réinitialisée. Admin créé: admin@medical.com / admin123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur seed:', error);
        process.exit(1);
    }
}

seed();
