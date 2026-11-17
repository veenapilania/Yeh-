# Yeh! – Food Ordering Website

Yeh! is a responsive restaurant website built with HTML, CSS, and JavaScript. Visitors can explore the food menu, search and filter items, add food to a cart, and try a demo checkout flow.

## Live Demo

[View Yeh! Website](https://veenapilania.github.io/Yeh-/)

## Project Repository

[View Source Code on GitHub](https://github.com/veenapilania/Yeh-)

## Features

- Responsive layout for desktop, tablet, and mobile screens
- Home page with featured food items
- Food menu with category filters
- Search food items by name, description, or category
- Sort menu items by price or name
- Add food items to the shopping cart
- Increase or decrease item quantities
- Remove items from the cart
- Save cart and coupon details in browser `localStorage`
- Order summary with subtotal, discount, delivery fee, and total
- Promo code support:
  - `YEH10` – 10% off the food subtotal
  - `FEAST50` – ₹50 off when the food subtotal is at least ₹399
- Checkout form with browser-side validation
- Demo order confirmation message
- Contact form with browser-side validation
- Mobile navigation menu

## Technologies Used

- **HTML5** – website structure
- **CSS3** – styling and responsive layout
- **JavaScript** – menu, search, filters, cart, coupons, and form interactions
- **Google Fonts** – DM Sans and Outfit
- **Font Awesome 6.5.2** – icons
- **localStorage** – saves cart and coupon information in the browser

### External Resources

- Google Fonts: https://fonts.googleapis.com/
- Font Awesome: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css

This project uses vanilla JavaScript. It does not use a JavaScript framework, external API, or backend service.

## Website Pages

- `index.html` – home page
- `menu.html` – food menu, search, category filters, and sorting
- `about.html` – about page
- `checkout.html` – shopping cart, order summary, promo codes, and demo checkout
- `contact.html` – contact details and message form

## Project Structure

```text
Yeh-/
├── assets/
│   ├── background-images/
│   └── food-images/
├── css/
│   ├── responsive.css
│   └── style.css
├── js/
│   └── script.js
├── index.html
├── menu.html
├── about.html
├── checkout.html
└── contact.html
```

## Important Note

Yeh! is a front-end demo project.

- Checkout displays a demo order confirmation; it does not process real payments or send orders to a restaurant.
- The contact form checks the entered details in the browser. It is not connected to a backend and does not send messages.
- Cart and coupon details are stored in the browser using `localStorage`.

## Author

**Veena**

- GitHub: [veenapilania](https://github.com/veenapilania)
- Email: veenapilania29@gmail.com
