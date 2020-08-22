const db = require('./index')


const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool.query(`
  SELECT * 
  FROM users
  WHERE email = $1`, [email])
  .then(res => res.rows[0])
  .catch (err => null);

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  return pool.query(`
  SELECT * 
  FROM users
  WHERE id = $1`, [id])
  .then(res => res.rows[0])
  .catch (err => null);

}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *`, [user.name, user.email, user.password])
  .then(res => res.rows[0])
  .catch('Error adding user');
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  return pool.query(`
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2`, [guest_id, limit])
  .then(res => res.rows)
  .catch('Error accessing past reservations');

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  const queryParams = [];

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `; 

  let whereOptions = [];

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereOptions.push(`city LIKE $${queryParams.length}`);
  }

  // if (options.owner_id) {
  //   queryParams.push(`%${options.owner_id}%`);
  //   whereOptions.push(`properties.owner_id = $${queryParams.length} `);
  // }

  if (options.minimum_price_per_night) {
    const minCents = options.minimum_price_per_night * 100
    queryParams.push(`${minCents}`);
    whereOptions.push(`cost_per_night >= $${queryParams.length} `);
  }

  if (options.maximum_price_per_night ) {
    const maxCents = options.maximum_price_per_night * 100
    queryParams.push(`${maxCents}`);
    whereOptions.push(`cost_per_night <= $${queryParams.length} `);
  }

  const clause = function (whereOptions) {
    let where = `WHERE `;
    if (whereOptions.length > 0) {
      if (whereOptions.length === 1) {
        where += whereOptions[0];
        return where;
      } else {
        where += whereOptions[0];
        for (let i = 1; i < whereOptions.length; i++) {
          where += ` AND ${whereOptions[i]}`;
        }
        return where;
      } 
    }
  }

  if (clause(whereOptions)) {
    queryString += clause(whereOptions);
  }

  queryString += `
  GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then(res => res.rows)
  .catch('Unable to find matching properties');
  
  }
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  return pool.query(`
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night * 100, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
  .then(res => res.rows[0])
  .catch('Unable to add property');
}
exports.addProperty = addProperty;
