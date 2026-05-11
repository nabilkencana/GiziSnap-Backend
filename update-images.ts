import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Daftar makanan spesifik dan link gambar barunya.
const specificImageUpdates: Record<string, string> = {
  'nasi goreng': 'https://delishglobe.com/wp-content/uploads/2024/12/Nasi-Goreng-Fried-Rice.png',
  'nasi putih': 'https://thfvnext.bing.com/th/id/OIP.OJ2pGhBzT9FR_Wf66kpsIQHaG1?r=0&o=7&cb=thfvnextrm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
  'ayam goreng': 'https://res.cloudinary.com/dv5f4i7e4/image/upload/v1746724383/foods/ayam_goreng_v2py92.jpg',
  'ayam bakar': 'https://cdn1-production-images-kly.akamaized.net/CxsVvoie2sxDAneoE6Bt2i_MeDM=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3504606/original/071054100_1625722566-1114926-1000xauto-14-resep-cara-membuat-ayam-bakar.jpg',
  'sate ayam': 'https://www.rumahmesin.com/wp-content/uploads/2017/03/resep-sate-ayam-madura-mencicipi-makanan-asli-indonesia-yang-mendunia.jpg',
  'rendang': 'https://www.elmundoeats.com/wp-content/uploads/2023/04/A-bowl-of-beef-rendang.jpg',
  'soto ayam': 'https://icone-inc.org/wp-content/uploads/2018/11/Soto-Ayam-2-micita-1200x1189.jpeg',
  'bakso': 'https://th.bing.com/th/id/R.56ebf5c2f1a8cccd389989093e11159e?rik=K1EZwzD4bJNJOg&riu=http%3a%2f%2fwww.indofoodstore.com%2fimages%2fBakso.jpg&ehk=F1QAEXBd5nseWVO5hAjuDT%2bPg1Wvl6qDAEHE2QQJ5Zw%3d&risl=&pid=ImgRaw&r=0',
  'mie goreng': 'https://th.bing.com/th/id/R.ffdb584967c6c9d82c799d29347e2e6d?rik=10dftgBlbjl8iA&riu=http%3a%2f%2f3.bp.blogspot.com%2f-uw1c7F4SyRk%2fUuEKCpR4fbI%2fAAAAAAAABDk%2f4Vsv-2vnQHM%2fs1600%2ffried%2bnoodles%2b(%2bmie%2bgoreng%2b)%2bindonesian%2brecipes.jpg&ehk=aqUqXZc5LrmERF07IJiyoPzSmhMuZeCk37c8bRIfzIM%3d&risl=&pid=ImgRaw&r=0',
  'gado-gado': 'https://i0.wp.com/resepkoki.id/wp-content/uploads/2017/02/Resep-Gado-Gado.jpg?fit=2461%2C2359&ssl=1',
  'tempe goreng': 'https://asset.kompas.com/crops/TZmsk7G1DdOaRfrE8nudW6V6Ji0=/0x0:1000x667/1200x800/data/photo/2023/04/27/6449d3bbb940a.jpg',
  'tahu goreng': 'https://img.magnific.com/premium-photo/tahu-goreng-fried-tofu-indonesia-traditional-food-made-from-fermented-soybean-extract_583400-5221.jpg?w=2000',
  'telur mata sapi': 'https://asset.kompas.com/crops/8vH2_UsvS4K2XhT0ovE37vkWD8s=/0x7:1000x674/750x500/data/photo/2023/11/15/65543ca0899f1.jpeg',
  'telur dadar': 'https://img-global.cpcdn.com/recipes/732534c865a294f6/1200x630cq70/photo.jpg',
  'pecel lele': 'https://asset.kompas.com/crops/EX6CU4GKK4ZvoqMgzwH5qeQPe9U=/0x1638:3376x3888/1200x800/data/photo/2022/12/05/638d95f329abe.jpg',
  'nasi uduk': 'https://tse3.mm.bing.net/th/id/OIP.M_-ioZIExM5wUduCzTgy4AHaHa?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3',
  'nasi padang': 'https://thfvnext.bing.com/th/id/OIP.U3xWN9vujkHg6hNBI3VNPAHaFj?w=240&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'sayur asem': 'https://thfvnext.bing.com/th/id/OIP.S2JmSQ5KWUUmp80F8oUOHwHaHa?w=163&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'sayur sop': 'https://thfvnext.bing.com/th/id/OIP.ciSO3-DP-TEBg3lbysDufgHaEK?w=294&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'sayur bayam': 'https://thfvnext.bing.com/th/id/OIP.5I7RSbwkaMcIseh18LwrrQHaIZ?w=147&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'rawon': 'https://www.bing.com/th/id/OIP.xBskJ3xBdohy56vUyjJgGgHaE8?w=258&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
  'gulai ayam': 'https://thfvnext.bing.com/th/id/OIP.t4roUePM9FCWkNIh-FOyWQHaE8?w=298&h=199&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'opor ayam': 'https://thfvnext.bing.com/th/id/OIP.I6aLxFNepcu_4jj_iiGoSAHaE8?w=278&h=185&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'pempek': 'https://thfvnext.bing.com/th/id/OIP.Pq_1FAXQ2mshx3n0ERNaBgHaFS?w=273&h=195&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'siomay': 'https://cdn0-production-images-kly.akamaized.net/ineYGN1ofC14lFFtuE5QVnjmxW8=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/2834715/original/082188900_1561183059-shutterstock_1134726890.jpg',
  'batagor': 'https://tse2.mm.bing.net/th/id/OIP.SwRZJQCtjzt3WmuvnQQSUAHaF7?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3',
  'kerupuk': 'https://assets.pikiran-rakyat.com/crop/0x0:0x0/1200x675/photo/2024/10/31/3058660474.jpg',
  'kue tar': 'https://thfvnext.bing.com/th/id/OIP.P3cxjtgdE6ZwLPUfZKHs5AHaFj?w=209&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'roti bakar': 'https://thfvnext.bing.com/th/id/OIP.CzGQ8ReC1_SH9NGN7h7S0wHaFj?w=237&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'pizza': 'https://thfvnext.bing.com/th/id/OIP.T03aJagv5g4JwoG0Di4gFwHaEb?w=323&h=193&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'burger': 'https://thfvnext.bing.com/th/id/OIP.S1c0W6K27wo8GqdkFKhRVgHaHc?w=192&h=193&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'es teh manis': 'https://thfvnext.bing.com/th/id/OIP.qlDtVWjb1aaflQkt4PysuQHaJQ?w=145&h=181&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'es jeruk': 'https://thfvnext.bing.com/th/id/OIP._nzjdb2k6-y-8vCUa99ZEAHaHa?w=185&h=185&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'kopi susu': 'https://thfvnext.bing.com/th/id/OIP.an35ipyvW4mucb-DNuJe_QHaHX?w=199&h=198&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'kopi hitam': 'https://ciputrahospital.com/wp-content/uploads/2025/08/Manfaat-kopi-hitam-tanpa-gula-scaled.jpg',
  'susu': 'https://thfvnext.bing.com/th/id/OIP.sO-Y7qsKJ-xyA5tKSh0DKAHaEK?w=291&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'jus mangga': 'https://thfvnext.bing.com/th/id/OIP.kACXG59w5HZ7DOgxbgFrfwHaJH?r=0&o=7&cb=thfvnextrm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
  'jus alpukat': 'https://thfvnext.bing.com/th/id/OIP.YtWZwThHkhN7vpEzjW0NtAHaHa?w=140&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
  'air mineral': 'https://thfvnext.bing.com/th/id/OIP.I0cixlzr7WclFvjB2WWdPwHaHa?w=172&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
};

// Daftar gambar makanan umum yang berkualitas tinggi sebagai fallback (makanan Indonesia/Asia)
const genericFoodImages = [
  '', // Nasi/Ayam
  '', // Dimsum
  '', // Pancake/Roti
  '', // Daging/Sate
  '', // Daging/Ayam
  '', // Pasta/Mie
  '', // Sayuran/Salad
  '', // Sup
  '', // Makanan ringan/Gorengan
  ''  // Kue/Dessert
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
