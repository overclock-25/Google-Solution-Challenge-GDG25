import jwt from 'jsonwebtoken';

// Function to create a new JWT token
export async function createToken(payload) {
      try {
            console.log(payload)
            const token = jwt.sign(
                  payload,
                  process.env.JWT_SECRET,
            );

            return token;
      } catch (e) {
            return e;
      }
}
