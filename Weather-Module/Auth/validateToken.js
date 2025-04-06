import jwt from 'jsonwebtoken';

export async function isValidToken(token) {
      try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const ids = ["11000122005", "11000122004", "110001220010", "11000122050"]
            const dec = decoded.split('/');
            if (ids.includes(dec[1]))
                  return true;
            else
                  return false;
      } catch (error) {
            return false;
      }
}
