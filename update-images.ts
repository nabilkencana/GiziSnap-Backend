import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Daftar makanan spesifik dan link gambar barunya.
const specificImageUpdates: Record<string, string> = {
  'nasi goreng': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
  'nasi putih': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80',
  'ayam goreng': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
  'ayam bakar': 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80',
  'sate ayam': 'https://images.unsplash.com/photo-1605335559092-2821217fc5e5?auto=format&fit=crop&w=800&q=80',
  'rendang': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
  'soto ayam': 'https://images.unsplash.com/photo-1605050529884-28284566c5fa?auto=format&fit=crop&w=800&q=80',
  'bakso': 'https://images.unsplash.com/photo-1589301773822-2630e254ed32?auto=format&fit=crop&w=800&q=80',
  'mie goreng': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
  'gado-gado': 'https://images.unsplash.com/photo-1622312678683-29ecda213d2f?auto=format&fit=crop&w=800&q=80',
  'tempe goreng': 'https://images.unsplash.com/photo-1606335192038-f5a05f7e651e?auto=format&fit=crop&w=800&q=80',
  'tahu goreng': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'telur mata sapi': 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=800&q=80',
  'telur dadar': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
  'pecel lele': 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
  'nasi uduk': 'https://images.unsplash.com/photo-1626201889445-667dc9e93132?auto=format&fit=crop&w=800&q=80',
  'nasi padang': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  'sayur asem': 'https://images.unsplash.com/photo-1548943487-a2e4e43b4850?auto=format&fit=crop&w=800&q=80',
  'sayur sop': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  'sayur bayam': 'https://images.unsplash.com/photo-1598463293883-718228189851?auto=format&fit=crop&w=800&q=80',
  'rawon': 'https://images.unsplash.com/photo-1614777986387-015c2a89b696?auto=format&fit=crop&w=800&q=80',
  'gulai ayam': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  'opor ayam': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  'pempek': 'https://images.unsplash.com/photo-1541528659114-1e0e4b85ba72?auto=format&fit=crop&w=800&q=80',
  'siomay': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
  'batagor': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
  'kerupuk': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80',
  'kue tar': 'https://images.unsplash.com/photo-1578985545062-69928b1ea240?auto=format&fit=crop&w=800&q=80',
  'roti bakar': 'https://images.unsplash.com/photo-1525439504825-949e29a3a9ba?auto=format&fit=crop&w=800&q=80',
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  'es teh manis': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
  'es jeruk': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  'kopi susu': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
  'kopi hitam': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  'susu': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  'jus mangga': 'https://images.unsplash.com/photo-1623065422900-018226685822?auto=format&fit=crop&w=800&q=80',
  'jus alpukat': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  'air mineral': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
};

// Daftar gambar makanan umum yang berkualitas tinggi sebagai fallback (makanan Indonesia/Asia)
const genericFoodImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', // Nasi/Ayam
  'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80', // Dimsum
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', // Pancake/Roti
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', // Daging/Sate
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80', // Daging/Ayam
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80', // Pasta/Mie
  'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=800&q=80', // Sayuran/Salad
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', // Sup
  'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80', // Makanan ringan/Gorengan
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80'  // Kue/Dessert
];

async function main() {
  console.log('🔄 Memulai update 105+ gambar makanan secara massal...');
  let updatedCount = 0;

  // 1. Ambil semua data makanan dari database
  const allFoods = await prisma.food.findMany();
  console.log(`Menemukan ${allFoods.length} makanan di database.`);

  for (let i = 0; i < allFoods.length; i++) {
    const food = allFoods[i];
    const foodNameLower = food.name.toLowerCase();
    
    // 2. Cek apakah makanan ada di daftar spesifik
    let newImageUrl = specificImageUpdates[foodNameLower];

    // 3. Jika tidak ada di daftar spesifik, gunakan gambar generic secara bergiliran
    if (!newImageUrl) {
      // Gunakan modulo agar gambar generic terdistribusi rata
      newImageUrl = genericFoodImages[i % genericFoodImages.length];
    }

    // 4. Update ke database jika gambar saat ini berbeda
    if (food.imageUrl !== newImageUrl) {
      await prisma.food.update({
        where: { id: food.id },
        data: { imageUrl: newImageUrl }
      });
      updatedCount++;
      console.log(`✅ Diperbarui: ${food.name}`);
    } else {
      console.log(`⏩ Dilewati (Gambar sudah sesuai): ${food.name}`);
    }
  }

  console.log('==============================================');
  console.log(`🎉 Selesai! Berhasil meng-update ${updatedCount} gambar makanan.`);
  console.log('==============================================');
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
