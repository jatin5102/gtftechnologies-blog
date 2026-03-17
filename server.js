const app = require('./src/app');
const PORT = process.env.PORT || 5000;
const { prisma } = require('./src/config/db');


async function startServer() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    console.log("✅ Database connected");

     app.listen(PORT, () => {
          console.log(`🚀 Server running on http://localhost:${PORT}`);
     });

  } catch (error) {
    console.error("❌ Database connection failed");
    // console.error(error);
    process.exit(1);
  }
}
startServer()