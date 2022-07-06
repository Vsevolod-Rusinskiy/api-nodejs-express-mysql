const QUERY = {
    // SELECT_USERS: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10',
    SELECT_USER: 'SELECT * FROM users WHERE id = ?',
    SELECT_USER_EMAIL: 'SELECT * FROM users WHERE email = ?',
    UPDATE_USER: 'UPDATE users SET first_name = ?, last_name = ?, email = ?, sex = ?, image_url = ? WHERE id = ?',
    CREATE_USER_PROCEDURE: 'CALL create_and_return(?, ?, ?, ?, ?, ?)'
  };
  
  export default QUERY;