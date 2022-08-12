import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as moment from 'moment';
import { Router } from '@angular/router';


const jwt = new JwtHelperService();
class DecodedToken {
  userId: string = ''
  username: string = ''
  exp: number = 0
}

@Injectable()
export class AuthService {
  private decodedToken: any

  constructor(
    private http: HttpClient,
    private router: Router
    ) {
    this.decodedToken = new DecodedToken() || localStorage.getItem(JSON.parse(this.decodedToken))
  }

    // getProducts(): Observable<any>{
    //     // return products
    //     return this.http.get('/api/v1/products')
    // }

    getToken() {
      return localStorage.getItem('app-auth')
    }

    isAuthenticated() {
      return moment().isBefore(moment.unix(this.decodedToken.exp))
    }

    register(userDate: string): Observable<any> {
        return this.http.post('/api/v1/users/register', userDate)
    }
    login(userDate: string): Observable<any> {
        return this.http.post('/api/v1/users/login', userDate).pipe(map(
          (token: any) => {
            this.decodedToken= jwt.decodeToken(token)
            localStorage.setItem('app-auth', token)
            localStorage.setItem('app-meta', JSON.stringify(this.decodedToken))
            return token
          }
        ))
    }
    logout(){
      localStorage.removeItem('app-auth')
      localStorage.removeItem('app-meta')
      this.decodedToken = new DecodedToken()
      this.router.navigate(['/login'])
    }
}