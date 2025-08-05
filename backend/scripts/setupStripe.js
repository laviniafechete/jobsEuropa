import stripePackage from 'stripe';
import config from '../config.js';

const stripe = stripePackage(config.stripeSecretKey);

async function setupStripeProducts() {
  try {
    console.log('🔧 Setting up Stripe products and prices...');

    // Create products
    const products = [
      {
        name: 'JobsEuropa Basic Plan',
        description: '5 anunțuri (vizibilitate 30 zile), contact direct, statistici de bază, acces la toți candidații, suport',
        price: 4999, // $49.99 in cents
        interval: 'month'
      },
      {
        name: 'JobsEuropa Premium Plan',
        description: 'Anunțuri nelimitate (vizibilitate 30 zile), contact direct, statistici extinse, acces la toți candidații, suport prioritar',
        price: 14999, // $149.99 in cents
        interval: 'month'
      },
      {
        name: 'JobsEuropa Single Ad',
        description: '1 anunț (vizibilitate 30 zile), contact direct, statistici de bază',
        price: 1499, // $14.99 in cents
        interval: 'one_time'
      },
      {
        name: 'JobsEuropa Promotion',
        description: 'Card special și printre primele joburi, postare social media în 48h',
        price: 999, // $9.99 in cents
        interval: 'one_time'
      }
    ];

    for (const productData of products) {
      // Create product
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description
      });

      console.log(`✅ Created product: ${product.name} (${product.id})`);

      // Create price
      const priceData = {
        product: product.id,
        currency: 'usd',
        unit_amount: productData.price
      };

      if (productData.interval === 'month') {
        priceData.recurring = { interval: 'month' };
      }

      const price = await stripe.prices.create(priceData);
      console.log(`✅ Created price: ${price.id} - $${(productData.price / 100).toFixed(2)}`);

      // Update the price ID in the frontend
      console.log(`📝 Update this price ID in src/pages/employer/EmployerHome.tsx:`);
      console.log(`   ${productData.name}: ${price.id}`);
    }

    console.log('\n🎉 Stripe setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Update price IDs in src/pages/employer/EmployerHome.tsx');
    console.log('2. Update price IDs in src/pages/employer/PostJobForm.tsx');
    console.log('3. Test payment flow');

  } catch (error) {
    console.error('❌ Error setting up Stripe:', error);
  }
}

setupStripeProducts(); 