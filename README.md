# Burger Bliss
**Built using React, CSS, Node.js, Express, and MySQL.**

**Overview:**
Burger Bliss is a comprehensive burger website designed to cater to both customers and employees.

**For Customers:**
- **User-Friendly Cart Management:** Customers can easily add or remove food items from their cart, with a real-time count displayed for each item.
- **Checkout:** When ready to place their order, customers can proceed to the checkout page. Here, they can review their selections, prices, and make any last-minute adjustments.
- **Checkout Form:** Our checkout form allows customers to provide essential details, including their email, phone number, and preferred pickup time.
- **Order Confirmation:** After submitting their order, customers receive a prompt email confirmation containing all the specifics of their order and pickup time.

**For Admins/Employees:**
- **Admin Notifications:** The moment an order is placed, our system notifies the admin panel with a distinct sound, ensuring prompt attention to new orders.
- **JWT Authentication:** Our admin dashboard is protected by JWT authentication, providing a secure environment for employees to manage operations.
- **Live Order Tracking:** The dashboard showcases live orders without the need to refresh, allowing employees to track and manage incoming requests efficiently.
- **Menu and Food Categories Modifications:** Employees can easily view and modify the menu and food categories, ensuring an up-to-date and well-organized selection displayed to customers.
- **Customer Feedback:** The website includes a Contact Us section where the restaurant can gather valuable insights and respond to customer reviews.

**Infrastructure:**
- **Database:** MySQL database on AWS through RDS, ensuring data integrity, reliability, and scalability.
- **Server Deployment:** The Node.js Express server is deployed on AWS EC2, guaranteeing consistent performance and availability.
