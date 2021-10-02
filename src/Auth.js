export default class Auth {

  setSession = (token, user) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', user);
  }

  setRealmUser = (realmUser) => {
    console.log("setting realm user. Logged in, but now the user is set: ", realmUser.id)
    localStorage.setItem('realm_user', realmUser.id);
  }

  getRealmUser = () => {
    console.log("getting the realm user")
    let user = localStorage.getItem('realm_user');
  }

  setToken = (token) => {
    localStorage.setItem('access_token', token);
  }

  logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getToken = () => {
    let token = localStorage.getItem('access_token');
    return token
  }

  getUser = () => {
    let user = localStorage.getItem('user');
    return user
  }

  validateCredentials = (email, password) => {
    var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
    var passwordRegex = /^(?=.*\d)(?=.*[a-z]).{8,20}$/;

    if (emailRegex.test(email) && passwordRegex.test(password)) {
      //pass
      return 1;
    }
    else if (emailRegex.test(email)){
      // Password must contain 8 characters
      return 2;
    }
    else {
      // Invalid email.
      return 3;
    }
  }
}
