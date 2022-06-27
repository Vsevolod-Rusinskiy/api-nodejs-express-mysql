const QUERY = {
    SELECT_USERS: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10',
    SELECT_USER: 'SELECT * FROM users WHERE id = ?',
    CREATE_USER: 'INSERT INTO users(first_name, last_name, email, user_password, sex, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    UPDATE_USER: 'UPDATE users SET first_name = ?, last_name = ?, email = ?, user_password = ?, sex = ?, image_url = ? WHERE id = ?',
    DELETE_USER: 'DELETE FROM users WHERE id = ?',
    CREATE_USER_PROCEDURE: 'CALL create_and_return(?, ?, ?, ?, ?, ?)'
  };
  
  export default QUERY;