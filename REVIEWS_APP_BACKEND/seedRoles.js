require('dotenv').config({ path: './backend/.env' });
const db = require('./models');
const Role = db.Role;

const roles = ['System Administrator', 'Normal User', 'Store Owner'];

async function seedRoles() {
    try {
        await db.sequelize.sync({ force: false });
        for (const roleName of roles) {
            const [role, created] = await Role.findOrCreate({
                where: { name: roleName },
            });
            if (created) {
                console.log(`Role '${roleName}' created.`);
            } else {
                console.log(`Role '${roleName}' already exists.`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
}

seedRoles();
