import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";

const authUrl = "http://localhost:3000/api/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  
  private token: string;

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  //SIGN UP POST
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(authUrl + "signup", authData).subscribe(response => {
      console.log(response);
    });
  }

  //LOGIN POST
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string }>(authUrl + "login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      });
  }
}
