import { prisma } from '../lib/prisma';

async function updateVariantNames() {
  console.log('Updating variant names to replace "Stuk" with "Pack"...\n');
  
  // Get all variants
  const variants = await prisma.productVariant.findMany();
  
  let updatedCount = 0;
  
  for (const variant of variants) {
    // Replace "Stuk" or "Stuks" with "Pack(s)"
    const newName = variant.name
      .replace(/(\d+)\s*[Ss]tuks?/g, (match: string, num: string) => `${num} Pack${parseInt(num) > 1 ? 's' : ''}`)
      .replace(/(\d+)\s*[Ss]tuk/g, (match: string, num: string) => `${num} Pack${parseInt(num) > 1 ? 's' : ''}`);
    
    if (newName !== variant.name) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { name: newName }
      });
      
      console.log(`Updated: "${variant.name}" → "${newName}"`);
      updatedCount++;
    }
  }
  
  console.log(`\nTotal variants updated: ${updatedCount}`);
  process.exit(0);
}

updateVariantNames().catch(console.error);