describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('https://elaine-ch.github.io/Lab6_Part1_Starter/');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    // Query select all of the <product-item> elements
    const allArePopulated= await page.$$eval('product-item', prodItems => {
      return prodItems.every(item => {
        const data = item.data;
        return data && data.title && data.title.length > 0 && 
               data.price && data.price > 0 && 
               data.image && data.image.length > 0;
      });
    });
    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const product = await page.$('product-item');
    const shadowRoot = (await product.getProperty('shadowRoot')).asElement();
    const button = await shadowRoot.$("button");
    await button.click();
    const buttonTextJSHandle = await button.getProperty('innerText');
    const buttonText = await buttonTextJSHandle.jsonValue();
    expect(buttonText).toBe('Remove from Cart');
    await button.click(); // Undo adding to cart
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    const items = await page.$$('product-item');
    for (let item of items) {
      const shadowRoot = (await item.getProperty('shadowRoot')).asElement();
      let button = await shadowRoot.$('button');
      await button.click();
    }
    const countElement = await page.$('#cart-count');
    const countElementJSHandle = await countElement.getProperty('innerText');
    const countText = await countElementJSHandle.jsonValue();
    expect(countText).toBe('20');
  }, 50000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const items = await page.$$('product-item');
    for (let item of items) {
      const shadowRoot = (await item.getProperty('shadowRoot')).asElement();
      let button = await shadowRoot.$('button');
      const buttonTextJSHandle = await button.getProperty('innerText');
      const buttonText = await buttonTextJSHandle.jsonValue();
      expect(buttonText).toBe('Remove from Cart');
    }
    const countElement = await page.$('#cart-count');
    const countElementJSHandle = await countElement.getProperty('innerText');
    const countText = await countElementJSHandle.jsonValue();
    expect(countText).toBe('20');
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    const items = await page.$$('product-item');
    for (let item of items) {
      const shadowRoot = (await item.getProperty('shadowRoot')).asElement();
      let button = await shadowRoot.$('button');
      const buttonTextJSHandle = await button.getProperty('innerText');
      const buttonText = await buttonTextJSHandle.jsonValue();
      expect(buttonText).toBe('Remove from Cart');
      await button.click();
    }
    const countElement = await page.$('#cart-count');
    const countElementJSHandle = await countElement.getProperty('innerText');
    const countText = await countElementJSHandle.jsonValue();
    expect(countText).toBe('0');
  }, 50000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const items = await page.$$('product-item');
    for (let item of items) {
      const shadowRoot = (await item.getProperty('shadowRoot')).asElement();
      let button = await shadowRoot.$('button');
      const buttonTextJSHandle = await button.getProperty('innerText');
      const buttonText = await buttonTextJSHandle.jsonValue();
      expect(buttonText).toBe('Add to Cart');
    }
    const countElement = await page.$('#cart-count');
    const countElementJSHandle = await countElement.getProperty('innerText');
    const countText = await countElementJSHandle.jsonValue();
    expect(countText).toBe('0');
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});
