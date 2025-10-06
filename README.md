
# 🚗 Car Auction WebApp

A real-time car auction platform where users can register, list cars for auction, and place live bids with instant updates.



## 🧩 Features

- User Authentication (Signup with OTP verification via email)
- Post Auctions with car details and images
- Real-time Bidding using Socket.io
- Automatic winner declaration when auction ends
- User Dashboard – View your posted auctions and bids
- Image Uploads using Cloudinary
- Email Integration using Brevo SMTP


## 🛠 Tech Stack

**Client:** React, Vite, Zustand, TailwindCSS

**Server:** Node, Express, Socket.io

**Database:** MongoDB(Mongoose)

**Cloud & Email:** Cloudinary, Brevo (SendinBlue)

**Authentication:** JWT, Cookies

**Deployment:** Render, Vercel


## ⚙️ Installation

1. Clone the repository

```bash
  git clone https://github.com/Aanand-code/car-auction.git
```
2. Install dependencies
- Backend
```bash
    cd car-auction-backend
    npm install
```
- Frontend
```bash
    cd car-auction-frontend
    npm install
```
3. Setup environment variables
- Backend
```bash
PORT=7777

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=your_access_expiry_time
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=your_access_expiry_time

EMAIL_USER=your_brevo_email
EMAIL_PASS=your_brevo_api_key
VALID_EMAIL=your_brevo_valid_email
MY_BREVO_API_KEY=your_brevo_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key

MONGO_DB_URL=your_mongodb_URI

```
- Frontend
```bash
VITE_API_URL=http://localhost:7777/api/v1
VITE_SOCKET_URL=http://localhost:7777
```
4. Run the App
- Backend
```bash
    npm run dev
```
- Frontend
```bash
    npm run dev
```
5. Production build
- Frontend
```bash
    cd car-auction-frontend
    npm run build
```
    
## 🧠 Future Improvements
- Add payment integration for bidding fees
- Direct communication with winner and auctioneer

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to fork the repo and submit a PR.


## License

[MIT](https://choosealicense.com/licenses/mit/)

