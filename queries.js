const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '******',
  port: 5432,
})

const getRooms = (request, response) => {
  const { price, type, braeakfast, pets, dateIn, dateOut } = request.query;
  let sql = 'SELECT * FROM room';

  if (price) {
    sql += ` WHERE price <= ${price}`;
  }
  if (type && type !== 'Все') {
    sql += ` AND type = '${type}'`;
  }
  if (braeakfast && braeakfast === 'true') {
    sql += ` AND braeakfast = true`;
  }
  if (pets && pets === 'true') {
    sql += ` AND pets = true`;
  }
  if (dateIn && dateIn !== 'undefined' && dateOut && dateOut !== 'undefined') {
      sql += ` AND id NOT IN (
        SELECT room_id
        FROM nonavailable
        WHERE date BETWEEN '${dateIn}' AND '${dateOut}'
      )`
  }
  sql += ';'
  console.log(sql);

  pool.query(sql, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRoomById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM room WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

function generateDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate < lastDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

const book = (request, response) => {
    const { roomId, dateIn, dateOut, fio, phone, email } = request.body;
  
    pool.query(`INSERT INTO booking (room_id, date_in, date_out, guest_name, phone, email) VALUES (${roomId}, '${dateIn}', '${dateOut}', '${fio}', '${phone}', '${email}')`, (error, results) => {
      if (error) {
        throw error;
      }
  
      // Добавление записей в таблицу nonavailable
      const dateRange = generateDateRange(dateIn, dateOut);
      const insertPromises = dateRange.map(date => {
        return new Promise((resolve, reject) => {
          pool.query(`INSERT INTO nonavailable (room_id, date) VALUES (${roomId}, '${date}')`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });
  
      Promise.all(insertPromises)
        .then(() => {
            response.status(201).send(`Бронирование успешно завершено`);
        })
        .catch(error => {
          throw error;
        });
    });
  };

module.exports = {
    getRooms,
    getRoomById,
    book
}