// /config/db.config.js
module.exports = {
  HOST: "localhost", // Địa chỉ MySQL server
  USER: "root",      // User MySQL của bạn
  PASSWORD: "", 
  DB: "duan2",    
  dialect: "mysql",
  pool: { // Tùy chọn: Cấu hình connection pool
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};