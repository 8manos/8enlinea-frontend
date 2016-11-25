import {Injectable, Inject} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class AuthService {
    
    isLoggedin: boolean;
    AuthToken;
    host_url;
    
    constructor(public http: Http) {
        this.http = http;
        this.isLoggedin = false;
        this.AuthToken = null;
        this.host_url = "http://ochoenlinea-backend.herokuapp.com";
    }
    
    storeUserCredentials(token) {
        window.localStorage.setItem('raja', token);
        this.useCredentials(token);    
    }
    
    useCredentials(token) {
        this.isLoggedin = true;
        this.AuthToken = token;
    }
    
    loadUserCredentials() {
        var token = window.localStorage.getItem('raja');
        this.useCredentials(token);
    }
    
    destroyUserCredentials() {
        this.isLoggedin = false;
        this.AuthToken = null;
        window.localStorage.clear();
    }
    
    authenticate(user) {
        var creds = "name=" + user.name + "&password=" + user.password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(resolve => {
            this.http.post( this.host_url + '/authenticate', creds, {headers: headers}).subscribe(data => {
                if(data.json().success){
                    this.storeUserCredentials(data.json().token);
                    resolve(true);
                }
                else
                    resolve(false);
            });
        });
    }
    adduser(user) {
        var creds = "name=" + user.name + "&password=" + user.password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(resolve => {
            this.http.post( this.host_url + '/adduser', creds, {headers: headers}).subscribe(data => {
                if(data.json().success){
                    resolve(true);
                }
                else
                    resolve(false);
            });
        });
    }
    
    getinfo() {
        return new Promise(resolve => {
            var headers = new Headers();
            this.loadUserCredentials();
            console.log(this.AuthToken);
            headers.append('Authorization', 'Bearer ' +this.AuthToken);
            this.http.get( this.host_url + '/getinfo', {headers: headers}).subscribe(data => {
                if(data.json().success)
                    resolve(data.json());
                else
                    resolve(false);
            });
        })
    }
    
    logout() {
        this.http.get( this.host_url + '/logout').subscribe(data => {
            if(data.json().success)
                resolve(data.json());
            else
                resolve(false);
        });
    }
}