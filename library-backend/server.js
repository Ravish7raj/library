const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection pool with additional configuration
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ravish',
  database: 'library',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  acquireTimeout: 30000,
  connectTimeout: 30000,
  debug: true
});

// Test database connection and create table if it doesn't exist
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
    return;
  }

  console.log('Successfully connected to MySQL database');

  // Create bookings table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_name VARCHAR(100) NOT NULL,
      mobile_number VARCHAR(15) NOT NULL,
      dob DATE NOT NULL,
      time_slots JSON NOT NULL,
      seat_number INT NOT NULL,
      facility_type ENUM('AC', 'NON-AC') NOT NULL,
      months INT NOT NULL,
      from_date DATE NOT NULL,
      to_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_mobile (mobile_number),
      INDEX idx_seat (seat_number),
      INDEX idx_dates (from_date, to_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  connection.query(createTableQuery, (tableErr) => {
    if (tableErr) {
      console.error('Error creating bookings table:', tableErr);
    } else {
      console.log('Bookings table ready');
    }
    connection.release();
  });
});

// Add pool error handler
db.on('error', (err) => {
  console.error('Unexpected database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
});

// Remove everything between here and the static files setup
// DELETE handleDisconnect function and its call
// DELETE the commented out db.connect block

// Serve static files from the Angular app
const angularPath = path.join(__dirname, '../library/dist/library/browser');
app.use(express.static(angularPath));

// Add error handling for static files
app.use((err, req, res, next) => {
  if (err) {
    console.error('Static file serving error:', err);
    res.status(500).send('Error loading application files');
  }
  next();
});

//API:Health check
// app.get('/', (req, res) => {
//     res.send('Library booking backend is running!');
//   });
  

// Handle booking form submission
app.post('/api/book-seat', (req, res) => {
    console.log('Received booking request:', req.body);
    
    const {
      studentName,
      mobileNumber,
      dateOfBirth,
      timeSlots,
      seatNumber,
      facilityType,
      months,
      fromDate,
      toDate,
      amount
    } = req.body;

    // Add input sanitization
    if (!/^[a-zA-Z\s]{2,50}$/.test(studentName)) {
      return res.status(400).json({
        message: 'Invalid student name',
        details: 'Name should only contain letters and spaces (2-50 characters)'
      });
    }

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        message: 'Invalid mobile number',
        details: 'Mobile number should be 10 digits'
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: 'Invalid amount',
        details: 'Amount must be a positive number'
      });
    }
    // Validate required fields
    if (!studentName || !mobileNumber || !dateOfBirth || !timeSlots || !seatNumber || !facilityType || !months || !fromDate || !toDate || !amount) {
      console.log('Missing required fields in request:', req.body);
      return res.status(400).json({ 
        message: 'All fields are required',
        details: 'Please fill in all required fields'
      });
    }

    // Validate timeSlots is an array
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      console.log('Invalid time slots format:', timeSlots);
      return res.status(400).json({ 
        message: 'Invalid time slots format',
        details: 'Please select at least one time slot'
      });
    }
  
    // First check if the seat and time slots are already booked
    const checkQuery = `
      SELECT * FROM bookings 
      WHERE seat_number = ? 
      AND facility_type = ?
      AND to_date >= CURDATE()
    `;
    
    console.log('Checking booking with params:', { seatNumber, facilityType, timeSlots });
    
    db.query(checkQuery, [seatNumber, facilityType], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking booking availability:', checkErr);
        return res.status(500).json({ 
          message: 'Error checking booking availability', 
          error: checkErr.message,
          details: 'Database error while checking seat availability'
        });
      }

      // Check if any of the time slots overlap with existing bookings for the same facility type
      const hasOverlap = checkResults.some(booking => {
        // Only check overlap if it's the same facility type
        if (booking.facility_type === facilityType) {
          const existingSlots = JSON.parse(booking.time_slots);
          return timeSlots.some(slot => existingSlots.includes(slot));
        }
        return false;
      });

      if (hasOverlap) {
        console.log('Seat already booked for some time slots in this facility type');
        return res.status(409).json({ 
          message: 'This seat is already booked for some of the selected time slots in this facility type',
          details: 'Please select a different seat or time slots'
        });
      }

      // If seat is available in this facility type, proceed with booking
      const insertQuery = `
        INSERT INTO bookings 
        (student_name, mobile_number, dob, time_slots, seat_number, facility_type, months, from_date, to_date, amount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    
      db.query(
        insertQuery,
        [studentName, mobileNumber, dateOfBirth, JSON.stringify(timeSlots), seatNumber, facilityType, months, fromDate, toDate, amount],
        (err, result) => {
          if (err) {
            console.error('Error inserting booking:', err);
            return res.status(500).json({ 
              message: 'Booking failed', 
              error: err.message,
              details: 'Error saving booking to database'
            });
          }
          
          console.log('Booking successful:', result);
          res.status(200).json({ 
            message: 'Booking successful', 
            bookingId: result.insertId,
            details: `Successfully booked seat ${seatNumber} in ${facilityType} facility`
          });
        }
      );
    });
});
  
// Get bookings for a user
app.get('/api/user-bookings', (req, res) => {
  const mobileNumber = req.query.mobile_number;
  
  if (!mobileNumber) {
    console.log('No mobile number provided in request');
    return res.status(400).json({ 
      error: 'Mobile number is required',
      message: 'Please provide a mobile number'
    });
  }

  console.log('Fetching bookings for mobile:', mobileNumber);
  
  const query = `
    SELECT * FROM bookings 
    WHERE mobile_number = ? 
    ORDER BY created_at DESC
  `;

  db.query(query, [mobileNumber], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch bookings',
        message: 'Error fetching bookings. Please try again.',
        details: error.message 
      });
    }

    // Always return a 200 status with results (empty array if no bookings)
    try {
      const bookings = results.map(booking => ({
        ...booking,
        time_slots: typeof booking.time_slots === 'string' 
          ? JSON.parse(booking.time_slots) 
          : (booking.time_slots || [])
      }));

      console.log('Successfully fetched bookings:', {
        mobileNumber,
        count: bookings.length,
        bookings: bookings
      });

      res.status(200).json(bookings);
    } catch (parseError) {
      console.error('Error parsing bookings data:', parseError);
      return res.status(500).json({
        error: 'Data processing error',
        message: 'Error processing booking data. Please try again.',
        details: parseError.message
      });
    }
  });
});

// Delete all bookings
app.delete('/api/delete-all-bookings', (req, res) => {
  const query = 'DELETE FROM bookings';
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error deleting bookings:', err);
      return res.status(500).json({ 
        message: 'Failed to delete bookings',
        error: err.message 
      });
    }
    
    console.log('All bookings deleted successfully:', result);
    res.json({ 
      message: 'All bookings deleted successfully',
      deletedCount: result.affectedRows 
    });
  });
});

// Get all active bookings for a facility type
app.get('/api/active-bookings', (req, res) => {
  const facilityType = req.query.facility_type;
  
  console.log('Received request for active bookings with facility type:', facilityType);
  
  if (!facilityType) {
    console.log('No facility type provided in request');
    return res.status(400).json({ 
      error: 'Facility type is required',
      message: 'Please provide a facility type'
    });
  }

  const query = `
    SELECT id, seat_number, time_slots, facility_type, student_name, mobile_number, to_date 
    FROM bookings 
    WHERE facility_type = ? 
    AND to_date >= CURDATE()
  `;

  console.log('Executing query:', query);
  console.log('With parameters:', [facilityType]);

  db.query(query, [facilityType], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch bookings',
        message: 'Error fetching bookings. Please try again.'
      });
    }

    console.log('Raw results from database:', results);

    try {
      const bookings = results.map(booking => {
        console.log('Processing booking:', booking);
        const processed = {
          ...booking,
          time_slots: typeof booking.time_slots === 'string' 
            ? JSON.parse(booking.time_slots) 
            : (booking.time_slots || [])
        };
        console.log('Processed booking:', processed);
        return processed;
      });

      console.log('Final processed bookings:', bookings);
      res.status(200).json(bookings);
    } catch (parseError) {
      console.error('Error parsing booking data:', parseError);
      return res.status(500).json({
        error: 'Data processing error',
        message: 'Error processing booking data'
      });
    }
  });
});

// Delete a specific booking
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  
  if (!bookingId) {
    return res.status(400).json({ 
      error: 'Booking ID is required',
      message: 'Please provide a booking ID'
    });
  }

  const query = 'DELETE FROM bookings WHERE id = ?';
  
  db.query(query, [bookingId], (error, result) => {
    if (error) {
      console.error('Error deleting booking:', error);
      return res.status(500).json({ 
        error: 'Failed to delete booking',
        message: 'Database error while deleting booking',
        details: error.message
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'No booking found with the provided ID'
      });
    }
    
    console.log('Booking deleted successfully:', bookingId);
    res.json({ 
      message: 'Booking deleted successfully',
      bookingId: bookingId
    });
  });
});

// Send all other requests to the Angular app
app.use((req, res) => {
  res.sendFile(path.join(angularPath, 'index.html'));
});

//Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server and database connection...');
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    }
    process.exit(err ? 1 : 0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  db.end(() => {
    process.exit(1);
  });
});
  