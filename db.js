const spicedPg = require('spiced-pg');
var db = spicedPg('postgres:postgres:postgrespsql@localhost:5432/imageboard');
const s3 = require('./config.json')

// get images====================================================================
module.exports.getImages = () => {
  return db.query(`SELECT * FROM images`).then((results) => {
    results.rows.forEach((elem) => {
      elem.image = s3.s3Url + elem.image;
    })
    return results.rows;

  }).catch((err) => {
    console.log(err);
  });
};
// upload filename into DB =====================================================
module.exports.insertImage = (image, username, title, description) => {
  const query = 'INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4)'
  const params = [image, username, title, description]
  return db.query(query, params).then((results) => {
    return results.rows;
  }).catch((err) => {
    console.log(err)
  });
};
// single image function =======================================================
module.exports.getSingleImage = (id) => {
  return db.query(`SELECT image, username, title, description FROM images WHERE id = $1`, [id]).then((results) => {
    results.rows[0].image = s3.s3Url + results.rows[0].image;
    return results.rows[0].image
  }).catch((err) => {
    console.log(err);
  })
};
// GET COMMENTS=================================================================
module.exports.getComments = (id) => {
  console.log("myID", id);
  return db.query(`SELECT comment, author, created_at FROM comments WHERE imageId = $1 ORDER BY created_at DESC `, [id]).then((results) => {
    if (results.rows === undefined) {
      console.log("No comments")
    } else {
      return results.rows
    }
  }).catch((err) => {
    console.log(err);
  })
}
// insert comment into DB=======================================================

module.exports.insertComment = (imageId, comment, author) => {

  const query = 'INSERT INTO comments (imageId, comment, author) VALUES ($1, $2, $3)'
  const params = [imageId, comment, author]
  return db.query(query, params).then((results) => {
    return results.rows;
  }).catch((err) => {
    console.log(err)
  });
};


//
