export default class Auth {

  setSession = (token) => {
    localStorage.setItem('access_token', token);
  }

  logout = () => {
    localStorage.removeItem('access_token');
  }

  getToken = () => {
    let token = localStorage.getItem('access_token');
    console.log("token", token)
    return token
  }
}
