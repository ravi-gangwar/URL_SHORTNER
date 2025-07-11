# URL Shortener API

A robust URL shortening service built with Node.js, Express, and MongoDB. This application allows users to create short URLs, track analytics, and includes rate limiting for security.

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd URL-Shortner-master
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:5000
```

**For MongoDB Atlas users:**
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/url-shortener
BASE_URL=http://localhost:5000
```

### 4. Start the Application

**Development mode (with auto-restart):**
```bash
npm start
```

**Production mode:**
```bash
node index.js
```

The server will start on port 5000. You should see:
```
MongoDB connected
Server Started at PORT:5000
```

## API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Create Short URL
**POST** `/shorten`

Creates a new short URL from a long URL.

**Request Body:**
```json
{
  "url": "https://example.com/very-long-url-that-needs-shortening"
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:8001/abc123"
}
```

**Error Responses:**
- `400` - URL is required
- `400` - Invalid URL format
- `429` - Rate limit exceeded

#### 2. Redirect to Original URL
**GET** `/:code`

Redirects to the original URL using the short code.

**Response:**
- `302` - Redirects to original URL
- `400` - Short ID not found or URL expired

#### 3. Get Analytics
**GET** `/analytics/:code`

Returns analytics for a specific short URL.

**Response:**
```json
{
  "totalClicks": 42,
  "analytics": [
    {
      "timestamp": 1640995200000
    },
    {
      "timestamp": 1640995260000
    }
  ]
}
```

## Testing the API

### Using cURL

#### 1. Create a Short URL
```bash
curl -X POST http://localhost:5000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

#### 2. Test Redirect
```bash
curl -I http://localhost:5000/abc123
```

#### 3. Get Analytics
```bash
curl http://localhost:5000/analytics/abc123
```

### Using Postman

1. **Create Short URL:**
   - Method: `POST`
   - URL: `http://localhost:5000/shorten`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "url": "https://www.example.com"
   }
   ```

2. **Test Redirect:**
   - Method: `GET`
   - URL: `http://localhost:5000/{shortCode}`

3. **Get Analytics:**
   - Method: `GET`
   - URL: `http://localhost:5000/analytics/{shortCode}`

### Using Browser

1. **Create Short URL:**
   - Open browser developer tools
   - Go to Console tab
   - Run:
   ```javascript
   fetch('http://localhost:5000/shorten', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       url: 'https://www.google.com'
     })
   })
   .then(response => response.json())
   .then(data => console.log(data));
   ```

2. **Test Redirect:**
   - Simply visit `http://localhost:5000/{shortCode}` in your browser


## Features

- 🔗 **URL Shortening**: Convert long URLs to short, shareable links
- 📊 **Analytics**: Track click counts and visit history for each short URL
- ⏰ **Auto-expiration**: URLs automatically expire after 30 days
- 🛡️ **Rate Limiting**: Built-in protection against abuse (5 requests per minute per IP)
- ✅ **URL Validation**: Ensures only valid URLs are processed
- 🔄 **Duplicate Prevention**: Returns existing short URL if the same long URL is submitted

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **URL Generation**: ShortID library
- **Environment**: dotenv for configuration
- **Development**: Nodemon for auto-restart

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)

## Project Structure

```
URL-Shortner-master/
├── index.js                 # Main application entry point
├── package.json            # Dependencies and scripts
├── src/
│   ├── controllers/
│   │   └── url.js         # URL shortening logic
│   ├── db/
│   │   └── connect.js     # MongoDB connection
│   ├── middleware/
│   │   └── rateLimiter.js # Rate limiting middleware
│   ├── models/
│   │   └── url.js         # MongoDB schema
│   ├── routes/
│   │   └── url.js         # API routes
│   └── utils/
│       └── urlValidation.js # URL validation utility
```

## Database Schema

The application uses a MongoDB collection with the following schema:

```javascript
{
  shortId: String,        // Unique short identifier
  redirectURL: String,    // Original long URL
  visitHistory: [         // Array of visit timestamps
    {
      timestamp: Number
    }
  ],
  expiresAt: Date,        // Auto-expiration date (30 days)
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## Rate Limiting

The application implements rate limiting to prevent abuse:
- **Limit**: 5 requests per minute per IP address
- **Window**: 60 seconds
- **Response**: 429 status code with error message

## Error Handling

The application handles various error scenarios:
- Invalid URL format
- Missing required fields
- Non-existent short codes
- Expired URLs
- Rate limit violations
- Database connection issues

## Security Features

- **Input Validation**: All URLs are validated before processing
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Auto-expiration**: URLs automatically expire after 30 days
- **Duplicate Prevention**: Prevents creating multiple short URLs for the same long URL

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check if the MONGO_URI environment variable is set

2. **Port Already in Use**
   - Change the PORT variable in `index.js` or kill the process using port 8001

3. **Rate Limit Errors**
   - Wait for 60 seconds before making more requests
   - The limit is 5 requests per minute per IP

4. **Invalid URL Error**
   - Ensure the URL includes the protocol (http:// or https://)
   - Check that the URL is properly formatted

### Debug Mode

To run in debug mode, you can add console logs or use a debugger:

```bash
# Run with Node.js debugger
node --inspect index.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

**Ravi Gangwar**

---

For any questions or issues, please open an issue in the repository.
