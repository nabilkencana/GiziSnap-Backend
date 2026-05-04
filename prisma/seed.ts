import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const FOODS = [
  // Nasi & Karbohidrat
  { name: 'Nasi Putih', calories: 204, protein: 4.2, carbs: 44.5, fat: 0.4 },
  { name: 'Nasi Goreng', calories: 338, protein: 9.9, carbs: 47.5, fat: 11.9 },
  { name: 'Nasi Uduk', calories: 290, protein: 5.0, carbs: 48.0, fat: 9.0 },
  { name: 'Nasi Kuning', calories: 240, protein: 4.0, carbs: 48.0, fat: 4.0 },
  { name: 'Nasi Padang', calories: 680, protein: 28.0, carbs: 82.0, fat: 22.0 },
  { name: 'Ketupat', calories: 150, protein: 2.8, carbs: 33.0, fat: 0.3 },
  { name: 'Lontong', calories: 160, protein: 2.5, carbs: 35.0, fat: 0.5 },

  // Mi & Mie
  { name: 'Mie Goreng', calories: 345, protein: 10.0, carbs: 46.0, fat: 13.0 },
  { name: 'Mie Rebus', calories: 280, protein: 8.0, carbs: 50.0, fat: 6.0 },
  { name: 'Mie Ayam', calories: 320, protein: 14.0, carbs: 42.0, fat: 10.0 },
  { name: 'Bihun Goreng', calories: 310, protein: 7.5, carbs: 50.0, fat: 9.5 },
  { name: 'Kwetiau Goreng', calories: 330, protein: 10.0, carbs: 52.0, fat: 9.0 },
  { name: 'Indomie Goreng', calories: 390, protein: 8.0, carbs: 55.0, fat: 14.0 },
  { name: 'Indomie Kuah', calories: 330, protein: 7.0, carbs: 52.0, fat: 10.0 },

  // Ayam
  { name: 'Ayam Goreng', calories: 260, protein: 27.0, carbs: 8.0, fat: 14.0 },
  { name: 'Ayam Bakar', calories: 175, protein: 28.0, carbs: 2.0, fat: 6.0 },
  { name: 'Ayam Suwir', calories: 185, protein: 24.0, carbs: 3.0, fat: 8.0 },
  { name: 'Opor Ayam', calories: 310, protein: 22.0, carbs: 8.0, fat: 22.0 },
  { name: 'Soto Ayam', calories: 250, protein: 20.0, carbs: 20.0, fat: 10.0 },
  { name: 'Bubur Ayam', calories: 255, protein: 14.0, carbs: 32.0, fat: 8.0 },

  // Daging
  { name: 'Rendang Sapi', calories: 195, protein: 15.0, carbs: 5.0, fat: 13.0 },
  { name: 'Rawon', calories: 320, protein: 22.0, carbs: 15.0, fat: 20.0 },
  { name: 'Sop Buntut', calories: 380, protein: 25.0, carbs: 12.0, fat: 26.0 },
  { name: 'Sate Ayam', calories: 220, protein: 18.0, carbs: 12.0, fat: 11.0 },
  { name: 'Sate Kambing', calories: 250, protein: 20.0, carbs: 6.0, fat: 16.0 },
  { name: 'Bakso', calories: 295, protein: 18.0, carbs: 28.0, fat: 12.0 },

  // Tahu & Tempe
  { name: 'Tempe Goreng', calories: 220, protein: 12.0, carbs: 14.0, fat: 13.0 },
  { name: 'Tempe Bacem', calories: 165, protein: 10.0, carbs: 16.0, fat: 7.0 },
  { name: 'Tahu Goreng', calories: 130, protein: 9.0, carbs: 5.0, fat: 9.0 },
  { name: 'Tahu Bacem', calories: 100, protein: 8.0, carbs: 7.0, fat: 4.0 },

  // Sayur & Lauk
  { name: 'Gado-gado', calories: 380, protein: 15.0, carbs: 35.0, fat: 22.0 },
  { name: 'Pecel', calories: 295, protein: 13.0, carbs: 30.0, fat: 15.0 },
  { name: 'Ketoprak', calories: 340, protein: 12.0, carbs: 48.0, fat: 12.0 },
  { name: 'Cap Cay', calories: 120, protein: 8.0, carbs: 12.0, fat: 5.0 },
  { name: 'Sayur Asem', calories: 85, protein: 4.0, carbs: 14.0, fat: 2.0 },
  { name: 'Kangkung Cah', calories: 75, protein: 4.0, carbs: 8.0, fat: 3.5 },

  // Gorengan & Snack
  { name: 'Siomay', calories: 240, protein: 14.0, carbs: 28.0, fat: 8.0 },
  { name: 'Batagor', calories: 280, protein: 12.0, carbs: 24.0, fat: 15.0 },
  { name: 'Martabak Telur', calories: 320, protein: 14.0, carbs: 30.0, fat: 17.0 },
  { name: 'Martabak Manis', calories: 285, protein: 5.0, carbs: 42.0, fat: 11.0 },
  { name: 'Pisang Goreng', calories: 160, protein: 1.5, carbs: 29.0, fat: 5.0 },
  { name: 'Risoles', calories: 185, protein: 7.0, carbs: 22.0, fat: 8.5 },
  { name: 'Pempek', calories: 200, protein: 12.0, carbs: 28.0, fat: 5.0 },
  { name: 'Kerupuk', calories: 50, protein: 1.0, carbs: 8.0, fat: 1.5 },

  // Telur
  { name: 'Telor Goreng', calories: 90, protein: 6.3, carbs: 0.4, fat: 7.0 },
  { name: 'Telor Rebus', calories: 75, protein: 6.3, carbs: 0.6, fat: 5.0 },
  { name: 'Telor Dadar', calories: 185, protein: 12.0, carbs: 1.0, fat: 14.0 },
  { name: 'Telor Ceplok', calories: 90, protein: 6.5, carbs: 0.3, fat: 7.2 },

  // Buah
  { name: 'Pisang Ambon', calories: 90, protein: 1.1, carbs: 23.0, fat: 0.3 },
  { name: 'Semangka', calories: 30, protein: 0.6, carbs: 8.0, fat: 0.2 },
  { name: 'Pepaya', calories: 43, protein: 0.5, carbs: 11.0, fat: 0.3 },
  { name: 'Mangga Harum Manis', calories: 65, protein: 0.6, carbs: 17.0, fat: 0.3 },
  { name: 'Jeruk Siam', calories: 50, protein: 0.9, carbs: 12.0, fat: 0.2 },
  { name: 'Apel Fuji', calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2 },

  // Minuman
  { name: 'Es Teh Manis', calories: 90, protein: 0.0, carbs: 23.0, fat: 0.0 },
  { name: 'Jus Alpukat', calories: 245, protein: 2.0, carbs: 22.0, fat: 17.0 },
  { name: 'Kopi Susu', calories: 120, protein: 3.0, carbs: 15.0, fat: 5.0 },
  { name: 'Es Jeruk', calories: 65, protein: 0.5, carbs: 17.0, fat: 0.2 },
  { name: 'Susu Sapi', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: 'Teh Tarik', calories: 105, protein: 2.5, carbs: 18.0, fat: 3.0 },
];

async function main() {
  console.log('🌱 Mulai seeding data makanan Indonesia...');

  let created = 0;
  for (const food of FOODS) {
    const existing = await prisma.food.findFirst({
      where: { name: { equals: food.name, mode: 'insensitive' } },
    });
    if (!existing) {
      await prisma.food.create({
        data: {
          ...food,
          isVerified: true,
          upvotes: Math.floor(Math.random() * 20) + 5,
        },
      });
      created++;
      console.log(`  ✅ ${food.name}`);
    } else {
      console.log(`  ⏭️  ${food.name} (sudah ada)`);
    }
  }

  console.log(`\n✨ Seeding selesai! ${created} makanan ditambahkan.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
