import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private userDetailsKey = 'response';
  // private refreshTokenUrl = 'https://unit-session.com/users/refreshToken';
  private refreshTokenUrl = 'http://localhost:8088/users/refreshToken';

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}
  async getJwt(): Promise<string | null> {
    try {
      const userDetails = await this.getUserDetails();
      const token = userDetails?.token;
      const refreshToken = userDetails?.refreshToken;

      if (token) {
        if (this.isTokenExpired(token)) {
          const newToken = await this.fetchNewToken(refreshToken);
          return newToken;
        } else {
          return token;
        }
      } else {
        const newToken = await this.fetchNewToken(refreshToken);
        return newToken;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null; 
    }
  }

  private async fetchNewToken(refreshToken: string): Promise<string | null> {
    try {
      const payload = {"refreshToken" : refreshToken};
      console.log(payload)
      const response: any = await this.http.post(this.refreshTokenUrl, payload).toPromise();

      if (response?.accessToken) {
        const newToken = response.accessToken.trim();
        this.storeTokenWithTimestamp(newToken, refreshToken);
        return newToken;
      } else {
        this.router.navigate(['/login']);
        return null;
      }
    } catch (error) {
      console.error('Error fetching new token:', error);
      return null;
    }
  }

  private storeTokenWithTimestamp(token: string, refreshToken: string): void {
    const userDetails = this.getUserDetails() || {};
    userDetails.token = token;
    userDetails.refreshToken = refreshToken;
    localStorage.setItem(this.userDetailsKey, JSON.stringify(userDetails));
  }

  private getUserDetails(): any {
    return this.userService.getUserDetails();
  }

  private isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

